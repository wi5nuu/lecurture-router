"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/providers", label: "Providers" },
  { href: "/pricing", label: "Harga" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative h-9 w-9 overflow-hidden rounded-lg">
            <Image
              src="/android-chrome-192x192.png"
              alt="LectureRouter"
              width={36}
              height={36}
              className="object-cover"
            />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Lecture<span className="text-blue">Router</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              Masuk
            </Button>
          </Link>
          <Link href="/register">
            <Button
              size="sm"
              className="hidden sm:inline-flex bg-blue hover:bg-blue-dark"
            >
              Daftar Gratis
            </Button>
          </Link>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "md:hidden border-t border-border/50 overflow-hidden transition-all duration-300",
          mobileOpen ? "max-h-96" : "max-h-0",
        )}
      >
        <div className="px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2 border-t border-border/50 mt-2">
            <Link href="/login" className="flex-1">
              <Button variant="outline" className="w-full" size="sm">
                Masuk
              </Button>
            </Link>
            <Link href="/register" className="flex-1">
              <Button className="w-full bg-blue hover:bg-blue-dark" size="sm">
                Daftar Gratis
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
