import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { urlFor } from "@/lib/sanity";

export function GalleryViewer({ gallery }: { gallery: any[] }) {
  const [activeShot, setActiveShot] = useState(0);

  if (!gallery || gallery.length === 0) return null;

  return (
    <div className="space-y-3 pt-4">
      <h2 className="text-[10px] font-semibold uppercase tracking-widest font-mono text-muted-foreground">Gallery</h2>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeShot}
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.99 }}
          transition={{ duration: 0.2 }}
          className="relative w-full aspect-video rounded-2xl overflow-hidden hairline bg-surface/30"
        >
          <GalleryItemRenderer item={gallery[activeShot]} />
        </motion.div>
      </AnimatePresence>

      {gallery.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 snap-x">
          {gallery.map((item, i) => (
            <button
              key={i}
              onClick={() => setActiveShot(i)}
              className={`snap-center shrink-0 relative rounded-xl overflow-hidden hairline transition-all ${
                i === activeShot ? "ring-2 ring-[color:var(--neon)] opacity-100" : "opacity-50 hover:opacity-80"
              }`}
            >
              <GalleryThumbRenderer item={item} index={i} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function getMediaUrl(item: any): string | null {
  if (item._type === "externalMedia") return item.url;
  if (item._type === "file" || item._type === "image") {
    if (item.asset?.url) return item.asset.url;
    if (item._type === "image" && item.asset?._ref) return urlFor(item).width(1600).url();
  }
  if (typeof item === "string") return item;
  return null;
}

function isVideo(item: any): boolean {
  if (item._type === "file" || item._type === "externalMedia") return true;
  if (typeof item === "string") return item.toLowerCase().endsWith(".mp4") || item.includes("youtube.com") || item.includes("vimeo.com");
  return false;
}

function GalleryItemRenderer({ item }: { item: any }) {
  const url = getMediaUrl(item);
  if (!url) return <div className="w-full h-full bg-surface" />;

  const video = isVideo(item);

  if (video) {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const id = url.includes("v=") ? new URL(url).searchParams.get("v") : url.split("/").pop();
      return <iframe src={`https://www.youtube.com/embed/${id}?autoplay=0`} className="w-full h-full" allowFullScreen />;
    }
    if (url.includes("vimeo.com")) {
      const id = url.split("/").pop();
      return <iframe src={`https://player.vimeo.com/video/${id}`} className="w-full h-full" allowFullScreen />;
    }
    return <video src={url} controls className="w-full h-full object-contain bg-black" />;
  }

  return <img src={url} alt="Gallery" className="w-full h-full object-cover" />;
}

function GalleryThumbRenderer({ item, index }: { item: any; index: number }) {
  const url = getMediaUrl(item);
  const video = isVideo(item);

  if (!url) return <div className="h-14 w-24 bg-surface" />;

  if (video) {
    return (
      <div className="h-14 w-24 bg-surface flex items-center justify-center relative">
        <span className="text-[10px] font-mono opacity-50">VIDEO {index + 1}</span>
        <div className="absolute inset-0 flex items-center justify-center">
           <svg className="w-5 h-5 text-foreground/80" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
        </div>
      </div>
    );
  }

  if (item._type === "image" && item.asset?._ref) {
    return <img src={urlFor(item).width(150).url()} alt="" className="h-14 w-24 object-cover" />;
  }

  return <img src={url} alt="" className="h-14 w-24 object-cover" />;
}
