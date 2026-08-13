"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";
import { useState } from "react";

export function LoginClient() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const validate = () => {
    const next: typeof errors = {};
    if (!email) next.email = "Email wajib diisi";
    else if (!/\S+@\S+\.\S+/.test(email))
      next.email = "Format email tidak valid";
    if (!password) next.password = "Password wajib diisi";
    else if (password.length < 8) next.password = "Password minimal 8 karakter";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue/5 via-background to-violet/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group mb-6">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl">
              <Image
                src="/android-chrome-192x192.png"
                alt="LectureRouter"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <span className="text-xl font-bold">
              Lecture<span className="text-blue">Router</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            Selamat Datang Kembali
          </h1>
          <p className="text-sm text-muted-foreground">
            Masuk untuk melanjutkan akses ke jutaan materi kuliah
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="nama@email.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Password</label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-blue hover:underline"
                  >
                    Lupa password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="rounded border-border"
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-muted-foreground"
                >
                  Ingat saya
                </label>
              </div>
              <Button
                className="w-full h-12 bg-blue hover:bg-blue-dark gap-2"
                onClick={validate}
              >
                Masuk <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                Belum punya akun?{" "}
                <Link
                  href="/register"
                  className="text-blue font-medium hover:underline"
                >
                  Daftar Gratis
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
