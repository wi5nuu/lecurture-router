"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useState } from "react";

export function RegisterClient() {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("Mahasiswa S1");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const next: Record<string, string> = {};
    if (!firstName) next.firstName = "Nama depan wajib diisi";
    if (!email) next.email = "Email wajib diisi";
    else if (!/\S+@\S+\.\S+/.test(email)) next.email = "Format email tidak valid";
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
              <Image src="/android-chrome-192x192.png" alt="LectureRouter" width={40} height={40} className="object-cover" />
            </div>
            <span className="text-xl font-bold">
              Lecture<span className="text-blue">Router</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Buat Akun Gratis</h1>
          <p className="text-sm text-muted-foreground">
            Daftar sekarang dan akses jutaan materi kuliah
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nama Depan</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="John"
                      className="pl-10"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nama Belakang</label>
                  <Input
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Kampus</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="nama@kampus.ac.id"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 karakter"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select
                  className="flex h-10 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/50"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option>Mahasiswa S1</option>
                  <option>Mahasiswa S2</option>
                  <option>Mahasiswa S3</option>
                  <option>Dosen/Pengajar</option>
                  <option>Peneliti</option>
                  <option>Lainnya</option>
                </select>
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" id="terms" className="rounded border-border mt-1" />
                <label htmlFor="terms" className="text-xs text-muted-foreground">
                  Saya setuju dengan{" "}
                  <a href="#" className="text-blue hover:underline">Syarat & Ketentuan</a>{" "}
                  dan{" "}
                  <a href="#" className="text-blue hover:underline">Kebijakan Privasi</a>
                </label>
              </div>
              <Button className="w-full h-12 bg-blue hover:bg-blue-dark gap-2" onClick={validate}>
                Daftar Gratis <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                Sudah punya akun?{" "}
                <Link href="/login" className="text-blue font-medium hover:underline">
                  Masuk
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
