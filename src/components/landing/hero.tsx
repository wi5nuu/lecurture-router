"use client";

import { motion } from "framer-motion";
import { SearchBar } from "@/components/shared/search-bar";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue/5 via-transparent to-transparent" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-violet/10 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue/30 bg-blue/5 text-blue text-sm font-medium mb-8"
          >
            <Sparkles className="h-4 w-4" />
            Platform Agregator Materi Kuliah #1 di Indonesia
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            <span className="bg-gradient-to-r from-blue via-blue to-violet bg-clip-text text-transparent">
              Satu Akses
            </span>{" "}
            untuk Semua <br className="hidden sm:block" />
            Materi Kuliah
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Akses instan ke{" "}
            <span className="text-foreground font-semibold">jutaan materi</span>{" "}
            dari{" "}
            <span className="text-foreground font-semibold">
              ribuan universitas & platform
            </span>{" "}
            terbaik dunia. Tanpa perlu subscribe satu-satu.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-10"
          >
            <SearchBar large />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/register">
              <Button
                size="xl"
                className="bg-blue hover:bg-blue-dark shadow-lg shadow-blue/25 text-base gap-2"
              >
                Mulai Gratis
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/providers">
              <Button size="xl" variant="outline" className="text-base">
                Lihat Providers
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 flex items-center justify-center gap-8 sm:gap-12 text-xs text-muted-foreground"
          >
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground font-mono">
                650M+
              </p>
              <p>Materi Terindeks</p>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground font-mono">
                12K+
              </p>
              <p>Provider</p>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground font-mono">
                50K+
              </p>
              <p>Mahasiswa Aktif</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
