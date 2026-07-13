"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Star, Database } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProviderCard } from "@/components/shared/provider-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { providers, type Provider } from "@/lib/data";
import { cn } from "@/lib/utils";

const priceFilters = ["Semua", "Gratis", "Freemium", "Premium", "Mixed"];

export function ProvidersClient() {
  const [search, setSearch] = useState("");
  const [priceFilter, setPriceFilter] = useState("Semua");

  const filtered = providers.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesPrice = priceFilter === "Semua" || p.priceModel === priceFilter;
    return matchesSearch && matchesPrice;
  });

  const stats = {
    total: providers.length,
    gratis: providers.filter((p) => p.priceModel === "Gratis").length,
    freemium: providers.filter((p) => p.priceModel === "Freemium").length,
    premium: providers.filter((p) => p.priceModel === "Premium").length,
  };

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
              Provider <span className="text-emerald">Materi</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Jelajahi semua sumber materi kuliah yang terintegrasi dengan LectureRouter.
              Bandingkan berdasarkan jumlah materi, format, bahasa, dan model harga.
            </p>
          </motion.div>

          <div className="flex flex-wrap gap-4 mb-8">
            <div className="relative flex-1 min-w-[280px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari provider..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              {priceFilters.map((pf) => (
                <button
                  key={pf}
                  onClick={() => setPriceFilter(pf)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                    priceFilter === pf
                      ? "bg-emerald/10 text-emerald border border-emerald/20"
                      : "bg-muted text-muted-foreground hover:text-foreground border border-transparent"
                  )}
                >
                  {pf}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6 mb-8 text-sm">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-emerald" />
              <span className="text-muted-foreground">Total:</span>
              <span className="font-semibold font-mono">{stats.total}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="emerald" className="text-[10px] px-1.5 py-0">
                {stats.gratis} Gratis
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="amber" className="text-[10px] px-1.5 py-0">
                {stats.freemium} Freemium
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="blue" className="text-[10px] px-1.5 py-0">
                {stats.premium} Premium
              </Badge>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((provider, i) => (
              <ProviderCard key={provider.id} provider={provider} index={i} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <Database className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Provider tidak ditemukan</h3>
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
