import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: {
    default: "LectureRouter - Satu Akses untuk Semua Materi Kuliah",
    template: "%s | LectureRouter",
  },
  description:
    "Platform agregator materi kuliah dari seluruh dunia. Akses instan ke jutaan jurnal, e-book, video kuliah, dan catatan mahasiswa dari ribuan universitas terbaik.",
  keywords: [
    "materi kuliah",
    "jurnal akademik",
    "e-book",
    "video kuliah",
    "open course",
    "MIT OCW",
    "Coursera",
    "ResearchGate",
    "belajar online",
    "pendidikan",
  ],
  openGraph: {
    title: "LectureRouter - Satu Akses untuk Semua Materi Kuliah",
    description:
      "Akses instan ke jutaan materi dari ribuan universitas & platform terbaik dunia.",
    type: "website",
    locale: "id_ID",
    siteName: "LectureRouter",
  },
  twitter: {
    card: "summary_large_image",
    title: "LectureRouter - Satu Akses untuk Semua Materi Kuliah",
    description:
      "Akses instan ke jutaan materi dari ribuan universitas & platform terbaik dunia.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="lecture-router-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
