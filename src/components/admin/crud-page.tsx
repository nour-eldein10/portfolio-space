import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  adminListDocs,
  adminCreateDoc,
  adminUpdateDoc,
  adminDeleteDoc,
  adminUploadImage,
  adminUploadFile,
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
import { Plus, Pencil, Trash2, Loader2, ImagePlus, GripVertical, Video, Link2, X, Play } from "lucide-react";

type Doc = Record<string, any> & { _id: string };

export function CrudPage({ def }: { def: TypeDef }) {
  const qc = useQueryClient();
  const list = useServerFn(adminListDocs);
  const create = useServerFn(adminCreateDoc);
  const update = useServerFn(adminUpdateDoc);
  const del = useServerFn(adminDeleteDoc);

  const key = ["admin", "sanity", def.type] as const;
  const { data: docs = [], isLoading } = useQuery({
    queryKey: key,
    queryFn: () => list({ data: { type: def.type } }),
  });

  const [editing, setEditing] = useState<Doc | null>(null);
  const [open, setOpen] = useState(false);

  function openNew() {
    if (def.singleton && docs[0]) {
      setEditing(docs[0] as Doc);
    } else {
      setEditing({ _id: "" } as Doc);
    }
    setOpen(true);
  }
  function openEdit(d: Doc) {
    setEditing(d);
    setOpen(true);
  }

  const saveMut = useMutation({
    mutationFn: async (values: Record<string, any>) => {
      // Always normalize slug to Sanity object format
      const normalized = { ...values };
      if (normalized.slug && typeof normalized.slug === "string") {
        normalized.slug = { _type: "slug", current: normalized.slug };
      }
      if (editing && editing._id) {
        // existing - patch
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

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-tight">{def.label}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {def.singleton ? "Edit the single document." : `Manage all ${def.label.toLowerCase()}.`}
          </p>
        </div>
        {!def.singleton && (
          <Button onClick={openNew}>
            <Plus className="h-4 w-4 mr-1.5" /> New {def.singular.toLowerCase()}
          </Button>
        )}
        {def.singleton && docs.length === 0 && (
          <Button onClick={openNew}>
            <Plus className="h-4 w-4 mr-1.5" /> Create
          </Button>
        )}
      </div>

      <div className="mt-8 space-y-2">
        {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {!isLoading && docs.length === 0 && (
          <div className="hairline rounded-2xl p-8 text-center text-sm text-muted-foreground">
            Nothing yet.{" "}
            {def.singleton
              ? "Create the profile."
              : `Add your first ${def.singular.toLowerCase()}.`}
          </div>
        )}
        {(docs as Doc[]).map((d) => (
          <DocRow
            key={d._id}
            def={def}
            doc={d}
            onEdit={() => openEdit(d)}
            onDelete={() => {
              if (confirm(`Delete "${d[def.titleField] ?? "this"}"?`)) delMut.mutate(d._id);
            }}
            singleton={def.singleton}
          />
        ))}
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
}: {
  def: TypeDef;
  doc: Doc;
  onEdit: () => void;
  onDelete: () => void;
  singleton?: boolean;
}) {
  const title = doc[def.titleField] ?? "Untitled";
  const subtitle = def.subtitleField ? doc[def.subtitleField] : undefined;
  const img =
    def.imageField && doc[def.imageField]?.asset
      ? urlFor(doc[def.imageField]).width(120).height(120).url()
      : null;

  return (
    <div className="hairline rounded-2xl p-4 flex items-center gap-4 bg-surface/30">
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
          onBlur={f.name === "name" && isNew ? () => {
            // Re-run slug gen on blur if still empty
            if (!values.slug && values.name) {
              set("slug", String(values.name).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
            }
          } : undefined}
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
              const v = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-");
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
              <span className="truncate">https://noureldein.com/{docType === "app" ? "apps" : docType === "product" ? "products" : docType === "design" ? "designs" : docType}s/<span className="text-foreground font-medium">{value}</span></span>
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
      {f.kind === "gallery" && <GalleryInput value={value} onChange={onChange} />}
      {f.helper && <p className="text-xs text-muted-foreground">{f.helper}</p>}
    </div>
  );
}

function ImageInput({ value, onChange }: { value: any; onChange: (v: any) => void }) {
  const upload = useServerFn(adminUploadImage);
  const [busy, setBusy] = useState(false);
  const preview = value?.asset?._ref ? urlFor(value).width(400).url() : (value?.asset?.url ?? null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }
    setBusy(true);
    try {
      const dataUrl: string = await new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.onerror = () => reject(r.error);
        r.readAsDataURL(file);
      });
      const result = await upload({ data: { dataUrl, filename: file.name } });
      onChange(result);
      toast.success("Image uploaded");
    } catch (err: any) {
      toast.error(err?.message ?? "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-start gap-4">
      {preview && (
        <img src={preview} alt="" className="h-24 w-24 rounded-lg object-cover hairline" />
      )}
      <label className="cursor-pointer">
        <input type="file" accept="image/*" className="hidden" onChange={onPick} disabled={busy} />
        <span className="inline-flex items-center gap-2 px-3 py-2 hairline rounded-md text-sm hover:bg-surface/50">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
          {preview ? "Replace image" : "Upload image"}
        </span>
      </label>
    </div>
  );
}

function GalleryInput({ value, onChange }: { value: any[]; onChange: (v: any[]) => void }) {
  const uploadImg = useServerFn(adminUploadImage);
  const uploadFile = useServerFn(adminUploadFile);
  const [busy, setBusy] = useState(false);
  const [external, setExternal] = useState("");

  const items = Array.isArray(value) ? value : [];

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "video" && file.size > 50 * 1024 * 1024) {
      toast.error("Video must be under 50 MB");
      return;
    }
    if (type === "image" && file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }

    setBusy(true);
    try {
      if (type === "image") {
        const dataUrl: string = await new Promise((resolve, reject) => {
          const r = new FileReader();
          r.onload = () => resolve(r.result as string);
          r.onerror = () => reject(r.error);
          r.readAsDataURL(file);
        });
        const result = await uploadImg({ data: { dataUrl, filename: file.name } });
        onChange([...items, result]);
      } else {
        const formData = new FormData();
        formData.append("file", file);
        const result = await uploadFile({ data: formData });
        onChange([...items, result]);
      }
      toast.success("Uploaded successfully");
    } catch (err: any) {
      toast.error(err?.message ?? "Upload failed");
    } finally {
      setBusy(false);
      e.target.value = ""; // reset input
    }
  }

  function addExternal() {
    if (!external) return;
    onChange([...items, { _type: "externalMedia", url: external }]);
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
        <div className="flex flex-col gap-2">
          {items.map((item, i) => (
            <div key={item._key || i} className="flex items-center gap-3 p-2 hairline rounded-lg bg-surface/30">
              <div className="flex flex-col gap-1">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-30">
                  <GripVertical className="h-3 w-3" />
                </button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="text-muted-foreground hover:text-foreground disabled:opacity-30">
                  <GripVertical className="h-3 w-3" />
                </button>
              </div>

              {item._type === "image" && (
                <div className="h-12 w-16 bg-surface shrink-0 rounded overflow-hidden relative flex items-center justify-center">
                  {item.asset?._ref ? (
                    <img src={urlFor(item).width(200).url()} alt="" className="object-cover h-full w-full" />
                  ) : item.asset?.url ? (
                    <img src={item.asset.url} alt="" className="object-cover h-full w-full" />
                  ) : (
                    <ImagePlus className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="absolute bottom-0 right-0 bg-black/60 text-[8px] font-mono px-1 py-0.5">IMG</span>
                </div>
              )}

              {item._type === "file" && (
                <div className="h-12 w-16 bg-surface shrink-0 rounded flex flex-col items-center justify-center gap-1">
                  <Video className="h-4 w-4 text-muted-foreground" />
                  <span className="absolute bottom-0 right-0 bg-black/60 text-[8px] font-mono px-1 py-0.5">MP4</span>
                </div>
              )}

              {item._type === "externalMedia" && (
                <div className="h-12 w-16 bg-surface shrink-0 rounded flex flex-col items-center justify-center gap-1">
                  <Link2 className="h-4 w-4 text-muted-foreground" />
                  <span className="absolute bottom-0 right-0 bg-black/60 text-[8px] font-mono px-1 py-0.5">URL</span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-xs truncate font-mono">
                  {item._type === "externalMedia" ? item.url : item.asset?._ref || "Uploaded media"}
                </p>
              </div>

              <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)} className="h-8 w-8 text-destructive hover:bg-destructive/10 shrink-0">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2 items-center bg-surface/30 p-3 rounded-lg hairline">
        <label className="cursor-pointer">
          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, "image")} disabled={busy} />
          <div className="inline-flex items-center gap-2 px-3 py-2 bg-surface hairline rounded-md text-sm hover:bg-surface-2 transition-colors">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
            Image
          </div>
        </label>
        
        <label className="cursor-pointer">
          <input type="file" accept="video/*" className="hidden" onChange={(e) => handleUpload(e, "video")} disabled={busy} />
          <div className="inline-flex items-center gap-2 px-3 py-2 bg-surface hairline rounded-md text-sm hover:bg-surface-2 transition-colors">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Video className="h-4 w-4" />}
            Video
          </div>
        </label>

        <div className="flex-1 min-w-[200px] flex items-center gap-2">
          <Input 
            placeholder="Paste external video URL" 
            value={external}
            onChange={e => setExternal(e.target.value)}
            className="h-9 text-xs font-mono"
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addExternal(); } }}
          />
          <Button type="button" onClick={addExternal} size="sm" variant="secondary" className="h-9 shrink-0">
            Add URL
          </Button>
        </div>
      </div>
    </div>
  );
}
