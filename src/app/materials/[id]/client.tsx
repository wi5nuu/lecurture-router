"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, Download, Bookmark, Share2, Star,
  ExternalLink, Calendar, User, Building2, Quote,
  FileText, Play, BookOpen, Globe, BarChart3, Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MaterialCard } from "@/components/shared/material-card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { materials, type Material } from "@/lib/data";

const formatColors: Record<string, string> = {
  PDF: "border-rose/20 bg-rose/5 text-rose",
  Video: "border-blue/20 bg-blue/5 text-blue",
  Slide: "border-amber/20 bg-amber/5 text-amber",
  "E-Book": "border-violet/20 bg-violet/5 text-violet",
};

interface Props {
  material: Material;
}

export function MaterialDetailClient({ material }: Props) {
  const related = materials
    .filter((m) => m.category === material.category && m.id !== material.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-emerald transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant={material.price === "Gratis" ? "emerald" : material.price === "Freemium" ? "amber" : "blue"}>
                    {material.price}
                  </Badge>
                  <Badge variant="outline" className={formatColors[material.format]}>
                    {material.format}
                  </Badge>
                  <Badge variant="outline">{material.level}</Badge>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
                  {material.title}
                </h1>

                <div className="flex items-center gap-1.5 mb-4">
                  <Star className="h-4 w-4 text-amber fill-amber" />
                  <span className="font-semibold text-sm">{material.rating}</span>
                  <span className="text-sm text-muted-foreground">
                    ({material.reviewCount.toLocaleString()} ulasan)
                  </span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {material.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {material.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-xs text-muted-foreground"
                    >
                      <Tag className="h-3 w-3" /> {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button className="bg-emerald hover:bg-emerald-dark gap-2">
                    <ExternalLink className="h-4 w-4" /> Akses Materi
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" /> Unduh
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Bookmark className="h-4 w-4" /> Simpan
                  </Button>
                  <Button variant="ghost" size="icon" className="h-10 w-10">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Preview Materi</h3>
                  <div className="aspect-video rounded-lg bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                    <div className="text-center">
                      {material.format === "Video" ? (
                        <Play className="h-16 w-16 text-muted-foreground/30 mx-auto mb-2" />
                      ) : (
                        <FileText className="h-16 w-16 text-muted-foreground/30 mx-auto mb-2" />
                      )}
                      <p className="text-sm text-muted-foreground">
                        Preview {material.format} tersedia setelah akses
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Informasi Sumber</h3>
                    <div className="space-y-4 text-sm">
                      <div className="flex items-start gap-3">
                        <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-muted-foreground text-xs">Universitas</p>
                          <p className="font-medium">{material.university}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-muted-foreground text-xs">Dosen/Instruktur</p>
                          <p className="font-medium">{material.instructor}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <BookOpen className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-muted-foreground text-xs">Mata Kuliah</p>
                          <p className="font-medium">{material.course}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Globe className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-muted-foreground text-xs">Sumber</p>
                          <Link href={`/providers/${material.provider}`} className="font-medium text-emerald hover:underline">
                            {material.source}
                          </Link>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-muted-foreground text-xs">Tahun</p>
                          <p className="font-medium">{material.year}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Quote className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-muted-foreground text-xs">Sitasi</p>
                          <p className="font-medium font-mono">{material.citations.toLocaleString()} sitasi</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <BarChart3 className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-muted-foreground text-xs">Bahasa</p>
                          <p className="font-medium">{material.language}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {related.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Materi Terkait</h3>
                    <div className="space-y-3">
                      {related.map((m) => (
                        <Link
                          key={m.id}
                          href={`/materials/${m.id}`}
                          className="block p-3 rounded-lg hover:bg-muted transition-colors"
                        >
                          <p className="text-sm font-medium line-clamp-2 hover:text-emerald transition-colors">
                            {m.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">{m.format}</Badge>
                            <span className="text-xs text-muted-foreground">{m.source}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
