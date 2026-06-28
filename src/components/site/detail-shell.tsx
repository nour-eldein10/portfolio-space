import { Link } from "@tanstack/react-router";
import { SiteNav } from "./nav";
import { ContactFooter } from "./contact-footer";

export interface DetailAction {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary";
}

export interface DetailStats {
  rating?: number;
  reviews?: string;
  downloads?: string;
  category?: string;
}

export function DetailShell({
  eyebrow,
  title,
  meta,
  cover,
  body,
  gallery = [],
  stats,
  actions = [],
  children,
}: {
  eyebrow: string;
  title: string;
  meta?: string;
  cover?: string | null;
  body?: string;
  gallery?: string[];
  stats?: DetailStats;
  actions?: DetailAction[];
  children?: React.ReactNode;
}) {
  return (
    <main className="relative bg-background min-h-screen">
      <SiteNav />
      
      <section className="pt-32 pb-8 sm:pb-12">
        <div className="mx-auto max-w-5xl px-6">
          <Link
            to="/"
            className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground hover:text-foreground mb-8 inline-block"
          >
            ← back
          </Link>

          <div className="flex flex-col-reverse md:flex-row gap-8 md:gap-12 md:items-start justify-between">
            {/* Info Column */}
            <div className="flex flex-col flex-1 pt-2">
              <h1 className="font-display font-medium text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground">
                {title}
              </h1>
              <p className="mt-2 text-xl text-[color:var(--neon)] font-medium">{eyebrow}</p>
              {meta && <p className="mt-2 text-sm text-muted-foreground">{meta}</p>}

              {stats && (
                <div className="flex flex-wrap items-center gap-6 mt-8 bg-surface/30 md:bg-transparent p-4 md:p-0 rounded-2xl md:rounded-none hairline md:border-none">
                  {stats.rating !== undefined && (
                    <div className="flex flex-col items-center">
                      <span className="font-medium text-xl flex items-center gap-1">
                        {stats.rating.toFixed(1)} <span className="text-sm">★</span>
                      </span>
                      <span className="text-[11px] text-muted-foreground mt-1">{stats.reviews ?? "0"} reviews</span>
                    </div>
                  )}
                  {stats.rating !== undefined && (stats.downloads || stats.category) && <div className="w-px h-8 bg-border" />}
                  {stats.downloads && (
                    <div className="flex flex-col items-center">
                      <span className="font-medium text-xl">{stats.downloads}</span>
                      <span className="text-[11px] text-muted-foreground mt-1">Downloads</span>
                    </div>
                  )}
                  {stats.downloads && stats.category && <div className="w-px h-8 bg-border" />}
                  {stats.category && (
                    <div className="flex flex-col items-center">
                      <span className="font-medium text-base truncate max-w-[100px] text-center">{stats.category}</span>
                      <span className="text-[11px] text-muted-foreground mt-1">Category</span>
                    </div>
                  )}
                </div>
              )}

              {actions.length > 0 && (
                <div className="flex flex-wrap items-center gap-3 mt-8">
                  {actions.map((action, i) => (
                    <button
                      key={i}
                      onClick={action.onClick}
                      className={`px-10 py-3.5 rounded-xl text-[15px] font-semibold transition-colors w-full sm:w-auto ${
                        action.variant === "secondary"
                          ? "bg-surface text-foreground border border-border hover:bg-surface-2"
                          : "bg-[color:var(--neon)] text-black hover:bg-[color:var(--neon)]/90"
                      }`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Logo Column */}
            {cover && (
              <div className="h-32 w-32 md:h-64 md:w-64 shrink-0 overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] hairline shadow-2xl shadow-black/20 self-start">
                <img src={cover} alt={title} className="h-full w-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="py-6 overflow-hidden">
          <div className="mx-auto max-w-5xl px-6">
            <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide">
              {gallery.map((url, i) => (
                <div key={i} className="snap-center">
                  <MediaItem url={url} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {(body || children) && (
        <section className="pb-28 pt-8">
          <div className="mx-auto max-w-4xl px-6">
            {body && (
              <>
                <h2 className="text-xl font-medium mb-6 flex items-center justify-between">
                  About this project
                  <span className="text-muted-foreground text-sm font-normal">→</span>
                </h2>
                <div className="prose prose-invert max-w-none whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/80">
                  {body}
                </div>
              </>
            )}
            {children}
          </div>
        </section>
      )}
      <ContactFooter />
    </main>
  );
}

function MediaItem({ url }: { url: string }) {
  const isMp4 = url.toLowerCase().endsWith(".mp4");
  const isYoutube = url.includes("youtube.com") || url.includes("youtu.be");

  if (isYoutube) {
    let videoId = "";
    if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1]?.split("?")[0];
    else if (url.includes("v=")) videoId = url.split("v=")[1]?.split("&")[0];
    
    return (
      <iframe
        className="h-[280px] sm:h-[400px] aspect-video rounded-2xl hairline shrink-0 object-cover"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=0`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (isMp4) {
    return (
      <video
        src={url}
        controls
        className="h-[280px] sm:h-[400px] w-auto rounded-2xl hairline shrink-0 object-cover"
      />
    );
  }

  return (
    <img
      src={url}
      alt="Gallery item"
      className="h-[280px] sm:h-[400px] w-auto rounded-2xl hairline shrink-0 object-cover"
    />
  );
}
