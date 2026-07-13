"use client";

import { motion } from "framer-motion";
import { Star, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/shared/animated-section";
import { providers } from "@/lib/data";
import Link from "next/link";

const priceColors: Record<string, string> = {
  Gratis: "emerald",
  Freemium: "amber",
  Premium: "blue",
  Mixed: "violet",
};

export function ProvidersTable() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Provider Terintegrasi
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Bandingkan sumber materi dari berbagai provider terkemuka dunia
          </p>
        </AnimatedSection>

        <AnimatedSection>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Provider</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Deskripsi</th>
                  <th className="text-right p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Jumlah Materi</th>
                  <th className="text-center p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Format</th>
                  <th className="text-center p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Harga</th>
                  <th className="text-center p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rating</th>
                  <th className="text-right p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody>
                {providers.slice(0, 8).map((provider, i) => (
                  <motion.tr
                    key={provider.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground shrink-0">
                          {provider.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <Link href={`/providers/${provider.id}`} className="text-sm font-semibold hover:text-emerald transition-colors">
                            {provider.name}
                          </Link>
                          <p className="text-xs text-muted-foreground hidden lg:block">{provider.headquarters}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground hidden md:table-cell max-w-xs truncate">
                      {provider.description}
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-sm font-mono font-semibold">
                        {provider.totalMaterials >= 1_000_000
                          ? `${(provider.totalMaterials / 1_000_000).toFixed(1)}M`
                          : provider.totalMaterials >= 1_000
                            ? `${(provider.totalMaterials / 1_000).toFixed(1)}K`
                            : provider.totalMaterials}
                      </span>
                    </td>
                    <td className="p-4 text-center hidden sm:table-cell">
                      <div className="flex flex-wrap justify-center gap-1">
                        {provider.formats.slice(0, 2).map((fmt) => (
                          <span key={fmt} className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">
                            {fmt}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <Badge variant={priceColors[provider.priceModel] as any}>
                        {provider.priceModel}
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-3.5 w-3.5 text-amber fill-amber" />
                        <span className="text-sm font-mono font-semibold">{provider.rating}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/providers/${provider.id}`}>
                        <Button variant="ghost" size="sm" className="text-xs gap-1">
                          Detail <ExternalLink className="h-3 w-3" />
                        </Button>
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-center mt-8">
            <Link href="/providers">
              <Button variant="outline">
                Lihat Semua Provider ({providers.length})
              </Button>
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
