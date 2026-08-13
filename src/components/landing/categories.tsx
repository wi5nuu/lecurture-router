"use client";

import { motion } from "framer-motion";
import {
  Settings,
  HeartPulse,
  TrendingUp,
  Scale,
  FlaskConical,
  Users,
  BookOpen,
  Monitor,
  GraduationCap,
  Palette,
  Sprout,
  Compass,
} from "lucide-react";
import {
  AnimatedSection,
  AnimatedStagger,
  AnimatedItem,
} from "@/components/shared/animated-section";
import { categories, type Category } from "@/lib/data";

const iconMap: Record<string, React.ReactNode> = {
  settings: <Settings className="h-6 w-6" />,
  "heart-pulse": <HeartPulse className="h-6 w-6" />,
  "trending-up": <TrendingUp className="h-6 w-6" />,
  scale: <Scale className="h-6 w-6" />,
  "flask-conical": <FlaskConical className="h-6 w-6" />,
  users: <Users className="h-6 w-6" />,
  "book-open": <BookOpen className="h-6 w-6" />,
  monitor: <Monitor className="h-6 w-6" />,
  "graduation-cap": <GraduationCap className="h-6 w-6" />,
  palette: <Palette className="h-6 w-6" />,
  sprout: <Sprout className="h-6 w-6" />,
  compass: <Compass className="h-6 w-6" />,
};

const colorMap: Record<string, string> = {
  rose: "text-rose bg-rose/10 border-rose/20",
  amber: "text-amber bg-amber/10 border-amber/20",
  violet: "text-violet bg-violet/10 border-violet/20",
  cyan: "text-cyan bg-cyan/10 border-cyan/20",
  orange: "text-orange bg-orange/10 border-orange/20",
  pink: "text-pink bg-pink/10 border-pink/20",
  blue: "text-blue bg-blue/10 border-blue/20",
  teal: "text-teal bg-teal/10 border-teal/20",
  purple: "text-purple bg-purple/10 border-purple/20",
  green: "text-green bg-green/10 border-green/20",
  indigo: "text-indigo bg-indigo/10 border-indigo/20",
};

export function Categories() {
  return (
    <section className="py-20 sm:py-28 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Jelajahi Berdasarkan Kategori
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ribuan materi kuliah tersedia dalam berbagai bidang ilmu
          </p>
        </AnimatedSection>

        <AnimatedStagger className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <AnimatedItem key={cat.id}>
              <motion.a
                href="#"
                whileHover={{ y: -4 }}
                className="group flex flex-col items-center p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-all duration-300 text-center"
              >
                <div
                  className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl border ${colorMap[cat.color]} transition-transform group-hover:scale-110`}
                >
                  {iconMap[cat.icon]}
                </div>
                <h3 className="text-sm font-semibold mb-1 group-hover:text-blue transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-muted-foreground font-mono">
                  {(cat.materialCount / 1000).toFixed(0)}K materi
                </p>
              </motion.a>
            </AnimatedItem>
          ))}
        </AnimatedStagger>
      </div>
    </section>
  );
}
