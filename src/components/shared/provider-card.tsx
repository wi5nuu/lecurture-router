"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Star, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Provider } from "@/lib/data";

interface ProviderCardProps {
  provider: Provider;
  index?: number;
}

export function ProviderCard({ provider, index = 0 }: ProviderCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/providers/${provider.id}`}>
        <Card className="group h-full hover:shadow-lg hover:border-emerald/30 dark:hover:border-emerald/20 transition-all duration-300 cursor-pointer">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground">
                {provider.name.slice(0, 2).toUpperCase()}
              </div>
              <Badge variant={
                provider.priceModel === "Gratis" ? "emerald" :
                provider.priceModel === "Freemium" ? "amber" : "blue"
              }>
                {provider.priceModel}
              </Badge>
            </div>

            <h3 className="font-semibold text-sm mb-1 group-hover:text-emerald transition-colors">
              {provider.name}
            </h3>

            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
              {provider.description}
            </p>

            <div className="flex items-center gap-1.5 mb-3">
              <Database className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-mono text-muted-foreground">
                {provider.totalMaterials >= 1_000_000
                  ? `${(provider.totalMaterials / 1_000_000).toFixed(1)}M`
                  : provider.totalMaterials >= 1_000
                    ? `${(provider.totalMaterials / 1_000).toFixed(1)}K`
                    : provider.totalMaterials
              } materi
              </span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
              <Star className="h-3.5 w-3.5 text-amber fill-amber" />
              <span className="text-xs font-medium">{provider.rating}</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {provider.formats.slice(0, 3).map((fmt) => (
                <span key={fmt} className="text-xs bg-muted px-2 py-0.5 rounded-md text-muted-foreground">
                  {fmt}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
