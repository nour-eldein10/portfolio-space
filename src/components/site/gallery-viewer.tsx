import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { urlFor } from "@/lib/sanity";
import { Play, Maximize2, ChevronLeft, ChevronRight, X } from "lucide-react";

export function GalleryViewer({
  gallery,
  isMobileMockup,
}: {
  gallery: any[];
  isMobileMockup?: boolean;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play logic
  useEffect(() => {
    if (!isPlaying || !gallery || gallery.length <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setSelectedIndex((prev) => (prev + 1) % gallery.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPlaying, gallery]);

  // Sync embla with selected index
  useEffect(() => {
    if (emblaApi) emblaApi.scrollTo(selectedIndex);
  }, [selectedIndex, emblaApi]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setDirection(1);
        setSelectedIndex((p) => (p + 1) % gallery.length);
      } else if (e.key === "ArrowLeft") {
        setDirection(-1);
        setSelectedIndex((p) => (p - 1 + gallery.length) % gallery.length);
      } else if (e.key === "Escape") {
        setLightboxOpen(false);
      }
    },
    [gallery],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!gallery || gallery.length === 0) return null;

  return (
    <div className="space-y-6 pt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] font-semibold uppercase tracking-widest font-mono text-muted-foreground">
          Gallery
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`text-[10px] font-mono uppercase tracking-widest transition-colors ${
              isPlaying ? "text-[color:var(--neon)]" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {isPlaying ? "Pause Auto-play" : "Auto-play"}
          </button>
          <button
            onClick={() => setLightboxOpen(true)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* HERO SECTION */}
      <div className="relative group rounded-3xl overflow-hidden bg-surface/30 hairline shadow-xl shadow-black/10">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="relative w-full aspect-video sm:aspect-[16/10] bg-black/5"
          >
            <GalleryItemRenderer item={gallery[selectedIndex]} isMobileMockup={isMobileMockup} />
          </motion.div>
        </AnimatePresence>

        {/* Hover Controls */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

          <button
            onClick={() => {
              setDirection(-1);
              setSelectedIndex((p) => (p - 1 + gallery.length) % gallery.length);
            }}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 hover:scale-110 active:scale-95 transition-all pointer-events-auto"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => {
              setDirection(1);
              setSelectedIndex((p) => (p + 1) % gallery.length);
            }}
            aria-label="Next image"
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 hover:scale-110 active:scale-95 transition-all pointer-events-auto"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <button
            onClick={() => setLightboxOpen(true)}
            aria-label="Open fullscreen"
            className="absolute bottom-4 right-4 p-2.5 rounded-xl bg-black/40 text-white backdrop-blur-md hover:bg-[color:var(--neon)] hover:text-black hover:scale-105 transition-all pointer-events-auto shadow-[0_0_20px_rgba(0,0,0,0.3)]"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* CAROUSEL THUMBNAILS */}
      {gallery.length > 1 && (
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-3 py-2 cursor-grab active:cursor-grabbing">
              {gallery.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedIndex(i)}
                  aria-label={`View image ${i + 1}`}
                  className={`relative flex-[0_0_35%] sm:flex-[0_0_22%] min-w-0 aspect-video rounded-xl overflow-hidden hairline transition-all duration-300 group ${
                    i === selectedIndex
                      ? "ring-2 ring-[color:var(--neon)] scale-100 opacity-100 shadow-[0_0_15px_color-mix(in_oklab,var(--neon)_30%,transparent)]"
                      : "opacity-60 hover:opacity-100 hover:scale-[1.02] scale-95"
                  }`}
                >
                  <GalleryThumbRenderer item={item} />
                  {i !== selectedIndex && (
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-3xl"
          >
            <button
              onClick={() => setLightboxOpen(false)}
              aria-label="Close fullscreen"
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-[110] backdrop-blur-md"
            >
              <X className="w-6 h-6" />
            </button>

            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={selectedIndex}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 100 : -100, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: direction > 0 ? -100 : 100, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full h-full p-4 md:p-12 flex items-center justify-center absolute inset-0"
              >
                <GalleryItemRenderer item={gallery[selectedIndex]} inLightbox />
              </motion.div>
            </AnimatePresence>

            {/* Lightbox Controls */}
            {gallery.length > 1 && (
              <>
                <button
                  onClick={() => {
                    setDirection(-1);
                    setSelectedIndex((p) => (p - 1 + gallery.length) % gallery.length);
                  }}
                  aria-label="Previous image"
                  className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/5 text-white hover:bg-white/20 hover:scale-110 active:scale-95 transition-all backdrop-blur-md z-[110]"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>

                <button
                  onClick={() => {
                    setDirection(1);
                    setSelectedIndex((p) => (p + 1) % gallery.length);
                  }}
                  aria-label="Next image"
                  className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/5 text-white hover:bg-white/20 hover:scale-110 active:scale-95 transition-all backdrop-blur-md z-[110]"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Lightbox Counter */}
            <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white font-mono text-xs tracking-widest z-[110]">
              {selectedIndex + 1} / {gallery.length}
            </div>

            {/* Lightbox Thumbnails */}
            {gallery.length > 1 && (
              <div className="absolute bottom-4 sm:bottom-8 w-full max-w-4xl px-8 z-[110]">
                <div className="overflow-hidden" ref={emblaRef}>
                  <div className="flex gap-2 py-2 cursor-grab active:cursor-grabbing">
                    {gallery.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setDirection(i > selectedIndex ? 1 : -1);
                          setSelectedIndex(i);
                        }}
                        aria-label={`View image ${i + 1}`}
                        className={`relative flex-[0_0_80px] sm:flex-[0_0_120px] aspect-video rounded-lg overflow-hidden hairline transition-all duration-300 group ${
                          i === selectedIndex
                            ? "ring-2 ring-white scale-100 opacity-100 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                            : "opacity-40 hover:opacity-80 scale-95"
                        }`}
                      >
                        <GalleryThumbRenderer item={item} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getMediaUrl(item: any): string | null {
  if (item._type === "externalMedia") return item.url;
  if (item._type === "file" || item._type === "image") {
    if (item.asset?.url) return item.asset.url;
    if (item._type === "image" && item.asset?._ref) return urlFor(item).width(2000).url(); // Higher res for lightbox
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

  let content = null;

  if (video) {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const id = url.includes("v=") ? new URL(url).searchParams.get("v") : url.split("/").pop();
      content = (
        <iframe
          src={`https://www.youtube.com/embed/${id}?autoplay=0&rel=0`}
          title="YouTube video"
          className="w-full h-full rounded-2xl shadow-2xl"
          allowFullScreen
        />
      );
    } else if (url.includes("vimeo.com")) {
      const id = url.split("/").pop();
      content = (
        <iframe
          src={`https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0`}
          title="Vimeo video"
          className="w-full h-full rounded-2xl shadow-2xl"
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
          className="w-full h-full object-contain rounded-2xl shadow-2xl bg-black"
        />
      );
    }
  } else if (isPdfItem) {
    content = (
      <div className="w-full h-full bg-white rounded-2xl overflow-hidden shadow-2xl relative">
        <iframe src={`${url}#toolbar=0`} className="w-full h-full" title="PDF document" />
      </div>
    );
  } else {
    content = (
      <div className="relative w-full h-full flex items-center justify-center">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface animate-pulse">
            <div className="w-8 h-8 rounded-full border-2 border-[color:var(--neon)] border-t-transparent animate-spin" />
          </div>
        )}
        <img
          src={url}
          alt="Gallery media"
          onLoad={() => setIsLoading(false)}
          loading="lazy"
          className={`w-full h-full transition-opacity duration-500 ${inLightbox ? "object-contain max-h-[85vh] drop-shadow-2xl" : "object-cover"} ${isLoading ? "opacity-0" : "opacity-100"}`}
        />
      </div>
    );
  }

  if (isMobileMockup && !inLightbox) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-black/5 to-black/10 p-6">
        <div className="relative h-full aspect-[9/19.5] max-h-[600px] bg-black rounded-[2.5rem] border-[8px] sm:border-[10px] border-zinc-900 shadow-2xl overflow-hidden shadow-black/40 flex items-center justify-center shrink-0">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-5 bg-zinc-900 rounded-b-xl z-10" />
          {content}
        </div>
      </div>
    );
  }

  return content;
}

function GalleryThumbRenderer({ item }: { item: any }) {
  const url = getMediaUrl(item);
  const video = isVideo(item);

  if (!url) return <div className="h-full w-full bg-surface animate-pulse" />;

  if (video) {
    return (
      <div className="h-full w-full bg-surface flex items-center justify-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--neon)]/10 to-transparent pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all group-hover:bg-black/20">
          <Play className="w-6 h-6 text-white fill-white drop-shadow-md transition-transform group-hover:scale-110" />
        </div>
        <span className="absolute bottom-1 right-1.5 text-[8px] font-mono text-white/80 bg-black/60 px-1 py-0.5 rounded backdrop-blur-sm">
          VIDEO
        </span>
      </div>
    );
  }

  const isPdfItem = isPdf(item);
  if (isPdfItem) {
    return (
      <div className="h-full w-full bg-surface flex items-center justify-center relative overflow-hidden group border border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        <span className="text-xs font-mono font-bold text-muted-foreground group-hover:text-foreground transition-colors">
          PDF
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <img
        src={urlFor(item).width(300).url() || url}
        alt="Thumbnail"
        loading="lazy"
        className="h-full w-full object-cover"
      />
    </div>
  );
}
