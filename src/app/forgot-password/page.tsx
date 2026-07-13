import type { Metadata } from "next";
import { ForgotPasswordClient } from "./client";

export const metadata: Metadata = {
  title: "Lupa Password",
  description: "Reset password akun LectureRouter Anda",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}
