"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState } from "react";

export function ForgotPasswordClient() {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-emerald/5 via-background to-violet/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald text-white font-bold text-sm transition-transform group-hover:scale-105">
              LR
            </div>
            <span className="text-xl font-bold">
              Lecture<span className="text-emerald">Router</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Lupa Password</h1>
          <p className="text-sm text-muted-foreground">
            {sent ? "Cek email Anda untuk tautan reset password" : "Masukkan email Anda, kami akan kirim tautan reset"}
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            {!sent ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="email" placeholder="nama@email.com" className="pl-10" />
                  </div>
                </div>
                <Button className="w-full h-12 bg-emerald hover:bg-emerald-dark gap-2" onClick={() => setSent(true)}>
                  Kirim Tautan Reset <Send className="h-4 w-4" />
                </Button>
                <div className="text-center">
                  <Link href="/login" className="inline-flex items-center gap-1 text-sm text-emerald hover:underline">
                    <ArrowLeft className="h-3 w-3" /> Kembali ke Login
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald/10 mx-auto mb-4">
                  <Send className="h-6 w-6 text-emerald" />
                </div>
                <h3 className="font-semibold mb-2">Email Terkirim!</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Jika email terdaftar, Anda akan menerima tautan reset password dalam beberapa menit.
                </p>
                <Link href="/login">
                  <Button variant="outline" className="gap-2">
                    <ArrowLeft className="h-4 w-4" /> Kembali ke Login
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
