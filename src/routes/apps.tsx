import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import { SiteNav } from "@/components/site/nav";
import { ContactFooter } from "@/components/site/contact-footer";
import { appsQuery, projectsQuery, designsQuery } from "@/lib/cms";

export const Route = createFileRoute("/apps")({
  head: () => ({
    meta: [
      { title: "Marketplace — Nour Eldein Ahmed" },
      {
        name: "description",
        content:
          "Single hub for all work: Apps, Automation Solutions, Graphic Design, Products, and Concepts.",
      },
      { property: "og:title", content: "Marketplace — Nour Eldein Ahmed" },
    ],
  }),
  component: MarketplacePage,
});

type Category = "All" | "Apps" | "Automation" | "Graphic Design" | "Products" | "Concepts";
type SortOption = "Latest" | "Popular" | "Rating";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 text-[color:var(--amber)] text-xs">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < Math.round(rating) ? "" : "opacity-25"}>
          ★
        </span>
      ))}
      <span className="ml-1.5 text-muted-foreground font-mono text-[11px]">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

function MarketplacePage() {
  const { data: apps } = useQuery(appsQuery);
  const { data: projects } = useQuery(projectsQuery);
  const { data: designs } = useQuery(designsQuery);

  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("Latest");

  const allItems = useMemo(() => {
    const normalizedApps = (apps || []).map((a) => ({
      ...a,
      type: "Apps" as Category,
      url: `/apps/${a.id}`,
      description: a.tagline,
      date: new Date().toISOString(),
      popularity: parseInt(a.downloads?.replace(/\D/g, "") || "0"),
    }));

    const normalizedProjects = (projects || []).map((p) => ({
      ...p,
      type: (p.role?.toLowerCase().includes("automation") ? "Automation" : "Products") as Category,
      url: `/projects/${p.id}`,
      description: p.summary,
      rating: p.rating ?? 4.5,
      downloads: "N/A",
      date: new Date(p.year, 0).toISOString(),
      popularity: Math.random() * 1000,
    }));

    const normalizedDesigns = (designs || []).map((d) => ({
      ...d,
      name: d.title,
      type: "Graphic Design" as Category,
      url: `/designs/${d.id}`,
      description: d.category,
      rating: d.rating ?? 4.8,
      downloads: "N/A",
      icon: "🎨",
      date: new Date().toISOString(),
      popularity: Math.random() * 500,
    }));

    return [...normalizedApps, ...normalizedProjects, ...normalizedDesigns];
  }, [apps, projects, designs]);

  const filteredAndSortedItems = useMemo(() => {
    let result = allItems;

    if (activeCategory !== "All") {
      result = result.filter((item) => item.type === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name?.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q),
      );
    }

    result = [...result].sort((a, b) => {
      if (sortBy === "Latest") return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "Popular") return b.popularity - a.popularity;
      if (sortBy === "Rating") return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

    return result;
  }, [allItems, activeCategory, searchQuery, sortBy]);

  const categories: Category[] = ["All", "Apps", "Automation", "Graphic Design", "Products", "Concepts"];
  const groupOrder: Category[] = ["Apps", "Graphic Design", "Automation", "Products", "Concepts"];

  return (
    <main className="relative">
      <SiteNav />
      <section className="relative pt-44 pb-10">
        <div className="mx-auto max-w-6xl px-6">
          <p className="font-mono text-[11px] tracking-[0.25em] uppercase text-muted-foreground">
            <span className="text-[color:var(--neon)]">●</span> Marketplace · {allItems.length} items
          </p>
          <h1 className="mt-6 font-display font-medium text-[clamp(2rem,5vw,4.5rem)] leading-[0.95] tracking-[-0.035em] max-w-3xl">
            Everything I've built,{" "}
            <span className="font-serif-italic text-[color:var(--amber)]">in one place.</span>
          </h1>

          <div className="mt-12 flex flex-col md:flex-row gap-4 items-center justify-between bg-surface/30 p-2 rounded-2xl hairline">
            <div className="flex flex-wrap items-center gap-1 w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-foreground text-background shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface rounded-xl pl-10 pr-4 py-2 text-sm outline-none border border-transparent focus:border-[color:var(--neon)]/50 transition-colors"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">🔍</span>
              </div>
              <select
                aria-label="Sort by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-surface rounded-xl px-4 py-2 text-sm outline-none border border-transparent focus:border-[color:var(--neon)]/50 appearance-none cursor-pointer"
              >
                <option value="Latest">Latest</option>
                <option value="Popular">Popular</option>
                <option value="Rating">Rating</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-28 sm:pb-36">
        <div className="mx-auto max-w-6xl px-6">
          <AnimatePresence mode="popLayout">
            {filteredAndSortedItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-20 text-center"
              >
                <p className="text-muted-foreground">No items found matching your criteria.</p>
                <button
                  onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                  className="mt-4 text-[color:var(--neon)] hover:underline"
                >
                  Clear filters
                </button>
              </motion.div>
            ) : (
              <motion.div layout className="space-y-16">
                {groupOrder.map((groupType) => {
                  const groupItems = filteredAndSortedItems.filter((i: any) => i.type === groupType);
                  if (groupItems.length === 0) return null;

                  return (
                    <motion.section key={groupType} layout>
                      {/* Group header with divider */}
                      <div className="flex items-center gap-4 mb-6">
                        <h2 className="font-display text-xl font-medium tracking-tight shrink-0">{groupType}</h2>
                        <span className="text-xs text-muted-foreground font-mono shrink-0">{groupItems.length}</span>
                        <div className="flex-1 h-px bg-border/50" />
                      </div>

                      {/* Apps: Play Store icon grid */}
                      {groupType === "Apps" ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8">
                          {groupItems.map((_item) => {
                            const item = _item as any;
                            return (
                              <motion.article
                                layout
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="group flex flex-col gap-3"
                              >
                                <Link to="/apps/$slug" params={{ slug: item.id }} className="flex flex-col gap-3">
                                  <div className="relative aspect-square w-full overflow-hidden rounded-[2rem] hairline shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300">
                                    <img src={item.cover} alt={item.name} loading="lazy" className="h-full w-full object-cover" />
                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                      <span className="text-white text-xs font-semibold bg-black/60 px-3 py-1 rounded-full">View</span>
                                    </div>
                                  </div>
                                  <div className="flex flex-col px-1">
                                    <h3 className="font-medium text-sm text-foreground line-clamp-1 group-hover:text-[color:var(--neon)] transition-colors">{item.name}</h3>
                                    <div className="flex items-center text-[12px] text-muted-foreground mt-0.5 gap-1">
                                      <span>{item.rating?.toFixed(1) || "5.0"}</span>
                                      <span className="text-[10px] text-[color:var(--amber)]">★</span>
                                    </div>
                                  </div>
                                </Link>
                              </motion.article>
                            );
                          })}
                        </div>
                      ) : (
                        /* Other types: tall cards */
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                          {groupItems.map((_item) => {
                            const item = _item as any;
                            const routeProps =
                              item.type === "Graphic Design"
                                ? { to: "/designs/$slug" as const, params: { slug: item.id } }
                                : { to: "/projects/$slug" as const, params: { slug: item.id } };
                            return (
                              <motion.article
                                layout
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="group relative flex flex-col hairline rounded-3xl bg-surface/40 overflow-hidden hover:bg-surface/70 transition-colors"
                              >
                                <Link {...routeProps} className="absolute inset-0 z-10">
                                  <span className="sr-only">View</span>
                                </Link>
                                <div className="relative aspect-[4/5] overflow-hidden">
                                  <img
                                    src={item.cover}
                                    alt={item.name}
                                    loading="lazy"
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                                  />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm z-20 pointer-events-none">
                                    <span className="px-6 py-2 bg-foreground text-background rounded-full font-medium text-sm">View</span>
                                  </div>
                                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,color-mix(in_oklab,var(--background)_85%,transparent)_100%)]" />
                                  <div className="absolute top-4 right-4">
                                    <span className="font-mono text-[10px] tracking-widest uppercase text-foreground/70 backdrop-blur-md bg-background/40 rounded-full px-2.5 py-1 hairline">
                                      {item.type}
                                    </span>
                                  </div>
                                </div>
                                <div className="p-5 flex flex-col gap-3 flex-1">
                                  <div>
                                    <h3 className="font-display text-xl tracking-tight">{item.name}</h3>
                                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                                  </div>
                                  <div className="flex items-center justify-between mt-auto pt-3 border-t hairline">
                                    <Stars rating={item.rating || 5} />
                                    <span className="font-medium text-sm group-hover:text-[color:var(--neon)] transition-colors">View Details ↗</span>
                                  </div>
                                </div>
                              </motion.article>
                            );
                          })}
                        </div>
                      )}
                    </motion.section>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <ContactFooter />
    </main>
  );
}
