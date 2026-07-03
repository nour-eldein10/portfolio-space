import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Lightbox from "yet-another-react-lightbox";
import Video from "yet-another-react-lightbox/plugins/video";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { urlFor } from "@/lib/sanity";
import { Play, Expand } from "lucide-react";

interface DesignGalleryItem {
  _type?: string;
  asset?: { _ref?: string; url?: string; _id?: string };
  url?: string;
}

function resolveUrl(item: DesignGalleryItem): { url: string; type: "image" | "video" | "external" } | null {
  if (!item) return null;
  if (item._type === "image" && item.asset?._ref) {
    return { url: urlFor(item).width(1600).url(), type: "image" };
  }
  if (item._type === "image" && item.asset?.url) {
    return { url: item.asset.url, type: "image" };
  }
  if (item._type === "file" && item.asset?.url) {
    const url = item.asset.url;
    const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(url);
    return { url, type: isVideo ? "video" : "image" };
  }
  if (item._type === "externalMedia" && item.url) {
    return { url: item.url, type: "external" };
  }
  if (typeof item === "string") {
    const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(item);
    return { url: item, type: isVideo ? "video" : "image" };
  }
  return null;
}

function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm|ogg|mov)$/i.test(url) || url.includes("youtube.com") || url.includes("youtu.be") || url.includes("vimeo.com");
}

export function DesignMasonryGallery({ cover, gallery }: { cover?: string; gallery?: DesignGalleryItem[] }) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const allItems: Array<{ url: string; type: "image" | "video" | "external" }> = [];

  if (cover) {
    const isVid = isVideoUrl(cover);
    allItems.push({ url: cover, type: isVid ? "video" : "image" });
  }

  for (const item of gallery ?? []) {
    const resolved = resolveUrl(item);
    if (resolved) allItems.push(resolved);
  }

  const lightboxSlides = allItems.map((item) => {
    if (item.type === "video") {
      return {
        type: "video" as const,
        sources: [{ src: item.url, type: "video/mp4" }],
      };
    }
    return { src: item.url };
  });

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  if (allItems.length === 0) {
    return (
      <div className="py-32 text-center text-muted-foreground font-mono text-sm uppercase tracking-widest">
        No media available
      </div>
    );
  }

  // Masonry layout: we split into columns
  const columns = 2;
  const columnItems: Array<typeof allItems> = Array.from({ length: columns }, () => []);
  allItems.forEach((item, i) => {
    columnItems[i % columns].push(item);
  });

  // First item is always full-width hero
  const [heroItem, ...restItems] = allItems;
  const col1 = restItems.filter((_, i) => i % 2 === 0);
  const col2 = restItems.filter((_, i) => i % 2 === 1);

  return (
    <div className="w-full space-y-3">
      {/* Hero item - full width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative group cursor-pointer rounded-2xl overflow-hidden bg-surface/50"
        onClick={() => openLightbox(0)}
      >
        <MediaItem item={heroItem} index={0} hero />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 backdrop-blur-sm rounded-full p-4">
            <Expand className="w-6 h-6 text-white" />
          </div>
        </div>
      </motion.div>

      {/* Masonry grid for remaining items */}
      {restItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[col1, col2].map((colItems, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-3">
              {colItems.map((item, rowIdx) => {
                const globalIndex = 1 + (colIdx === 0 ? rowIdx * 2 : rowIdx * 2 + 1);
                return (
                  <motion.div
                    key={globalIndex}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: rowIdx * 0.05 }}
                    className="relative group cursor-pointer rounded-xl overflow-hidden bg-surface/50"
                    onClick={() => openLightbox(globalIndex)}
                  >
                    <MediaItem item={item} index={globalIndex} />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 backdrop-blur-sm rounded-full p-3">
                        {item.type === "video" ? (
                          <Play className="w-5 h-5 text-white fill-white" />
                        ) : (
                          <Expand className="w-5 h-5 text-white" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={lightboxSlides}
        plugins={[Video, Zoom]}
        styles={{
          container: { backgroundColor: "rgba(0,0,0,0.95)" },
        }}
        carousel={{ finite: false }}
        animation={{ swipe: 300 }}
      />
    </div>
  );
}

function MediaItem({
  item,
  index,
  hero = false,
}: {
  item: { url: string; type: "image" | "video" | "external" };
  index: number;
  hero?: boolean;
}) {
  const isVideo = item.type === "video";
  const isExternal = item.type === "external";

  const baseClass = hero
    ? "w-full max-h-[70vh] object-cover"
    : "w-full object-cover";

  if (isVideo && !isExternal) {
    return (
      <div className="relative">
        <video
          src={item.url}
          autoPlay={hero}
          loop
          muted
          playsInline
          className={baseClass}
        />
        {!hero && (
          <div className="absolute top-3 right-3 bg-black/70 text-white text-[10px] font-mono px-2 py-1 rounded-full flex items-center gap-1">
            <Play className="w-2.5 h-2.5 fill-white" />
            VIDEO
          </div>
        )}
      </div>
    );
  }

  if (isExternal) {
    // Try to embed YouTube/Vimeo
    const isYoutube = item.url.includes("youtube.com") || item.url.includes("youtu.be");
    if (isYoutube && hero) {
      const videoId = item.url.includes("youtu.be")
        ? item.url.split("/").pop()
        : new URL(item.url).searchParams.get("v");
      return (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
          className="w-full aspect-video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }
    return (
      <div className="aspect-video flex items-center justify-center bg-surface text-muted-foreground text-sm">
        <Play className="w-8 h-8 mr-2" />
        External Video
      </div>
    );
  }

  return (
    <img
      src={item.url}
      alt={`Gallery item ${index + 1}`}
      className={baseClass}
      loading={hero ? "eager" : "lazy"}
    />
  );
}
