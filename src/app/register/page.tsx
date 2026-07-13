import type { Metadata } from "next";
import { RegisterClient } from "./client";

export const metadata: Metadata = {
  title: "Daftar",
  description: "Daftar akun LectureRouter gratis",
};

export default function RegisterPage() {
  return <RegisterClient />;
}
