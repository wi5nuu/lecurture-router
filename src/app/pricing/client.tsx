"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { pricingTiers } from "@/lib/data";

const comparisons = [
  {
    feature: "Jumlah materi yang dapat diakses",
    free: "10% catalog",
    pro: "100% catalog",
    inst: "100% + API",
  },
  {
    feature: "Preview dokumen",
    free: "3 halaman",
    pro: "Full preview",
    inst: "Full preview",
  },
  {
    feature: "Unduh materi",
    free: "5/hari",
    pro: "Tak terbatas",
    inst: "Tak terbatas",
  },
  {
    feature: "Koleksi & folder pribadi",
    free: "1 folder",
    pro: "Tak terbatas",
    inst: "Tak terbatas",
  },
  {
    feature: "Iklan",
    free: "Ditampilkan",
    pro: "Tidak ada",
    inst: "Tidak ada",
  },
  { feature: "Rekomendasi AI", free: false, pro: true, inst: true },
  { feature: "Export sitasi", free: false, pro: true, inst: true },
  { feature: "Akses offline", free: false, pro: true, inst: true },
  { feature: "Manajemen pengguna", free: false, pro: false, inst: true },
  { feature: "Integrasi SSO", free: false, pro: false, inst: true },
  { feature: "API akses khusus", free: false, pro: false, inst: true },
  { feature: "Dedicated support", free: false, pro: false, inst: true },
];

export function PricingClient() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <Badge variant="blue" className="mb-4 px-3 py-1">
              Harga
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Pilih Paket yang Tepat
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Mulai dari gratis untuk akses dasar, hingga paket lengkap untuk
              institusi pendidikan
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            {pricingTiers.map((tier, i) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className={`relative rounded-2xl border p-8 transition-all duration-300 ${
                  tier.popular
                    ? "border-blue bg-gradient-to-b from-blue/5 to-transparent shadow-xl shadow-blue/10 scale-105 md:scale-110"
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
                          Rp {tier.price.toLocaleString()}
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
                      <Check
                        className={`h-5 w-5 shrink-0 mt-0.5 ${tier.popular ? "text-blue" : "text-muted-foreground"}`}
                      />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                <Link href={tier.id === "institution" ? "#" : "/register"}>
                  <Button
                    variant={tier.popular ? "blue" : "outline"}
                    className="w-full h-12 text-base gap-2"
                  >
                    {tier.cta} <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-center mb-8">
              Perbandingan Fitur Lengkap
            </h2>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-4 font-semibold">Fitur</th>
                    <th className="text-center p-4 font-semibold text-blue">
                      Free
                    </th>
                    <th className="text-center p-4 font-semibold text-violet">
                      Student Pro
                    </th>
                    <th className="text-center p-4 font-semibold text-amber">
                      Institution
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      <td className="p-4 text-muted-foreground">
                        {row.feature}
                      </td>
                      <td className="p-4 text-center">
                        {typeof row.free === "boolean" ? (
                          row.free ? (
                            <Check className="h-4 w-4 text-blue mx-auto" />
                          ) : (
                            <span className="text-muted-foreground/50">
                              &mdash;
                            </span>
                          )
                        ) : (
                          <span className="text-xs">{row.free}</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {typeof row.pro === "boolean" ? (
                          row.pro ? (
                            <Check className="h-4 w-4 text-blue mx-auto" />
                          ) : (
                            <span className="text-muted-foreground/50">
                              &mdash;
                            </span>
                          )
                        ) : (
                          <span className="text-xs">{row.pro}</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {typeof row.inst === "boolean" ? (
                          row.inst ? (
                            <Check className="h-4 w-4 text-blue mx-auto" />
                          ) : (
                            <span className="text-muted-foreground/50">
                              &mdash;
                            </span>
                          )
                        ) : (
                          <span className="text-xs">{row.inst}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16 p-12 rounded-2xl border border-border bg-gradient-to-br from-blue/5 to-transparent"
          >
            <Sparkles className="h-8 w-8 text-blue mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              Butuh Paket Khusus untuk Institusi Anda?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Kami menyediakan harga khusus untuk universitas, politeknik, dan
              institusi pendidikan dengan kebutuhan akses massal.
            </p>
            <Button size="lg" className="bg-blue hover:bg-blue-dark gap-2">
              Hubungi Kami <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
