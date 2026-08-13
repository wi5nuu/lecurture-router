"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Play,
  BookOpen,
  Star,
  Download,
  Bookmark,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Material } from "@/lib/data";

const formatIcons: Record<string, React.ReactNode> = {
  PDF: <FileText className="h-4 w-4" />,
  Video: <Play className="h-4 w-4" />,
  Slide: <BookOpen className="h-4 w-4" />,
  "E-Book": <BookOpen className="h-4 w-4" />,
};

const formatColors: Record<string, string> = {
  PDF: "bg-rose/10 text-rose border-rose/20",
  Video: "bg-blue/10 text-blue border-blue/20",
  Slide: "bg-amber/10 text-amber border-amber/20",
  "E-Book": "bg-violet/10 text-violet border-violet/20",
};

interface MaterialCardProps {
  material: Material;
  index?: number;
}

export function MaterialCard({ material, index = 0 }: MaterialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Link href={`/materials/${material.id}`}>
        <Card className="group h-full overflow-hidden hover:shadow-lg hover:border-blue/30 dark:hover:border-blue/20 transition-all duration-300 cursor-pointer">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                  formatColors[material.format],
                )}
              >
                {formatIcons[material.format]}
                {material.format}
              </div>
              <Badge
                variant={
                  material.price === "Gratis"
                    ? "blue"
                    : material.price === "Freemium"
                      ? "amber"
                      : "blue"
                }
              >
                {material.price}
              </Badge>
            </div>

            <h3 className="font-semibold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-blue transition-colors">
              {material.title}
            </h3>

            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
              {material.description}
            </p>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <span className="truncate">{material.source}</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
              <span>{material.language}</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
              <span>{material.level}</span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border/50">
              <div className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 text-amber fill-amber" />
                <span className="text-xs font-medium">{material.rating}</span>
                <span className="text-xs text-muted-foreground">
                  ({material.reviewCount.toLocaleString()})
                </span>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    alert("Materi ditambahkan ke bookmark!");
                  }}
                >
                  <Bookmark className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    alert("Materi sedang diunduh...");
                  }}
                >
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
