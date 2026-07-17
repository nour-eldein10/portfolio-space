import { useMemo, useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  adminListDocs,
  adminCreateDoc,
  adminUpdateDoc,
  adminDeleteDoc,
  adminUploadImage,
  adminUploadFile,
  adminGetSanityUploadCreds,
  adminReorderDocs,
} from "@/lib/admin-sanity.functions";
import { urlFor } from "@/lib/sanity";
import type { TypeDef, FieldDef } from "@/lib/admin-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  ImagePlus,
  GripVertical,
  Video,
  Link2,
  X,
  Play,
  UploadCloud,
  Search,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

type Doc = Record<string, any> & { _id: string };

export function CrudPage({ def }: { def: TypeDef }) {
  const qc = useQueryClient();
  const list = useServerFn(adminListDocs);
  const create = useServerFn(adminCreateDoc);
  const update = useServerFn(adminUpdateDoc);
  const del = useServerFn(adminDeleteDoc);
  const reorder = useServerFn(adminReorderDocs);

  const key = ["admin", "sanity", def.type] as const;
  const { data: docs = [], isLoading } = useQuery({
    queryKey: key,
    queryFn: () => list({ data: { type: def.type } }),
  });

  const [editing, setEditing] = useState<Doc | null>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  
  // Local state for optimistic drag & drop
  const [orderedDocs, setOrderedDocs] = useState<Doc[]>([]);

  useEffect(() => {
    // Sort docs by `order` field if present, else keep original
    const sorted = [...(docs as Doc[])].sort((a, b) => {
      const orderA = typeof a.order === 'number' ? a.order : 999999;
      const orderB = typeof b.order === 'number' ? b.order : 999999;
      return orderA - orderB;
    });
    setOrderedDocs(sorted);
  }, [docs]);

  function openNew() {
    if (def.singleton && docs[0]) {
      setEditing(docs[0] as Doc);
    } else {
      setEditing({ _id: "", order: orderedDocs.length + 1 } as Doc);
    }
    setOpen(true);
  }
  function openEdit(d: Doc) {
    setEditing(d);
    setOpen(true);
  }

  const saveMut = useMutation({
    mutationFn: async (values: Record<string, any>) => {
      const normalized = { ...values };
      if (normalized.slug && typeof normalized.slug === "string") {
        normalized.slug = { _type: "slug", current: normalized.slug };
      }
      if (editing && editing._id) {
        return update({ data: { id: editing._id, set: normalized } });
      }
      const doc: Record<string, any> = { _type: def.type, ...normalized };
      if (def.singleton && def.singletonId) doc._id = def.singletonId;
      return create({ data: { doc } });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: key });
      qc.invalidateQueries({ queryKey: ["cms"] });
      qc.invalidateQueries({ queryKey: ["stats", "content"] });
      toast.success("Saved");
      setOpen(false);
    },
    onError: (e: any) => toast.error(e?.message ?? "Save failed"),
  });

  const delMut = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: key });
      qc.invalidateQueries({ queryKey: ["cms"] });
      qc.invalidateQueries({ queryKey: ["stats", "content"] });
      toast.success("Deleted");
    },
    onError: (e: any) => toast.error(e?.message ?? "Delete failed"),
  });

  const reorderMut = useMutation({
    mutationFn: (items: { id: string; order: number }[]) => reorder({ data: { items } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: key });
      qc.invalidateQueries({ queryKey: ["cms"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Reorder failed"),
  });

  const filteredDocs = orderedDocs.filter((d) => {
    if (!search) return true;
    const s = search.toLowerCase();
    const title = String(d[def.titleField] ?? "").toLowerCase();
    const subtitle = String(def.subtitleField ? d[def.subtitleField] : "").toLowerCase();
    return title.includes(s) || subtitle.includes(s);
  });

  function onDragEnd(result: any) {
    if (!result.destination || search) return; // Disable drop if searching
    if (result.destination.index === result.source.index) return;

    const newDocs = Array.from(orderedDocs);
    const [reorderedItem] = newDocs.splice(result.source.index, 1);
    newDocs.splice(result.destination.index, 0, reorderedItem);

    setOrderedDocs(newDocs);

    // Save new order to backend
    const updates = newDocs.map((doc, index) => ({
      id: doc._id,
      order: index + 1,
    }));
    reorderMut.mutate(updates);
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-tight">{def.label}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {def.singleton ? "Edit the single document." : `Manage all ${def.label.toLowerCase()}.`}
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {!def.singleton && (
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          )}
          {!def.singleton && (
            <Button onClick={openNew} className="shrink-0 h-9">
              <Plus className="h-4 w-4 mr-1.5" /> New {def.singular.toLowerCase()}
            </Button>
          )}
          {def.singleton && docs.length === 0 && (
            <Button onClick={openNew} className="h-9">
              <Plus className="h-4 w-4 mr-1.5" /> Create
            </Button>
          )}
        </div>
      </div>

      <div className="mt-8">
        {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {!isLoading && docs.length === 0 && (
          <div className="hairline rounded-2xl p-8 text-center text-sm text-muted-foreground">
            Nothing yet.{" "}
            {def.singleton
              ? "Create the profile."
              : `Add your first ${def.singular.toLowerCase()}.`}
          </div>
        )}
        
        {/* Drag and drop context */}
        {!def.singleton && !isLoading && docs.length > 0 && (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="docs">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {filteredDocs.map((d, index) => (
                    <Draggable key={d._id} draggableId={d._id} index={index} isDragDisabled={!!search}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={provided.draggableProps.style as React.CSSProperties}
                          className={`transition-opacity ${snapshot.isDragging ? 'opacity-80' : ''}`}
                        >
                          <DocRow
                            def={def}
                            doc={d}
                            onEdit={() => openEdit(d)}
                            onDelete={() => {
                              if (confirm(`Delete "${d[def.titleField] ?? "this"}"?`)) delMut.mutate(d._id);
                            }}
                            singleton={false}
                            dragHandleProps={provided.dragHandleProps}
                            isSearchActive={!!search}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}

        {def.singleton && !isLoading && docs.length > 0 && (
          <div className="space-y-2">
            {filteredDocs.map((d) => (
              <DocRow
                key={d._id}
                def={def}
                doc={d}
                onEdit={() => openEdit(d)}
                onDelete={() => {}}
                singleton={true}
              />
            ))}
          </div>
        )}
        
        {!isLoading && docs.length > 0 && filteredDocs.length === 0 && (
          <div className="hairline rounded-2xl p-8 text-center text-sm text-muted-foreground">
            No results found for "{search}".
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing?._id
                ? `Edit ${def.singular.toLowerCase()}`
                : `New ${def.singular.toLowerCase()}`}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <CrudForm
              def={def}
              initial={editing}
              submitting={saveMut.isPending}
              onSubmit={(v) => saveMut.mutate(v)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DocRow({
  def,
  doc,
  onEdit,
  onDelete,
  singleton,
  dragHandleProps,
  isSearchActive,
}: {
  def: TypeDef;
  doc: Doc;
  onEdit: () => void;
  onDelete: () => void;
  singleton?: boolean;
  dragHandleProps?: any;
  isSearchActive?: boolean;
}) {
  const title = doc[def.titleField] ?? "Untitled";
  const subtitle = def.subtitleField ? doc[def.subtitleField] : undefined;
  const img =
    def.imageField && doc[def.imageField]?.asset
      ? urlFor(doc[def.imageField]).width(120).height(120).url()
      : null;

  return (
    <div className="hairline rounded-2xl p-4 flex items-center gap-4 bg-surface/30 group">
      {!singleton && (
        <div 
          className={`shrink-0 flex items-center justify-center w-6 h-6 rounded-md ${isSearchActive ? 'opacity-30 cursor-not-allowed' : 'text-muted-foreground hover:bg-surface hover:text-foreground cursor-grab active:cursor-grabbing'}`}
          {...(isSearchActive ? {} : dragHandleProps)}
        >
          <GripVertical className="h-4 w-4" />
        </div>
      )}
      {img && <img src={img} alt="" className="h-14 w-14 rounded-lg object-cover" />}
      <div className="min-w-0 flex-1">
        <p className="font-medium truncate">{String(title)}</p>
        {subtitle && <p className="text-sm text-muted-foreground truncate">{String(subtitle)}</p>}
      </div>
      <Button variant="ghost" size="sm" onClick={onEdit}>
        <Pencil className="h-4 w-4" />
      </Button>
      {!singleton && (
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      )}
    </div>
  );
}

function CrudForm({
  def,
  initial,
  onSubmit,
  submitting,
}: {
  def: TypeDef;
  initial: Doc;
  onSubmit: (v: Record<string, any>) => void;
  submitting: boolean;
}) {
  const initialValues = useMemo(() => {
    const v: Record<string, any> = {};
    for (const f of def.fields) {
      const raw = initial[f.name];
      if (f.kind === "tags" || f.kind === "highlights" || f.kind === "medialist") {
        v[f.name] = Array.isArray(raw) ? raw.join(f.kind === "tags" ? ", " : "\n") : "";
      } else if (f.name === "slug" && raw && typeof raw === "object") {
        v[f.name] = raw.current ?? "";
      } else if (f.kind === "boolean") {
        v[f.name] = !!raw;
      } else if (f.kind === "image") {
        v[f.name] = raw ?? null;
      } else {
        v[f.name] = raw ?? "";
      }
    }
    return v;
  }, [def, initial]);

  const [values, setValues] = useState(initialValues);
  const isNew = !initial._id;

  function set<K extends string>(k: K, v: any) {
    setValues((s) => {
      const next = { ...s, [k]: v };
      // Auto-generate slug from name for new docs only
      if (k === "name" && isNew && !s.slug) {
        next.slug = String(v)
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
      }
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const out: Record<string, any> = {};
    for (const f of def.fields) {
      const v = values[f.name];
      if (f.kind === "tags") {
        out[f.name] = String(v ?? "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      } else if (f.kind === "highlights" || f.kind === "medialist") {
        out[f.name] = String(v ?? "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
      } else if (f.kind === "number") {
        out[f.name] = v === "" || v == null ? undefined : Number(v);
      } else if (f.kind === "image" || f.kind === "gallery") {
        if (v) out[f.name] = v;
      } else {
        out[f.name] = v;
      }
    }
    onSubmit(out);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {def.fields.map((f) => (
        <FieldInput
          key={f.name}
          f={f}
          docType={def.type}
          value={values[f.name]}
          onChange={(v) => set(f.name, v)}
          onBlur={
            f.name === "name" && isNew
              ? () => {
                  // Re-run slug gen on blur if still empty
                  if (!values.slug && values.name) {
                    set(
                      "slug",
                      String(values.name)
                        .toLowerCase()
                        .trim()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-|-$/g, ""),
                    );
                  }
                }
              : undefined
          }
        />
      ))}
      <DialogFooter className="pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Save
        </Button>
      </DialogFooter>
    </form>
  );
}

function FieldInput({
  f,
  docType,
  value,
  onChange,
  onBlur,
}: {
  f: FieldDef;
  docType: string;
  value: any;
  onChange: (v: any) => void;
  onBlur?: () => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label>
        {f.label}
        {f.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {f.kind === "text" && f.name === "slug" && (
        <div className="space-y-2">
          <Input
            value={value ?? ""}
            onChange={(e) => {
              // Strict validation: lowercase, numbers, hyphens only
              const v = e.target.value
                .toLowerCase()
                .replace(/[^a-z0-9-]/g, "")
                .replace(/-+/g, "-");
              onChange(v);
            }}
            onBlur={onBlur}
            required={f.required}
            className="font-mono"
            placeholder="my-awesome-project"
          />
          {value && (
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 bg-surface/50 p-2 rounded-md hairline">
              <Link2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                https://noureldein.com/
                {docType === "app"
                  ? "apps"
                  : docType === "product"
                    ? "products"
                    : docType === "design"
                      ? "designs"
                      : docType}
                s/<span className="text-foreground font-medium">{value}</span>
              </span>
            </p>
          )}
        </div>
      )}
      {f.kind === "text" && f.name !== "slug" && (
        <Input
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          required={f.required}
        />
      )}
      {f.kind === "number" && (
        <Input type="number" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
      )}
      {f.kind === "textarea" && (
        <Textarea
          rows={4}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          required={f.required}
        />
      )}
      {f.kind === "tags" && (
        <Input
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="tag1, tag2, tag3"
        />
      )}
      {(f.kind === "highlights" || f.kind === "medialist") && (
        <Textarea
          rows={4}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={"One per line"}
        />
      )}
      {f.kind === "boolean" && (
        <div className="flex items-center gap-2">
          <Switch checked={!!value} onCheckedChange={onChange} />
        </div>
      )}
      {f.kind === "select" && (
        <Select value={value ?? ""} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select…" />
          </SelectTrigger>
          <SelectContent>
            {f.options?.map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {f.kind === "image" && <ImageInput value={value} onChange={onChange} />}
      {f.kind === "file" && <FileInput value={value} onChange={onChange} accept={f.options?.join(",") || "*"} />}
      {f.kind === "gallery" && <GalleryInput value={value} onChange={onChange} />}
      {f.helper && <p className="text-xs text-muted-foreground">{f.helper}</p>}
    </div>
  );
}

function ImageInput({ value, onChange }: { value: any; onChange: (v: any) => void }) {
  const upload = useServerFn(adminUploadImage);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const preview = value?.asset?._ref ? urlFor(value).width(400).url() : (value?.asset?.url ?? null);

  async function handleFile(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }
    setBusy(true);
    setProgress(10);
    try {
      const dataUrl: string = await new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.onerror = () => reject(r.error);
        r.readAsDataURL(file);
      });
      setProgress(50);
      const result = await upload({ data: { dataUrl, filename: file.name } });
      setProgress(100);
      onChange(result);
      toast.success("Image uploaded");
    } catch (err: any) {
      toast.error(err?.message ?? "Upload failed");
    } finally {
      setTimeout(() => {
        setBusy(false);
        setProgress(0);
      }, 500);
    }
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  }

  return (
    <div className="flex items-start gap-4">
      {preview && (
        <img src={preview} alt="" className="h-24 w-24 rounded-lg object-cover hairline" />
      )}
      <div className="flex-1 max-w-[300px]">
        <label
          className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
            isDragging
              ? "border-[color:var(--neon)] bg-[color:var(--neon)]/10"
              : "border-border hover:bg-surface/50"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPick}
            disabled={busy}
          />
          {busy ? (
            <div className="flex flex-col items-center gap-2 w-full">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <Progress value={progress} className="h-1.5 w-full" />
              <span className="text-xs text-muted-foreground font-mono">Uploading...</span>
            </div>
          ) : (
            <>
              <UploadCloud className="h-6 w-6 mb-2 text-muted-foreground" />
              <span className="text-sm font-medium">Click or drag image here</span>
              <span className="text-xs text-muted-foreground mt-1">Max 5MB</span>
            </>
          )}
        </label>
      </div>
    </div>
  );
}

/** Upload a file directly from the browser to Sanity's Assets API (bypasses CF payload limits). */
function uploadDirectToSanity(
  file: File,
  creds: { token: string; projectId: string; dataset: string; apiVersion: string },
  onProgress: (pct: number) => void,
): Promise<{ _type: "file"; asset: { _type: "reference"; _ref: string } }> {
  return new Promise((resolve, reject) => {
    const url = `https://api.sanity.io/v${creds.apiVersion}/assets/files/${creds.projectId}?dataset=${creds.dataset}&filename=${encodeURIComponent(file.name)}`;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Authorization", `Bearer ${creds.token}`);
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 95));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          const assetId = res.document?._id ?? res._id;
          if (!assetId) throw new Error("No asset ID returned");
          onProgress(100);
          resolve({ _type: "file", asset: { _type: "reference", _ref: assetId } });
        } catch (e) {
          reject(new Error("Failed to parse Sanity response"));
        }
      } else {
        reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(file);
  });
}

function FileInput({ value, onChange, accept }: { value: any; onChange: (v: any) => void, accept?: string }) {
  const uploadFile = useServerFn(adminUploadFile);
  const getUploadCreds = useServerFn(adminGetSanityUploadCreds);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  async function handleFile(file: File) {
    if (file.size > 200 * 1024 * 1024) {
      toast.error("File must be under 200 MB");
      return;
    }
    setBusy(true);
    setProgress(5);
    try {
      // For large files (>5 MB) upload directly from browser to Sanity
      // to bypass the server-function / CF payload limit.
      if (file.size > 5 * 1024 * 1024) {
        const creds = await getUploadCreds({});
        const ref = await uploadDirectToSanity(file, creds, setProgress);
        onChange(ref);
      } else {
        const formData = new FormData();
        formData.append("file", file);
        const result = await uploadFile({ data: formData });
        setProgress(100);
        onChange(result);
      }
      toast.success("File uploaded successfully");
    } catch (err: any) {
      toast.error(err?.message ?? "Upload failed");
    } finally {
      setTimeout(() => {
        setBusy(false);
        setProgress(0);
      }, 500);
    }
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="flex flex-col gap-2">
      {value?.asset?._ref && (
        <div className="text-sm p-3 hairline bg-surface/50 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-primary" />
            <span className="font-mono truncate max-w-[200px]">{value.asset._ref}</span>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}>
            <X className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      )}
      <label
        className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
          isDragging
            ? "border-[color:var(--neon)] bg-[color:var(--neon)]/10"
            : "border-border hover:bg-surface/50"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
      >
        <input type="file" accept={accept} className="hidden" onChange={onPick} disabled={busy} />
        {busy ? (
          <div className="flex flex-col items-center gap-2 w-full">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <Progress value={progress} className="h-1.5 w-full max-w-[200px]" />
            <span className="text-xs text-muted-foreground font-mono">Uploading file...</span>
          </div>
        ) : (
          <>
            <UploadCloud className="h-6 w-6 mb-2 text-muted-foreground" />
            <span className="text-sm font-medium">Click or drag file here</span>
            <span className="text-xs text-muted-foreground mt-1 text-center">Max 200MB</span>
          </>
        )}
      </label>
    </div>
  );
}

function GalleryInput({ value, onChange }: { value: any[]; onChange: (v: any[]) => void }) {
  const uploadImg = useServerFn(adminUploadImage);
  const uploadFile = useServerFn(adminUploadFile);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [external, setExternal] = useState("");

  const items = Array.isArray(value) ? value : [];

  async function handleFiles(files: File[]) {
    if (files.length === 0) return;

    setBusy(true);
    setProgress(10);
    const uploadedItems: any[] = [];
    try {
      const step = 90 / files.length;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isVideo = file.type.startsWith("video/");
        const isImage = file.type.startsWith("image/");

        if (isVideo && file.size > 50 * 1024 * 1024) {
          toast.error(`Video ${file.name} must be under 50 MB`);
          continue;
        }
        if (isImage && file.size > 5 * 1024 * 1024) {
          toast.error(`Image ${file.name} must be under 5 MB`);
          continue;
        }

        if (isImage) {
          const dataUrl: string = await new Promise((resolve, reject) => {
            const r = new FileReader();
            r.onload = () => resolve(r.result as string);
            r.onerror = () => reject(r.error);
            r.readAsDataURL(file);
          });
          const result = await uploadImg({ data: { dataUrl, filename: file.name } });
          uploadedItems.push({ ...result, _key: Math.random().toString(36).substring(7) });
        } else if (isVideo) {
          const formData = new FormData();
          formData.append("file", file);
          const result = await uploadFile({ data: formData });
          uploadedItems.push({ ...result, _key: Math.random().toString(36).substring(7) });
        }
        setProgress(10 + step * (i + 1));
      }
      onChange([...items, ...uploadedItems]);
      if (uploadedItems.length > 0) {
        toast.success(`Uploaded ${uploadedItems.length} item(s)`);
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Upload failed");
    } finally {
      setTimeout(() => {
        setBusy(false);
        setProgress(0);
      }, 500);
    }
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
    e.target.value = ""; // reset input
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files || []);
    handleFiles(files);
  }

  function addExternal() {
    if (!external) return;
    onChange([...items, { _type: "externalMedia", url: external, _key: Math.random().toString(36).substring(7) }]);
    setExternal("");
  }

  function move(index: number, dir: number) {
    if (index + dir < 0 || index + dir >= items.length) return;
    const next = [...items];
    const temp = next[index];
    next[index] = next[index + dir];
    next[index + dir] = temp;
    onChange(next);
  }

  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      {items.length > 0 && (
        <DragDropContext onDragEnd={(result) => {
          if (!result.destination) return;
          const newItems = Array.from(items);
          const [reorderedItem] = newItems.splice(result.source.index, 1);
          newItems.splice(result.destination.index, 0, reorderedItem);
          onChange(newItems);
        }}>
          <Droppable droppableId="gallery-items">
            {(provided) => (
              <div 
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex flex-col gap-2"
              >
                {items.map((item, i) => {
                  const keyId = item._key || `item-${i}`;
                  return (
                    <Draggable key={keyId} draggableId={keyId} index={i}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={provided.draggableProps.style as React.CSSProperties}
                          className={`flex items-center gap-3 p-2 hairline rounded-lg bg-surface/30 transition-opacity ${snapshot.isDragging ? 'opacity-80' : ''}`}
                        >
                          <div 
                            {...provided.dragHandleProps}
                            className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing px-1"
                          >
                            <GripVertical className="h-4 w-4" />
                          </div>

                          {item._type === "image" && (
                            <div className="h-12 w-16 bg-surface shrink-0 rounded overflow-hidden relative flex items-center justify-center">
                              {item.asset?._ref ? (
                                <img
                                  src={urlFor(item).width(200).url()}
                                  alt=""
                                  className="object-cover h-full w-full"
                                />
                              ) : item.asset?.url ? (
                                <img src={item.asset.url} alt="" className="object-cover h-full w-full" />
                              ) : (
                                <ImagePlus className="h-4 w-4 text-muted-foreground" />
                              )}
                  <span className="absolute bottom-0 right-0 bg-black/60 text-[8px] font-mono px-1 py-0.5">
                    IMG
                  </span>
                </div>
              )}

              {item._type === "file" && (
                <div className="h-12 w-16 bg-surface shrink-0 rounded flex flex-col items-center justify-center gap-1">
                  <Video className="h-4 w-4 text-muted-foreground" />
                  <span className="absolute bottom-0 right-0 bg-black/60 text-[8px] font-mono px-1 py-0.5">
                    MP4
                  </span>
                </div>
              )}

              {item._type === "externalMedia" && (
                <div className="h-12 w-16 bg-surface shrink-0 rounded flex flex-col items-center justify-center gap-1">
                  <Link2 className="h-4 w-4 text-muted-foreground" />
                  <span className="absolute bottom-0 right-0 bg-black/60 text-[8px] font-mono px-1 py-0.5">
                    URL
                  </span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-xs truncate font-mono">
                  {item._type === "externalMedia" ? item.url : item.asset?._ref || "Uploaded media"}
                </p>
              </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(i)}
                    className="h-8 w-8 text-destructive hover:bg-destructive/10 shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <div className="space-y-3">
        <label
          className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
            isDragging
              ? "border-[color:var(--neon)] bg-[color:var(--neon)]/10"
              : "border-border hover:bg-surface/50"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
        >
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={onPick}
            disabled={busy}
          />
          {busy ? (
            <div className="flex flex-col items-center gap-3 w-full max-w-xs">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <Progress value={progress} className="h-2 w-full" />
              <span className="text-sm text-muted-foreground font-mono">Uploading media...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <UploadCloud className="h-8 w-8 mb-3 text-muted-foreground" />
              <span className="text-sm font-medium">Click to upload or drag and drop</span>
              <span className="text-xs text-muted-foreground mt-1">
                Images (max 5MB) or Videos (max 50MB)
              </span>
            </div>
          )}
        </label>

        <div className="flex items-center gap-2 pt-2 border-t border-border/30">
          <Input
            placeholder="Or paste external video URL (YouTube, Vimeo...)"
            value={external}
            onChange={(e) => setExternal(e.target.value)}
            className="h-9 text-xs font-mono bg-surface/30"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addExternal();
              }
            }}
          />
          <Button
            type="button"
            onClick={addExternal}
            size="sm"
            variant="secondary"
            className="h-9 shrink-0"
          >
            Add URL
          </Button>
        </div>
      </div>
    </div>
  );
}
