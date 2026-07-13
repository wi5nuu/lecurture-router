"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { AnimatedSection, AnimatedStagger, AnimatedItem } from "@/components/shared/animated-section";
import { testimonials } from "@/lib/data";

export function Testimonials() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Apa Kata Mereka?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Bergabung dengan puluhan ribu mahasiswa dan akademisi yang sudah merasakan manfaatnya
          </p>
        </AnimatedSection>

        <AnimatedStagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <AnimatedItem key={t.id}>
              <motion.div
                whileHover={{ y: -4 }}
                className="relative p-6 rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:border-emerald/30 dark:hover:border-emerald/20"
              >
                <Quote className="h-8 w-8 text-emerald/20 absolute top-4 right-4" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald/10 text-emerald font-semibold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.university}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {t.content}
                </p>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < t.rating ? "text-amber fill-amber" : "text-muted-foreground/30"}`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatedItem>
          ))}
        </AnimatedStagger>
      </div>
    </section>
  );
}
