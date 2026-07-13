"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SearchBar } from "@/components/shared/search-bar";
import { MaterialCard } from "@/components/shared/material-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BookOpen, Filter, SlidersHorizontal, Grid3X3, List,
  ChevronDown, X, GraduationCap, FlaskConical, Monitor,
  Settings, HeartPulse, TrendingUp, Scale, Users,
  BookOpen as BookOpenIcon, Palette, Sprout, Compass,
} from "lucide-react";
import { materials, categories } from "@/lib/data";
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

export function DashboardClient() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState("Semua");
  const [selectedLevel, setSelectedLevel] = useState("Semua");
  const [selectedPrice, setSelectedPrice] = useState("Semua");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const filtered = materials.filter((m) => {
    if (selectedCategory && m.category !== selectedCategory) return false;
    if (selectedFormat !== "Semua" && m.format !== selectedFormat) return false;
    if (selectedLevel !== "Semua" && m.level !== selectedLevel) return false;
    if (selectedPrice !== "Semua" && m.price !== selectedPrice) return false;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <aside
          className={cn(
            "w-64 border-r border-border/50 bg-muted/20 flex-shrink-0 transition-all duration-300 hidden md:block",
            !sidebarOpen && "w-0 overflow-hidden"
          )}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Kategori
              </h3>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSidebarOpen(false)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                  !selectedCategory
                    ? "bg-emerald/10 text-emerald font-medium"
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
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                    selectedCategory === cat.id
                      ? "bg-emerald/10 text-emerald font-medium"
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
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hidden md:flex"
                  onClick={() => setSidebarOpen(true)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
                <div className="flex-1">
                  <SearchBar placeholder="Cari dalam dashboard..." />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-6">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-2">
                  <Filter className="h-3.5 w-3.5" />
                  Filter:
                </div>
                {formats.map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setSelectedFormat(fmt)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                      selectedFormat === fmt
                        ? "bg-emerald/10 text-emerald border border-emerald/20"
                        : "bg-muted text-muted-foreground hover:text-foreground border border-transparent"
                    )}
                  >
                    {fmt}
                  </button>
                ))}
                <span className="w-px h-5 bg-border mx-1" />
                {levels.map((lv) => (
                  <button
                    key={lv}
                    onClick={() => setSelectedLevel(lv)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                      selectedLevel === lv
                        ? "bg-emerald/10 text-emerald border border-emerald/20"
                        : "bg-muted text-muted-foreground hover:text-foreground border border-transparent"
                    )}
                  >
                    {lv}
                  </button>
                ))}
                <span className="w-px h-5 bg-border mx-1" />
                {prices.map((pr) => (
                  <button
                    key={pr}
                    onClick={() => setSelectedPrice(pr)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                      selectedPrice === pr
                        ? "bg-emerald/10 text-emerald border border-emerald/20"
                        : "bg-muted text-muted-foreground hover:text-foreground border border-transparent"
                    )}
                  >
                    {pr}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  Menampilkan <span className="font-semibold text-foreground">{filtered.length}</span> materi
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((material, i) => (
                  <MaterialCard key={material.id} material={material} index={i} />
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-20">
                  <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Tidak ada materi ditemukan</h3>
                  <p className="text-sm text-muted-foreground">
                    Coba ubah filter atau kata kunci pencarian Anda
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
