"use client";

import { motion } from "framer-motion";
import { Search, Filter, Download } from "lucide-react";
import { AnimatedSection, AnimatedStagger, AnimatedItem } from "@/components/shared/animated-section";

const steps = [
  {
    icon: Search,
    title: "Cari Topik",
    description: "Ketik mata kuliah, topik, atau dosen yang Anda butuhkan. Mesin pencari kami akan menelusuri jutaan materi dari berbagai sumber.",
    color: "from-blue/20 to-blue/5 border-blue/20",
    iconColor: "text-blue bg-blue/10",
  },
  {
    icon: Filter,
    title: "Pilih Sumber Terbaik",
    description: "Bandingkan materi dari berbagai provider berdasarkan rating, format, bahasa, dan harga. Filter sesuai kebutuhan Anda.",
    color: "from-violet/20 to-violet/5 border-violet/20",
    iconColor: "text-violet bg-violet/10",
  },
  {
    icon: Download,
    title: "Akses & Unduh",
    description: "Akses langsung materi yang Anda pilih. Simpan ke koleksi pribadi, unduh untuk offline, atau bagikan dengan teman.",
    color: "from-amber/20 to-amber/5 border-amber/20",
    iconColor: "text-amber bg-amber/10",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Bagaimana Cara Kerjanya?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tiga langkah sederhana untuk mengakses jutaan materi kuliah
          </p>
        </AnimatedSection>

        <AnimatedStagger className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <AnimatedItem key={step.title}>
              <div className="relative p-8 rounded-2xl border border-border bg-gradient-to-br transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="absolute top-0 right-0 -mt-3 -mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue text-white text-sm font-bold">
                  {i + 1}
                </div>
                <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl ${step.iconColor}`}>
                  <step.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </AnimatedItem>
          ))}
        </AnimatedStagger>
      </div>
    </section>
  );
}
