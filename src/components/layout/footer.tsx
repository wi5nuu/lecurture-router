"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Code2, MessageCircle, Link2, Mail, ArrowRight } from "lucide-react";

const footerLinks = {
  Produk: [
    { label: "Fitur", href: "/" },
    { label: "Pricing", href: "/pricing" },
    { label: "Providers", href: "/providers" },
    { label: "API", href: "#" },
    { label: "Changelog", href: "#" },
  ],
  Akademik: [
    { label: "Untuk Mahasiswa", href: "#" },
    { label: "Untuk Dosen", href: "#" },
    { label: "Untuk Institusi", href: "#" },
    { label: "Beasiswa", href: "#" },
    { label: "Blog", href: "#" },
  ],
  Perusahaan: [
    { label: "Tentang", href: "#" },
    { label: "Karir", href: "#" },
    { label: "Kontak", href: "#" },
    { label: "Brand Kit", href: "#" },
    { label: "Press Kit", href: "#" },
  ],
  Legal: [
    { label: "Privasi", href: "#" },
    { label: "Syarat & Ketentuan", href: "#" },
    { label: "Kebijakan Cookie", href: "#" },
    { label: "Lisensi", href: "#" },
    { label: "DMCA", href: "#" },
  ],
};

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="border-t border-border/50 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group mb-4">
              <div className="relative h-8 w-8 overflow-hidden rounded-lg">
                <Image src="/android-chrome-192x192.png" alt="LectureRouter" width={32} height={32} className="object-cover" />
              </div>
              <span className="text-base font-bold tracking-tight">
                Lecture<span className="text-blue">Router</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Satu akses untuk semua materi kuliah dari seluruh dunia. 
              Akses instan ke jutaan materi dari ribuan universitas & platform.
            </p>
            <div className="flex gap-3">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-blue transition-colors">
                <Code2 className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-blue transition-colors">
                <MessageCircle className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-blue transition-colors">
                <Link2 className="h-5 w-5" />
              </a>
              <a href="mailto:hello@lecturerouter.com" className="text-muted-foreground hover:text-blue transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm mb-3">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-blue transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-md w-full">
              <h4 className="text-sm font-semibold mb-2">Dapatkan update materi terbaru</h4>
              {subscribed ? (
                <p className="text-sm text-blue">Terima kasih! Anda telah berlangganan.</p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="email@kampus.ac.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-10 bg-background"
                  />
                  <Button type="submit" className="bg-blue hover:bg-blue-dark shrink-0 h-10">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} LectureRouter. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
