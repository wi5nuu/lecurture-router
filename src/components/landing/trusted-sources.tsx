"use client";

import { motion } from "framer-motion";

const sources = [
  "MIT OCW",
  "Coursera",
  "edX",
  "ResearchGate",
  "Google Scholar",
  "Khan Academy",
  "Academia.edu",
  "Udemy",
  "IEEE",
  "Springer",
  "JSTOR",
  "YouTube Edu",
];

export function TrustedSources() {
  return (
    <section className="border-y border-border/50 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-center text-xs font-medium text-muted-foreground uppercase tracking-widest mb-6">
          Terintegrasi dengan sumber terpercaya
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {sources.map((name, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="text-sm font-semibold text-muted-foreground/60 hover:text-blue transition-colors cursor-default"
            >
              {name}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
