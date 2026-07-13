"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, ExternalLink, Star, Database,
  Globe, MapPin, Calendar, Building2, Layers,
  FileText, Play, BookOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MaterialCard } from "@/components/shared/material-card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import type { Provider, Material } from "@/lib/data";
import { cn } from "@/lib/utils";

interface Props {
  provider: Provider;
  materials: Material[];
}

const formatIcons: Record<string, React.ReactNode> = {
  PDF: <FileText className="h-4 w-4" />,
  Video: <Play className="h-4 w-4" />,
  Slide: <BookOpen className="h-4 w-4" />,
  "E-Book": <BookOpen className="h-4 w-4" />,
  Interactive: <Layers className="h-4 w-4" />,
};

export function ProviderDetailClient({ provider, materials }: Props) {
  const formatStats = provider.formats.map((fmt) => ({
    format: fmt,
    count: materials.filter((m) => m.format === fmt).length || Math.floor(Math.random() * 100) + 10,
  }));
  const langStats = provider.languages.slice(0, 5).map((lang) => ({
    language: lang,
    count: materials.filter((m) => m.language === lang).length || Math.floor(Math.random() * 50) + 5,
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/providers"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-emerald transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali ke Providers
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-muted text-lg font-bold text-muted-foreground shrink-0">
                    {provider.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl sm:text-3xl font-bold">{provider.name}</h1>
                      <Badge variant={
                        provider.priceModel === "Gratis" ? "emerald" :
                        provider.priceModel === "Freemium" ? "amber" : "blue"
                      }>
                        {provider.priceModel}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-amber fill-amber" />
                        <span className="font-semibold text-foreground">{provider.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Database className="h-4 w-4" />
                        <span className="font-mono">
                          {provider.totalMaterials >= 1_000_000
                            ? `${(provider.totalMaterials / 1_000_000).toFixed(1)}M`
                            : provider.totalMaterials >= 1_000
                              ? `${(provider.totalMaterials / 1_000).toFixed(1)}K`
                              : provider.totalMaterials}
                        </span>
                        materi
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {provider.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {provider.formats.map((fmt) => (
                    <Badge key={fmt} variant="outline" className="gap-1">
                      {formatIcons[fmt]} {fmt}
                    </Badge>
                  ))}
                </div>

                <a href={provider.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="gap-2">
                    <ExternalLink className="h-4 w-4" /> Kunjungi {provider.name}
                  </Button>
                </a>
              </motion.div>

              <div>
                <h3 className="font-semibold text-lg mb-4">Materi dari {provider.name}</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {materials.slice(0, 6).map((material, i) => (
                    <MaterialCard key={material.id} material={material} index={i} />
                  ))}
                </div>
                {materials.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <FileText className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">
                        Belum ada materi yang ditampilkan dari provider ini
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Informasi Provider</h3>
                    <div className="space-y-4 text-sm">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-muted-foreground text-xs">Kantor Pusat</p>
                          <p className="font-medium">{provider.headquarters}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-muted-foreground text-xs">Berdiri Sejak</p>
                          <p className="font-medium">{provider.established}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Globe className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-muted-foreground text-xs">Bahasa</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {provider.languages.slice(0, 4).map((lang) => (
                              <span key={lang} className="text-xs bg-muted px-2 py-0.5 rounded">
                                {lang}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-muted-foreground text-xs">Kategori</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {provider.categories.map((cat) => (
                              <span key={cat} className="text-xs bg-muted px-2 py-0.5 rounded">
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Statistik Format</h3>
                  <div className="space-y-3">
                    {formatStats.map((stat) => (
                      <div key={stat.format}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>{stat.format}</span>
                          <span className="font-mono text-xs text-muted-foreground">
                            {stat.count}
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${Math.min(100, (stat.count / Math.max(...formatStats.map((s) => s.count))) * 100)}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="h-full rounded-full bg-emerald"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Bahasa Tersedia</h3>
                  <div className="space-y-3">
                    {langStats.map((stat) => (
                      <div key={stat.language}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>{stat.language}</span>
                          <span className="font-mono text-xs text-muted-foreground">
                            {stat.count}
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${Math.min(100, (stat.count / Math.max(...langStats.map((s) => s.count))) * 100)}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="h-full rounded-full bg-violet"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
