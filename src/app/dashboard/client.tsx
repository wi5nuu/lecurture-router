"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { MaterialCard } from "@/components/shared/material-card";
import { Button } from "@/components/ui/button";
import {
  BookOpen, Filter, SlidersHorizontal, Grid3X3, List,
  X, GraduationCap, FlaskConical, Monitor,
  Settings, HeartPulse, TrendingUp, Scale, Users,
  BookOpen as BookOpenIcon, Palette, Sprout, Compass,
  Search, Menu, Loader2, RefreshCw,
} from "lucide-react";
import { type Material, type Category } from "@/lib/data";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ReactNode> = {
  "settings": <Settings className="h-4 w-4" />,
  "heart-pulse": <HeartPulse className="h-4 w-4" />,
  "trending-up": <TrendingUp className="h-4 w-4" />,
  "scale": <Scale className="h-4 w-4" />,
  "flask-conical": <FlaskConical className="h-4 w-4" />,
  "users": <Users className="h-4 w-4" />,
  "book-open": <BookOpenIcon className="h-4 w-4" />,
  "monitor": <Monitor className="h-4 w-4" />,
  "graduation-cap": <GraduationCap className="h-4 w-4" />,
  "palette": <Palette className="h-4 w-4" />,
  "sprout": <Sprout className="h-4 w-4" />,
  "compass": <Compass className="h-4 w-4" />,
};

const formats = ["Semua", "PDF", "Video", "Slide", "E-Book"];
const levels = ["Semua", "S1", "S2", "S3", "Umum"];
const prices = ["Semua", "Gratis", "Freemium", "Premium"];

interface ApiMaterial {
  id: string;
  title: string;
  source: string;
  course: string;
  format: string;
  language: string;
  level: string;
  year: number;
  rating: number;
  reviewCount: number;
  price: string;
  accessUrl: string;
  description: string;
  fullContent: string;
  instructor: string;
  university: string;
  citations: number;
  tags: string[];
  thumbnail?: string;
  pages?: number;
  duration?: string;
  isbn?: string;
  doi?: string;
  category: { id: string; name: string };
  provider: { id: string; name: string };
}

interface ApiCategory {
  id: string;
  name: string;
  icon: string;
  materialCount: number;
  description: string;
  color: string;
}

function toMaterial(m: ApiMaterial): Material {
  return {
    id: m.id,
    title: m.title,
    source: m.source || m.provider?.name || "",
    provider: m.provider?.id || "",
    course: m.course,
    format: m.format as Material["format"],
    language: m.language,
    level: m.level as Material["level"],
    year: m.year,
    rating: m.rating,
    reviewCount: m.reviewCount,
    price: m.price as Material["price"],
    accessUrl: m.accessUrl,
    description: m.description,
    fullContent: m.fullContent,
    category: m.category?.id || "",
    instructor: m.instructor,
    university: m.university,
    citations: m.citations,
    tags: m.tags ?? [],
    thumbnail: m.thumbnail,
    pages: m.pages,
    duration: m.duration,
    isbn: m.isbn,
    doi: m.doi,
  };
}

async function fetchCatalog(): Promise<{
  materials: Material[];
  categories: Category[];
}> {
  const [materialsRes, categoriesRes] = await Promise.all([
    fetch("/api/materials?limit=50&sort=rating"),
    fetch("/api/categories"),
  ]);

  if (!materialsRes.ok) {
    const data = await materialsRes.json().catch(() => null);
    throw new Error(data?.error || "Gagal memuat materi");
  }
  if (!categoriesRes.ok) {
    const data = await categoriesRes.json().catch(() => null);
    throw new Error(data?.error || "Gagal memuat kategori");
  }

  const materialsData = await materialsRes.json();
  const categoriesData = await categoriesRes.json();

  return {
    materials: (materialsData.materials ?? []).map(toMaterial),
    categories: (categoriesData.categories ?? []).map(
      (c: ApiCategory) =>
        ({
          id: c.id,
          name: c.name,
          icon: c.icon,
          materialCount: c.materialCount ?? 0,
          description: c.description,
          color: c.color,
        }) satisfies Category
    ),
  };
}

