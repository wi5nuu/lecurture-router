"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/shared/animated-section";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald/10 via-violet/5 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald/5 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedSection>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald/30 bg-emerald/5 text-emerald text-sm font-medium mb-8">
              <Sparkles className="h-4 w-4" />
              Gratis Selamanya untuk Tier Dasar
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Siap Memulai{" "}
              <span className="bg-gradient-to-r from-emerald to-violet bg-clip-text text-transparent">
                Perjalanan Akademik
              </span>{" "}
              Anda?
            </h2>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Bergabung dengan 50.000+ mahasiswa dan akademisi. Akses materi dari 
              mana saja, kapan saja, tanpa batas.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="xl" className="bg-emerald hover:bg-emerald-dark shadow-lg shadow-emerald/25 text-base gap-2">
                  Mulai Gratis Sekarang
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="xl" variant="outline" className="text-base">
                  Lihat Demo Dashboard
                </Button>
              </Link>
            </div>

            <p className="text-xs text-muted-foreground mt-6">
              Tidak perlu kartu kredit. Cancel kapan saja.
            </p>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
}
