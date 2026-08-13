"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Database,
  ArrowUpDown,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProviderCard } from "@/components/shared/provider-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Provider } from "@/lib/data";
import { cn } from "@/lib/utils";

const priceFilters = ["Semua", "Gratis", "Freemium", "Premium", "Mixed"];

const sortOptions = [
  { label: "Nama A-Z", value: "name-asc" },
  { label: "Nama Z-A", value: "name-desc" },
  { label: "Rating Tertinggi", value: "rating-desc" },
  { label: "Rating Terendah", value: "rating-asc" },
  { label: "Materi Terbanyak", value: "materials-desc" },
  { label: "Materi Tersedikit", value: "materials-asc" },
] as const;

type SortValue = (typeof sortOptions)[number]["value"];

interface ApiProvider {
  id: string;
  name: string;
  logo: string;
  description: string;
  totalMaterials: number;
  formats: string[];
  languages: string[];
  priceModel: string;
  rating: number;
  url: string;
  categories: string[];
  established: number;
  headquarters: string;
}

function toProvider(p: ApiProvider): Provider {
  return {
    id: p.id,
    name: p.name,
    logo: p.logo,
    description: p.description,
    totalMaterials: p.totalMaterials,
    formats: p.formats ?? [],
    languages: p.languages ?? [],
    priceModel: p.priceModel as Provider["priceModel"],
    rating: p.rating,
    url: p.url,
    categories: p.categories ?? [],
    established: p.established,
    headquarters: p.headquarters,
  };
}

async function fetchProviders(): Promise<Provider[]> {
  const res = await fetch("/api/providers?sort=rating");
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || "Gagal memuat provider");
  }
  const data = await res.json();
  return (data.providers ?? []).map(toProvider);
}

export function ProvidersClient() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [priceFilter, setPriceFilter] = useState("Semua");
  const [sort, setSort] = useState<SortValue>("name-asc");

  const handleRetry = () => {
    setLoading(true);
    setLoadError(null);
    void (async () => {
      try {
        setProviders(await fetchProviders());
      } catch (error) {
        setLoadError(
          error instanceof Error ? error.message : "Terjadi kesalahan",
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
        const data = await fetchProviders();
        if (cancelled) return;
        setProviders(data);
      } catch (error) {
        if (!cancelled) {
          setLoadError(
            error instanceof Error ? error.message : "Terjadi kesalahan",
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

  const stats = useMemo(
    () => ({
      total: providers.length,
      gratis: providers.filter((p) => p.priceModel === "Gratis").length,
      freemium: providers.filter((p) => p.priceModel === "Freemium").length,
      premium: providers.filter((p) => p.priceModel === "Premium").length,
    }),
    [providers],
  );

  const filtered = useMemo(() => {
    const result = providers.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchesPrice =
        priceFilter === "Semua" || p.priceModel === priceFilter;
      return matchesSearch && matchesPrice;
    });

    result.sort((a, b) => {
      switch (sort) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "rating-desc":
          return b.rating - a.rating;
        case "rating-asc":
          return a.rating - b.rating;
        case "materials-desc":
          return b.totalMaterials - a.totalMaterials;
        case "materials-asc":
          return a.totalMaterials - b.totalMaterials;
        default:
          return 0;
      }
    });

    return result;
  }, [search, priceFilter, sort, providers]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              Provider <span className="text-blue">Materi</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Jelajahi semua sumber materi kuliah yang terintegrasi dengan
              LectureRouter. Bandingkan berdasarkan jumlah materi, format,
              bahasa, dan model harga.
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative w-full sm:flex-1 sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari provider..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto flex-nowrap pb-1 -mb-1">
              {priceFilters.map((pf) => (
                <button
                  key={pf}
                  onClick={() => setPriceFilter(pf)}
                  className={cn(
                    "shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                    priceFilter === pf
                      ? "bg-blue/10 text-blue border border-blue/20"
                      : "bg-muted text-muted-foreground hover:text-foreground border border-transparent",
                  )}
                >
                  {pf}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="flex items-center gap-2 text-sm">
              <Database className="h-4 w-4 text-blue shrink-0" />
              <span className="text-muted-foreground whitespace-nowrap">
                Total:{" "}
                <span className="font-semibold font-mono">{stats.total}</span>{" "}
                provider
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="blue" className="text-[10px] px-1.5 py-0">
                {stats.gratis} Gratis
              </Badge>
              <Badge variant="amber" className="text-[10px] px-1.5 py-0">
                {stats.freemium} Freemium
              </Badge>
              <Badge variant="blue" className="text-[10px] px-1.5 py-0">
                {stats.premium} Premium
              </Badge>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortValue)}
                className="text-sm bg-transparent border border-border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue/50"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-sm text-muted-foreground mb-6">
            Menampilkan{" "}
            <span className="font-semibold font-mono">{filtered.length}</span>{" "}
            dari <span className="font-semibold font-mono">{stats.total}</span>{" "}
            provider
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading && (
              <div className="col-span-full flex flex-col items-center justify-center py-20">
                <Loader2 className="h-8 w-8 text-blue animate-spin mb-3" />
                <p className="text-sm text-muted-foreground">
                  Memuat provider dari Firebase...
                </p>
              </div>
            )}

            {!loading && loadError && (
              <div className="col-span-full text-center py-20">
                <Database className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Gagal memuat provider
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {loadError}
                </p>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={handleRetry}
                >
                  <RefreshCw className="h-4 w-4" /> Coba Lagi
                </Button>
              </div>
            )}

            {!loading &&
              !loadError &&
              filtered.map((provider, i) => (
                <ProviderCard key={provider.id} provider={provider} index={i} />
              ))}
          </div>

          {!loading && !loadError && filtered.length === 0 && (
            <div className="text-center py-20">
              <Database className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Provider tidak ditemukan
              </h3>
              <p className="text-sm text-muted-foreground">
                Coba ubah kata kunci pencarian Anda
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
