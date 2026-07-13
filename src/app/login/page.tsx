import type { Metadata } from "next";
import { LoginClient } from "./client";

export const metadata: Metadata = {
  title: "Masuk",
  description: "Masuk ke akun LectureRouter Anda",
};

export default function LoginPage() {
  return <LoginClient />;
}
