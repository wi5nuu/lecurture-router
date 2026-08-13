"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AnimatedSection,
  AnimatedStagger,
  AnimatedItem,
} from "@/components/shared/animated-section";
import { pricingTiers } from "@/lib/data";
import Link from "next/link";

export function PricingSection() {
  return (
    <section className="py-20 sm:py-28 bg-muted/20" id="pricing">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <Badge variant="blue" className="mb-4 px-3 py-1">
            Harga
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Pilih Paket yang Tepat
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Mulai dari gratis untuk akses dasar, hingga paket lengkap untuk
            institusi
          </p>
        </AnimatedSection>

        <AnimatedStagger className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingTiers.map((tier) => (
            <AnimatedItem key={tier.id}>
              <motion.div
                whileHover={{ y: -4 }}
                className={`relative rounded-2xl border p-8 transition-all duration-300 ${
                  tier.popular
                    ? "border-blue bg-gradient-to-b from-blue/5 to-transparent shadow-xl shadow-blue/10"
                    : "border-border bg-card hover:shadow-lg"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge
                      variant="blue"
                      className="px-4 py-1 text-xs font-semibold"
                    >
                      POPULER
                    </Badge>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    {typeof tier.price === "number" ? (
                      <>
                        <span className="text-4xl font-bold font-mono">
                          {tier.price.toLocaleString()}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          / {tier.period}
                        </span>
                      </>
                    ) : (
                      <span className="text-4xl font-bold">Custom</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {tier.description}
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-3 text-sm">
                      {tier.popular ? (
                        <Check className="h-5 w-5 text-blue shrink-0 mt-0.5" />
                      ) : (
                        <Check className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      )}
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <Link href={tier.id === "institution" ? "#" : "/register"}>
                  <Button
                    variant={tier.popular ? "blue" : "outline"}
                    className="w-full h-12 text-base"
                  >
                    {tier.cta}
                  </Button>
                </Link>
              </motion.div>
            </AnimatedItem>
          ))}
        </AnimatedStagger>
      </div>
    </section>
  );
}
