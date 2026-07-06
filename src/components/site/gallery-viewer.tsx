import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
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
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const mainGalleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (emblaApi) emblaApi.scrollTo(selectedIndex);
  }, [selectedIndex, emblaApi]);

  const prev = () => {
    setDirection(-1);
    setSelectedIndex((p) => (p - 1 + gallery.length) % gallery.length);
  };

  const next = () => {
    setDirection(1);
    setSelectedIndex((p) => (p + 1) % gallery.length);
  };

  // keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        next();
      } else if (e.key === "ArrowLeft") {
        prev();
      } else if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [gallery.length, isFullscreen]);

  // mouse wheel flipping support
  useEffect(() => {
    const mainEl = mainGalleryRef.current;
    if (!mainEl && !isFullscreen) return;

    const handler = (e: WheelEvent) => {
      // Prevent default scrolling when hovering the main gallery or in lightbox
      e.preventDefault();
      if (e.deltaY > 0) {
        next();
      } else if (e.deltaY < 0) {
        prev();
      }
    };

    if (isFullscreen) {
      window.addEventListener("wheel", handler, { passive: false });
      return () => window.removeEventListener("wheel", handler);
    } else if (mainEl) {
      mainEl.addEventListener("wheel", handler, { passive: false });
      return () => mainEl.removeEventListener("wheel", handler);
    }
  }, [isFullscreen, gallery.length]);

  if (!gallery || gallery.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Main Preview */}
      <div 
        ref={mainGalleryRef}
        className="relative w-full aspect-video sm:aspect-[16/10] bg-black/5 rounded-3xl overflow-hidden group"
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={selectedIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="relative w-full h-full"
          >
            <GalleryItemRenderer item={gallery[selectedIndex]} isMobileMockup={isMobileMockup} />
          </motion.div>
        </AnimatePresence>

        {/* Fullscreen toggle */}
        <button
          onClick={() => setIsFullscreen(true)}
          aria-label="Fullscreen"
          className="absolute top-4 right-4 p-2.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100 z-10 backdrop-blur-md"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Nav arrows on hover */}
        {gallery.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100 z-10 backdrop-blur-md"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100 z-10 backdrop-blur-md"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {gallery.length > 1 && (
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-2 py-2 cursor-grab active:cursor-grabbing">
            {gallery.map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > selectedIndex ? 1 : -1);
                  setSelectedIndex(i);
                }}
                 aria-label="Close fullscreen"

                className={`relative flex-[0_0_80px] sm:flex-[0_0_120px] aspect-video rounded-lg overflow-hidden hairline transition-all duration-300 group ${
                  i === selectedIndex
                    ? "ring-2 ring-[color:var(--neon)] scale-100 opacity-100"
                    : "opacity-40 hover:opacity-80 scale-95"
                }`}
              >
                <GalleryThumbRenderer item={item} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl"
          >
            {/* Lightbox Close */}
            <button
              onClick={() => setIsFullscreen(false)}
              aria-label="Close fullscreen"
              className="absolute top-6 right-6 md:top-8 md:right-8 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all z-[110]"
            >
              <X className="w-6 h-6" />
            </button>

            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={selectedIndex}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 100 : -100, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: direction > 0 ? -100 : 100, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full h-full p-4 md:p-12 flex items-center justify-center absolute inset-0"
              >
                <GalleryItemRenderer item={gallery[selectedIndex]} inLightbox isMobileMockup={false} />
              </motion.div>
            </AnimatePresence>

            {/* Lightbox Controls */}
            {gallery.length > 1 && (
              <>
                <button
                  onClick={prev}
                  aria-label="Previous image"
                  className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/5 text-white hover:bg-white/20 hover:scale-110 active:scale-95 transition-all backdrop-blur-md z-[110]"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>

                <button
                  onClick={next}
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
  const isPdfItem = isPdf(item);

  if (!url) return <div className="h-full w-full bg-surface animate-pulse" />;

  if (video) {
    return (
      <div className="h-full w-full bg-surface flex items-center justify-center relative overflow-hidden group border border-border">
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
