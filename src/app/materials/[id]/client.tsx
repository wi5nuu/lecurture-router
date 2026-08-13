"use client";

import Link from "next/link";
import { type Material } from "@/lib/data";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Share2,
  Star,
  ExternalLink,
  Calendar,
  User,
  Building2,
  Quote,
  FileText,
  BookOpen,
  Globe,
  BarChart3,
  Tag,
  Copy,
  Printer,
  Check,
  List,
  Clock,
  FileDown,
  Play,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const formatColors: Record<string, string> = {
  PDF: "border-rose/20 bg-rose/5 text-rose",
  Video: "border-blue/20 bg-blue/5 text-blue",
  Slide: "border-amber/20 bg-amber/5 text-amber",
  "E-Book": "border-violet/20 bg-violet/5 text-violet",
};

interface ContentBlock {
  type: "heading" | "body";
  text: string;
}

const CHAPTER_PATTERN = /^(BAB|BAGIAN|MODUL|SESI)\s+[\dIVXLCDM]+[.:]?\s+.*$/i;

function isSectionTitle(line: string): boolean {
  const t = line.trim();
  if (!t || t.length > 80) return false;
  if (CHAPTER_PATTERN.test(t)) return true;
  // Short capitalized sentence ending with a period → section heading
  if (/^[-*\d]/.test(t)) return false;
  if (!/^[A-ZÀ-ÖØ-ÞÄÖÜ][^,。"”]*(?:\.)$/.test(t)) return false;
  return true;
}

function parseContentSections(content: string): ContentBlock[] {
  const blocks = content
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  const sections: ContentBlock[] = [];
  let buffer: string[] = [];

  const flush = () => {
    if (buffer.length > 0) {
      sections.push({ type: "body", text: buffer.join("\n\n") });
      buffer = [];
    }
  };

  for (const block of blocks) {
    const lines = block.split("\n").map((l) => l.trim());
    if (isSectionTitle(lines[0] ?? "")) {
      flush();
      const titleLines = [lines[0]!];
      let k = 1;
      while (k < lines.length && isSectionTitle(lines[k] ?? "")) {
        titleLines.push(lines[k]!);
        k++;
      }
      sections.push({
        type: "heading",
        text: titleLines.join(" "),
      });
      if (k < lines.length) {
        buffer.push(lines.slice(k).join("\n").trim());
      }
    } else {
      buffer.push(block);
    }
  }
  flush();
  return sections;
}

function toRoman(num: number): string {
  const table: [number, string][] = [
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let n = num;
  let out = "";
  for (const [value, symbol] of table) {
    while (n >= value) {
      out += symbol;
      n -= value;
    }
  }
  return out;
}

function estimateReadingTime(text: string) {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return { words, minutes };
}

function generateCitation(m: Material, format: "apa" | "mla") {
  const author = m.instructor || "Anonymous";
  const year = m.year;
  const title = m.title;
  const source = m.source;
  if (format === "apa") {
    return `${author} (${year}). ${title}. ${source}.`;
  }
  return `${author}. "${title}." ${source}, ${year}.`;
}

interface Props {
  material: Material;
  related: Material[];
}

export function MaterialDetailClient({ material, related }: Props) {
  const [copied, setCopied] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [citationCopied, setCitationCopied] = useState<"apa" | "mla" | null>(
    null,
  );

  const contentBlocks = parseContentSections(material.fullContent ?? "");
  const tocBlocks = contentBlocks
    .map((block, index) => ({ text: block.text, index }))
    .filter((_, i) => contentBlocks[i]!.type === "heading");
  const firstBodyIndex = contentBlocks.findIndex(
    (block) => block.type === "body",
  );

  const headingNumbers = new Map<number, string>();
  {
    let n = 1;
    contentBlocks.forEach((block, i) => {
      if (block.type === "heading") {
        headingNumbers.set(i, toRoman(n));
        n++;
      }
    });
  }
  const { words, minutes } = estimateReadingTime(material.fullContent);

  const handleCopy = useCallback(async () => {
    const text = [
      `Title: ${material.title}`,
      `Author: ${material.instructor}`,
      `University: ${material.university}`,
      `Course: ${material.course}`,
      `Year: ${material.year}`,
      `Format: ${material.format}`,
      `Source: ${material.source}`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }, [material]);

  const handleShare = useCallback(async () => {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: material.title,
          text: `${material.title} - ${material.instructor}`,
          url: window.location.href,
        });
        return;
      } catch {}
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    } catch {}
  }, [material]);

  const handleDownload = useCallback(() => {
    const content = [
      material.title,
      "=".repeat(material.title.length),
      "",
      `Author: ${material.instructor}`,
      `University: ${material.university}`,
      `Course: ${material.course}`,
      `Year: ${material.year}`,
      `Source: ${material.source}`,
      "",
      "-".repeat(40),
      "",
      material.fullContent,
      "",
      "-".repeat(40),
      "",
      "Citation:",
      generateCitation(material, "apa"),
    ].join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${material.title.replace(/[^a-zA-Z0-9]/g, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [material]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleCopyCitation = useCallback(
    async (format: "apa" | "mla") => {
      const text = generateCitation(material, format);
      try {
        await navigator.clipboard.writeText(text);
        setCitationCopied(format);
        setTimeout(() => setCitationCopied(null), 2000);
      } catch {}
    },
    [material],
  );

  return (
    <div className="min-h-screen flex flex-col print:min-h-0">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 print:px-0 print:py-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-blue transition-colors mb-6 print:hidden"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Badge
                    variant={
                      material.price === "Gratis"
                        ? "blue"
                        : material.price === "Freemium"
                          ? "amber"
                          : "blue"
                    }
                  >
                    {material.price}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={formatColors[material.format]}
                  >
                    {material.format}
                  </Badge>
                  <Badge variant="outline">{material.level}</Badge>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
                  {material.title}
                </h1>

                <div className="flex items-center gap-1.5 mb-4">
                  <Star className="h-4 w-4 text-amber fill-amber" />
                  <span className="font-semibold text-sm">
                    {material.rating}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({material.reviewCount.toLocaleString()} ulasan)
                  </span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {material.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {material.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-xs text-muted-foreground"
                    >
                      <Tag className="h-3 w-3" /> {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 print:hidden">
                  <Button className="bg-blue hover:bg-blue-dark gap-2">
                    <ExternalLink className="h-4 w-4" /> Akses Materi
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={handleDownload}
                  >
                    <FileDown className="h-4 w-4" /> Unduh
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={handlePrint}
                  >
                    <Printer className="h-4 w-4" /> Cetak
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" /> Tersalin
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" /> Salin Info
                      </>
                    )}
                  </Button>
                  <Button
                    variant={shareSuccess ? "default" : "ghost"}
                    size="icon"
                    className="h-10 w-10"
                    onClick={handleShare}
                  >
                    {shareSuccess ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Share2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </motion.div>

              {material.fullContent && (
                <>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground print:hidden">
                    <span className="inline-flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {words.toLocaleString()} kata
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-4 w-4" />~{minutes} menit baca
                    </span>
                    {material.isbn && (
                      <span className="inline-flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        ISBN: {material.isbn}
                      </span>
                    )}
                  </div>

                  {tocBlocks.length > 0 && (
                    <Card className="print:hidden">
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-3 inline-flex items-center gap-2">
                          <List className="h-4 w-4" /> Daftar Isi
                        </h3>
                        <nav className="space-y-1">
                          {tocBlocks.map((entry, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                const el = document.getElementById(
                                  `section-${entry.index}`,
                                );
                                el?.scrollIntoView({ behavior: "smooth" });
                              }}
                              className="flex w-full items-center gap-2 text-left text-sm text-muted-foreground hover:text-blue transition-colors py-1 px-2 rounded hover:bg-muted"
                            >
                              <span className="font-mono text-xs text-blue/70 w-6 shrink-0">
                                {headingNumbers.get(entry.index)}
                              </span>
                              <span className="truncate">{entry.text}</span>
                            </button>
                          ))}
                        </nav>
                      </CardContent>
                    </Card>
                  )}

                  <Card>
                    <CardContent className="p-6 sm:p-10 print:p-4">
                      {/* Journal article header */}
                      <div className="border-b border-border pb-6 mb-8 print:border-black/20">
                        <p className="text-[11px] uppercase tracking-[0.25em] text-blue/80 font-semibold mb-3">
                          {material.format} ·{" "}
                          {material.course || material.source}
                        </p>
                        <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                          {material.title}
                        </h2>
                        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                          {material.instructor && (
                            <span className="inline-flex items-center gap-1.5">
                              <User className="h-3.5 w-3.5" />
                              {material.instructor}
                            </span>
                          )}
                          {material.university && (
                            <span className="inline-flex items-center gap-1.5">
                              <Building2 className="h-3.5 w-3.5" />
                              {material.university}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {material.year}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Globe className="h-3.5 w-3.5" />
                            {material.source}
                          </span>
                        </div>
                      </div>

                      {/* Abstract */}
                      <div className="mb-8">
                        <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground font-semibold mb-2">
                          Abstrak
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {material.description}
                        </p>
                      </div>

                      {/* Article body */}
                      <article className="font-serif text-[15px] sm:text-base leading-8 text-foreground/90">
                        {contentBlocks.map((block, i) => {
                          if (block.type === "heading") {
                            const chapter = headingNumbers.get(i);
                            return (
                              <div
                                key={i}
                                id={`section-${i}`}
                                className="my-8 scroll-mt-24 print:my-6"
                              >
                                {chapter && (
                                  <p className="text-[11px] uppercase tracking-[0.3em] text-blue/70 font-sans font-semibold mb-2">
                                    BAGIAN {chapter}
                                  </p>
                                )}
                                <h3 className="font-sans text-lg font-bold text-foreground tracking-tight">
                                  {block.text}
                                </h3>
                                <div className="mt-3 h-px bg-gradient-to-r from-blue/40 via-border to-transparent" />
                              </div>
                            );
                          }
                          const isIntro = i === firstBodyIndex;
                          return (
                            <p
                              key={i}
                              className={
                                isIntro
                                  ? "text-justify first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-5xl first-letter:leading-[0.9] first-letter:font-bold first-letter:text-blue"
                                  : "text-justify"
                              }
                            >
                              {block.text.split("\n").map((line, j) => (
                                <span key={j}>
                                  {line}
                                  {j < block.text.split("\n").length - 1 && (
                                    <br />
                                  )}
                                </span>
                              ))}
                            </p>
                          );
                        })}
                      </article>
                    </CardContent>
                  </Card>

                  <Card className="print:break-inside-avoid">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4 inline-flex items-center gap-2">
                        <Quote className="h-4 w-4" /> Sitasi
                      </h3>
                      <div className="space-y-4">
                        <div className="rounded-lg border border-border p-4 bg-muted/30">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs font-medium text-muted-foreground mb-1">
                                APA (7th ed.)
                              </p>
                              <p className="text-sm leading-relaxed">
                                {generateCitation(material, "apa")}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 shrink-0"
                              onClick={() => handleCopyCitation("apa")}
                            >
                              {citationCopied === "apa" ? (
                                <Check className="h-3.5 w-3.5 text-blue" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className="rounded-lg border border-border p-4 bg-muted/30">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs font-medium text-muted-foreground mb-1">
                                MLA (9th ed.)
                              </p>
                              <p className="text-sm leading-relaxed">
                                {generateCitation(material, "mla")}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 shrink-0"
                              onClick={() => handleCopyCitation("mla")}
                            >
                              {citationCopied === "mla" ? (
                                <Check className="h-3.5 w-3.5 text-blue" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              <Card className="print:hidden">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Preview Materi</h3>
                  <div className="aspect-video rounded-lg bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                    <div className="text-center">
                      {material.format === "Video" ? (
                        <Play className="h-16 w-16 text-muted-foreground/30 mx-auto mb-2" />
                      ) : (
                        <FileText className="h-16 w-16 text-muted-foreground/30 mx-auto mb-2" />
                      )}
                      <p className="text-sm text-muted-foreground">
                        Preview {material.format} tersedia setelah akses
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Informasi Sumber</h3>
                    <div className="space-y-4 text-sm">
                      <div className="flex items-start gap-3">
                        <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-muted-foreground text-xs">
                            Universitas
                          </p>
                          <p className="font-medium">{material.university}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-muted-foreground text-xs">
                            Dosen/Instruktur
                          </p>
                          <p className="font-medium">{material.instructor}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <BookOpen className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-muted-foreground text-xs">
                            Mata Kuliah
                          </p>
                          <p className="font-medium">{material.course}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Globe className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-muted-foreground text-xs">
                            Sumber
                          </p>
                          <Link
                            href={`/providers/${material.provider}`}
                            className="font-medium text-blue hover:underline"
                          >
                            {material.source}
                          </Link>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-muted-foreground text-xs">Tahun</p>
                          <p className="font-medium">{material.year}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Quote className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-muted-foreground text-xs">
                            Sitasi
                          </p>
                          <p className="font-medium font-mono">
                            {material.citations.toLocaleString()} sitasi
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <BarChart3 className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-muted-foreground text-xs">
                            Bahasa
                          </p>
                          <p className="font-medium">{material.language}</p>
                        </div>
                      </div>
                      {material.pages && (
                        <div className="flex items-start gap-3">
                          <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-muted-foreground text-xs">
                              Halaman
                            </p>
                            <p className="font-medium">{material.pages} hlm</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {related.length > 0 && (
                <Card className="print:hidden">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Materi Terkait</h3>
                    <div className="space-y-3">
                      {related.map((m) => (
                        <Link
                          key={m.id}
                          href={`/materials/${m.id}`}
                          className="block p-3 rounded-lg hover:bg-muted transition-colors"
                        >
                          <p className="text-sm font-medium line-clamp-2 hover:text-blue transition-colors">
                            {m.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0"
                            >
                              {m.format}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {m.source}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
