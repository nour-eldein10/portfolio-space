/**
 * GalleryViewer ÔÇö Behance-style masonry gallery
 *
 * ÔöÇÔöÇÔöÇ HOW TO ADJUST DIMENSIONS ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
 *
 * POSTER ASPECT RATIO (main preview grid items):
 *   Look for the constant POSTER_ASPECT below.
 *   Change the value to any CSS aspect-ratio string, e.g.:
 *     "16 / 9"  ÔåÆ wide cinema (default)
 *     "4 / 3"   ÔåÆ classic landscape
 *     "1 / 1"   ÔåÆ square
 *     "3 / 2"   ÔåÆ photography landscape
 *
 * LIGHTBOX IMAGE SIZE:
 *   In <GalleryItemRenderer> when inLightbox=true, the img uses max-h-[85vh].
 *   Change 85vh to any value (e.g., max-h-[95vh] for bigger).
 *
 * COLUMN COUNT (masonry grid):
 *   Look for the masonry grid className below (columns-1 sm:columns-2 lg:columns-3).
 *   Remove lg:columns-3 for 2-col max, or add xl:columns-4 for 4-col on xl screens.
 *
 * THUMBNAIL SIZE (lightbox bottom strip):
 *   Look for `flex-[0_0_140px]` in the lightbox thumbnails section.
 *   Increase to flex-[0_0_180px] for bigger thumbs.
 *
 * IMAGE FITTING:
 *   Main previews use `object-contain` (no cropping).
 *   To switch to cover (cropped-fill), replace `object-contain` with `object-cover`.
 *
 * ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { urlFor } from "@/lib/sanity";
import { Play, Maximize2, ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

// ÔöÇÔöÇ CHANGE THIS to adjust the default aspect ratio of all gallery cards ÔöÇÔöÇÔöÇ
const POSTER_ASPECT = "16 / 9"; // e.g. "16 / 9" | "4 / 3" | "3 / 2" | "1 / 1"

export function MasonryGallery({
  gallery,
  isMobileMockup,
}: {
  gallery: any[];
  isMobileMockup?: boolean;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);
  const thumbsRef = useRef<HTMLDivElement>(null);

  const openLightbox = (i: number) => {
    setDirection(0);
    setLightboxIndex(i);
  };

  const closeLightbox = () => setLightboxIndex(null);

  const prev = useCallback(() => {
    if (lightboxIndex === null) return;
    setDirection(-1);
    setLightboxIndex((p) => ((p ?? 0) - 1 + gallery.length) % gallery.length);
  }, [lightboxIndex, gallery.length]);

  const next = useCallback(() => {
    if (lightboxIndex === null) return;
    setDirection(1);
    setLightboxIndex((p) => ((p ?? 0) + 1) % gallery.length);
  }, [lightboxIndex, gallery.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handler);
    
    const wheelHandler = (e: WheelEvent) => {
      if (lightboxIndex === null) return;
      if (e.deltaY > 0) next();
      else if (e.deltaY < 0) prev();
    };
    window.addEventListener("wheel", wheelHandler);
    
    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("wheel", wheelHandler);
    };
  }, [lightboxIndex, next, prev]);

  // Scroll active thumb into view
  useEffect(() => {
    if (lightboxIndex === null || !thumbsRef.current) return;
    const thumb = thumbsRef.current.children[lightboxIndex] as HTMLElement;
    thumb?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [lightboxIndex]);

  if (!gallery || gallery.length === 0) return null;

  return (
    <section aria-label="Project gallery" className="pt-6">
      {/* ÔöÇÔöÇ SECTION HEADER ÔöÇÔöÇ */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[10px] font-mono font-semibold uppercase tracking-widest text-muted-foreground">
          Gallery
          <span className="ml-2 text-foreground/40">({gallery.length})</span>
        </h2>
        <button
          onClick={() => openLightbox(0)}
          aria-label="Open fullscreen gallery"
          title="Open fullscreen gallery"
          className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          Fullscreen
        </button>
      </div>

      {/* ÔöÇÔöÇ MASONRY GRID ÔöÇÔöÇ */}
      {/*
        Adjust column count here:
          columns-1               ÔåÆ 1 column on all screens
          sm:columns-2            ÔåÆ 2 columns on sm+
          lg:columns-2            ÔåÆ 2 columns on lg (remove lg:columns-3 below)
          lg:columns-3            ÔåÆ 3 columns on lg+ (default)
          xl:columns-4            ÔåÆ 4 columns on xl+ (add this for very wide screens)
      */}
      <div className="columns-1 sm:columns-2 lg:columns-2 gap-4 space-y-4">
        {gallery.map((item, i) => (
          <GalleryCard
            key={i}
            item={item}
            index={i}
            isMobileMockup={isMobileMockup}
            onOpen={() => openLightbox(i)}
          />
        ))}
      </div>

      {/* ÔöÇÔöÇ LIGHTBOX ÔöÇÔöÇ */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[200] flex flex-col bg-black/97 backdrop-blur-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Image lightbox"
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 py-4 z-10 shrink-0">
              <span className="font-mono text-xs text-white/50 tracking-widest">
                {lightboxIndex + 1} / {gallery.length}
              </span>
              <button
                onClick={closeLightbox}
                aria-label="Close lightbox"
                title="Close lightbox"
                className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main image area */}
            <div className="relative flex-1 flex items-center justify-center overflow-hidden px-4 md:px-16">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={lightboxIndex}
                  custom={direction}
                  initial={{ opacity: 0, x: direction > 0 ? 80 : -80, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: direction > 0 ? -80 : 80, scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 350, damping: 35 }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <GalleryItemRenderer
                    item={gallery[lightboxIndex]}
                    inLightbox
                    isMobileMockup={false}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Nav arrows */}
              {gallery.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    aria-label="Previous image"
                    title="Previous image"
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/5 text-white hover:bg-white/15 hover:scale-110 active:scale-95 transition-all backdrop-blur-sm"
                  >
                    <ChevronLeft className="w-7 h-7" />
                  </button>
                  <button
                    onClick={next}
                    aria-label="Next image"
                    title="Next image"
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/5 text-white hover:bg-white/15 hover:scale-110 active:scale-95 transition-all backdrop-blur-sm"
                  >
                    <ChevronRight className="w-7 h-7" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom thumbnails strip */}
            {gallery.length > 1 && (
              <div className="shrink-0 px-4 py-4 overflow-x-auto" ref={thumbsRef}>
                <div className="flex gap-2 w-max mx-auto">
                  {gallery.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setDirection(i > (lightboxIndex ?? 0) ? 1 : -1);
                        setLightboxIndex(i);
                      }}
                      aria-label={`View image ${i + 1}`}
                      title={`View image ${i + 1}`}
                      /*
                        THUMBNAIL SIZE: change flex-[0_0_140px] below.
                        e.g. flex-[0_0_100px] = smaller, flex-[0_0_200px] = bigger
                      */
                      className={`relative flex-[0_0_140px] aspect-video rounded-lg overflow-hidden border-2 transition-all duration-200 shrink-0 ${
                        i === lightboxIndex
                          ? "border-white opacity-100 scale-100"
                          : "border-transparent opacity-40 hover:opacity-70 scale-95"
                      }`}
                    >
                      <LightboxThumb item={item} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ÔöÇÔöÇ Individual gallery card ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
function GalleryCard({
  item,
  index,
  isMobileMockup,
  onOpen,
}: {
  item: any;
  index: number;
  isMobileMockup?: boolean;
  onOpen: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="break-inside-avoid mb-4"
    >
      <div
        className="group relative overflow-hidden rounded-2xl bg-surface/40 hairline shadow-md shadow-black/5 cursor-zoom-in"
        /*
          POSTER ASPECT RATIO: controlled by the POSTER_ASPECT constant at top of file.
          Inline style is used so it's easy to change dynamically.
        */
        style={{ aspectRatio: POSTER_ASPECT }}
        onClick={onOpen}
        role="button"
        tabIndex={0}
        aria-label={`Open image ${index + 1} in fullscreen`}
        onKeyDown={(e) => e.key === "Enter" && onOpen()}
      >
        <GalleryItemRenderer item={item} isMobileMockup={isMobileMockup} />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm text-white">
            <ZoomIn className="w-5 h-5" />
          </div>
        </div>

        {/* Video badge */}
        {isVideo(item) && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-mono font-semibold uppercase tracking-wider">
            <Play className="w-3 h-3 fill-white" />
            Video
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ÔöÇÔöÇ Helpers ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
function getMediaUrl(item: any): string | null {
  if (item._type === "externalMedia") return item.url;
  if (item._type === "file" || item._type === "image") {
    if (item.asset?.url) return item.asset.url;
    if (item._type === "image" && item.asset?._ref) return urlFor(item).width(2400).url();
  }
  if (typeof item === "string") return item;
  return null;
}

function isVideo(item: any): boolean {
  if (item._type === "file" || item._type === "externalMedia") {
    const url = getMediaUrl(item);
    if (url && url.toLowerCase().endsWith(".pdf")) return false;
    return true;
  }
  if (typeof item === "string")
    return (
      item.toLowerCase().endsWith(".mp4") ||
      item.includes("youtube.com") ||
      item.includes("vimeo.com")
    );
  return false;
}

function isPdf(item: any): boolean {
  const url = getMediaUrl(item);
  return !!url && url.toLowerCase().endsWith(".pdf");
}

// ÔöÇÔöÇ Full media renderer ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
function GalleryItemRenderer({
  item,
  inLightbox,
  isMobileMockup,
}: {
  item: any;
  inLightbox?: boolean;
  isMobileMockup?: boolean;
}) {
  const url = getMediaUrl(item);
  const [isLoading, setIsLoading] = useState(true);

  if (!url) return <div className="w-full h-full bg-surface animate-pulse" />;

  const video = isVideo(item);
  const isPdfItem = isPdf(item);

  let content: React.ReactNode = null;

  if (video) {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const id = url.includes("v=") ? new URL(url).searchParams.get("v") : url.split("/").pop();
      content = (
        <iframe
          src={`https://www.youtube.com/embed/${id}?autoplay=0&rel=0`}
          title="YouTube video player"
          className="w-full h-full"
          allowFullScreen
        />
      );
    } else if (url.includes("vimeo.com")) {
      const id = url.split("/").pop();
      content = (
        <iframe
          src={`https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0`}
          title="Vimeo video player"
          className="w-full h-full"
          allowFullScreen
        />
      );
    } else {
      content = (
        <video
          src={url}
          controls
          autoPlay={inLightbox}
          loop
          title="Project video"
          className="w-full h-full object-contain bg-black"
        />
      );
    }
  } else if (isPdfItem) {
    content = (
      <div className="w-full h-full bg-white overflow-hidden relative">
        <iframe src={`${url}#toolbar=0`} className="w-full h-full" title="PDF document viewer" />
      </div>
    );
  } else {
    content = (
      <div className="relative w-full h-full flex items-center justify-center bg-black/5">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface/80 animate-pulse">
            <div className="w-8 h-8 rounded-full border-2 border-[color:var(--neon)] border-t-transparent animate-spin" />
          </div>
        )}
        <img
          src={url}
          alt={`Gallery image`}
          onLoad={() => setIsLoading(false)}
          loading="lazy"
          /*
            IMAGE FITTING:
              object-contain ÔåÆ shows full image, no cropping (default for lightbox)
              object-cover   ÔåÆ fills container, may crop edges
            Change below per context (inLightbox uses contain, grid uses contain too by default)
          */
          className={`transition-opacity duration-500 group-hover:scale-[1.03] ${
            inLightbox
              ? "max-w-full max-h-[80vh] object-contain drop-shadow-2xl rounded-xl"
              : "w-full h-full object-contain"
          } ${isLoading ? "opacity-0" : "opacity-100"}`}
        />
      </div>
    );
  }

  if (isMobileMockup && !inLightbox) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-black/5 to-black/10 p-4">
        <div className="relative h-full aspect-[9/19.5] max-h-[600px] bg-black rounded-[2.5rem] border-[8px] border-zinc-900 shadow-2xl overflow-hidden flex items-center justify-center shrink-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-5 bg-zinc-900 rounded-b-xl z-10" />
          {content}
        </div>
      </div>
    );
  }

  return <>{content}</>;
}

// ÔöÇÔöÇ Lightbox thumbnail ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
function LightboxThumb({ item }: { item: any }) {
  const url = getMediaUrl(item);
  const video = isVideo(item);
  const isPdfItem = isPdf(item);

  if (!url) return <div className="h-full w-full bg-surface animate-pulse" />;

  if (video) {
    return (
      <div className="h-full w-full bg-zinc-900 flex items-center justify-center relative">
        <Play className="w-5 h-5 text-white fill-white" />
        <span className="absolute bottom-1 right-1.5 text-[8px] font-mono text-white/70 bg-black/60 px-1 py-0.5 rounded">
          VIDEO
        </span>
      </div>
    );
  }

  if (isPdfItem) {
    return (
      <div className="h-full w-full bg-zinc-800 flex items-center justify-center">
        <span className="text-xs font-mono font-bold text-white/60">PDF</span>
      </div>
    );
  }

  return (
    <img
      src={urlFor(item).width(280).url() || url}
      alt="Gallery thumbnail"
      loading="lazy"
      className="h-full w-full object-cover"
    />
  );
}