export function DashboardClient() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState("Semua");
  const [selectedLevel, setSelectedLevel] = useState("Semua");
  const [selectedPrice, setSelectedPrice] = useState("Semua");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const ITEMS_PER_PAGE = 6;

  const handleRetry = () => {
    setLoading(true);
    setLoadError(null);
    void (async () => {
      try {
        const data = await fetchCatalog();
        setMaterials(data.materials);
        setCategories(data.categories);
      } catch (error) {
        setLoadError(
          error instanceof Error ? error.message : "Terjadi kesalahan"
        );
      } finally {
        setLoading(false);
      }
    })();
  };

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const data = await fetchCatalog();
        if (cancelled) return;
        setMaterials(data.materials);
        setCategories(data.categories);
      } catch (error) {
        if (!cancelled) {
          setLoadError(
            error instanceof Error ? error.message : "Terjadi kesalahan"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = materials.filter((m) => {
    if (selectedCategory && m.category !== selectedCategory) return false;
    if (selectedFormat !== "Semua" && m.format !== selectedFormat) return false;
    if (selectedLevel !== "Semua" && m.level !== selectedLevel) return false;
    if (selectedPrice !== "Semua" && m.price !== selectedPrice) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = m.title.toLowerCase().includes(q);
      const matchDesc = m.description.toLowerCase().includes(q);
      const matchTags = m.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTags) return false;
    }
    return true;
  });

  const hasActiveFilters =
    selectedCategory !== null ||
    selectedFormat !== "Semua" ||
    selectedLevel !== "Semua" ||
    selectedPrice !== "Semua" ||
    searchQuery !== "";

  const displayed = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const loadMore = () => setVisibleCount((p) => p + ITEMS_PER_PAGE);

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedFormat("Semua");
    setSelectedLevel("Semua");
    setSelectedPrice("Semua");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen flex flex-col w-full max-w-full overflow-x-hidden">
      <Header />

      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <aside
          className={cn(
            "border-r border-border/50 bg-muted/20 flex-shrink-0 transition-all duration-300",
            "fixed inset-y-0 left-0 z-40 w-64 pt-16",
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
            "md:relative md:inset-auto md:z-auto md:block md:translate-x-0 md:pt-0",
            sidebarOpen ? "md:w-64" : "md:w-0 md:overflow-hidden md:border-r-0"
          )}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Kategori
              </h3>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setSidebarOpen(false); setMobileSidebarOpen(false); }}>
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div className="space-y-1">
              <button
                onClick={() => { setSelectedCategory(null); setMobileSidebarOpen(false); }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                  !selectedCategory
                    ? "bg-blue/10 text-blue font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <BookOpen className="h-4 w-4" />
                Semua Kategori
                <span className="ml-auto text-xs font-mono text-muted-foreground">{materials.length}</span>
              </button>
              <div className="h-px bg-border/50 my-2" />
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setMobileSidebarOpen(false); }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                    selectedCategory === cat.id
                      ? "bg-blue/10 text-blue font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  {iconMap[cat.icon]}
                  <span className="truncate">{cat.name}</span>
                  <span className="ml-auto text-xs font-mono text-muted-foreground">
                    {(cat.materialCount / 1000).toFixed(0)}K
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 md:hidden"
                  onClick={() => setMobileSidebarOpen(true)}
                >
                  <Menu className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hidden md:flex"
                  onClick={() => setSidebarOpen(true)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari dalam dashboard..."
                    className="flex h-10 w-full rounded-xl border border-border bg-background pl-10 pr-9 text-sm outline-none focus:border-blue/50 focus:ring-1 focus:ring-blue/30 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  Menampilkan <span className="font-semibold text-foreground">{filtered.length}</span> materi
                </p>
                <div className="flex items-center gap-1">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setFilterOpen(!filterOpen)}
                      className={cn("h-8 w-8", filterOpen && "text-blue bg-blue/10")}
                    >
                      <Filter className="h-4 w-4" />
                      {(selectedFormat !== "Semua" || selectedLevel !== "Semua" || selectedPrice !== "Semua") && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue text-[8px] font-bold text-white">
                          {(selectedFormat !== "Semua" ? 1 : 0) + (selectedLevel !== "Semua" ? 1 : 0) + (selectedPrice !== "Semua" ? 1 : 0)}
                        </span>
                      )}
                    </Button>
                    {filterOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setFilterOpen(false)} />
                        <div className="absolute right-0 top-full mt-2 z-20 w-72 rounded-xl border border-border bg-card shadow-xl p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Filter</p>
                            {hasActiveFilters && (
                              <button onClick={clearFilters} className="text-xs text-blue hover:underline">Reset</button>
                            )}
                          </div>
                          <div className="h-px bg-border/50" />
                          <div>
                            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Format</p>
                            <div className="flex flex-wrap gap-1.5">
                              {formats.map((fmt) => (
                                <button
                                  key={fmt}
                                  onClick={() => setSelectedFormat(fmt)}
                                  className={cn(
                                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                                    selectedFormat === fmt
                                      ? "bg-blue/10 text-blue border border-blue/20"
                                      : "bg-muted text-muted-foreground hover:text-foreground border border-transparent"
                                  )}
                                >
                                  {fmt}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="h-px bg-border/50" />
                          <div>
                            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Level</p>
                            <div className="flex flex-wrap gap-1.5">
                              {levels.map((lv) => (
                                <button
                                  key={lv}
                                  onClick={() => setSelectedLevel(lv)}
                                  className={cn(
                                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                                    selectedLevel === lv
                                      ? "bg-blue/10 text-blue border border-blue/20"
                                      : "bg-muted text-muted-foreground hover:text-foreground border border-transparent"
                                  )}
                                >
                                  {lv}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="h-px bg-border/50" />
                          <div>
                            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Harga</p>
                            <div className="flex flex-wrap gap-1.5">
                              {prices.map((pr) => (
                                <button
                                  key={pr}
                                  onClick={() => setSelectedPrice(pr)}
                                  className={cn(
                                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                                    selectedPrice === pr
                                      ? "bg-blue/10 text-blue border border-blue/20"
                                      : "bg-muted text-muted-foreground hover:text-foreground border border-transparent"
                                  )}
                                >
                                  {pr}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-8 w-8", viewMode === "grid" && "text-blue bg-blue/10")}
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-8 w-8", viewMode === "list" && "text-blue bg-blue/10")}
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "flex flex-col gap-3"
              )}>
                {loading && (
                  <div className="col-span-full flex flex-col items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 text-blue animate-spin mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Memuat materi dari Firebase...
                    </p>
                  </div>
                )}

                {!loading && loadError && (
                  <div className="col-span-full text-center py-20">
                    <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Gagal memuat materi</h3>
                    <p className="text-sm text-muted-foreground mb-4">{loadError}</p>
                    <Button variant="outline" className="gap-2" onClick={handleRetry}>
                      <RefreshCw className="h-4 w-4" /> Coba Lagi
                    </Button>
                  </div>
                )}

                {!loading && !loadError && displayed.map((material, i) => (
                  <MaterialCard key={material.id} material={material} index={i} />
                ))}
              </div>

              {!loading && !loadError && filtered.length === 0 && (
                <div className="text-center py-20">
                  <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Tidak ada materi ditemukan</h3>
                  <p className="text-sm text-muted-foreground">
                    Coba ubah filter atau kata kunci pencarian Anda
                  </p>
                </div>
              )}

              {hasMore && (
                <div className="flex justify-center mt-8">
                  <Button variant="outline" onClick={loadMore} className="px-8">
                    Muat Lebih Banyak ({filtered.length - visibleCount} tersisa)
                  </Button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
