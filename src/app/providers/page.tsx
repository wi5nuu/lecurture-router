import type { Metadata } from "next";
import { ProvidersClient } from "./client";

export const metadata: Metadata = {
  title: "Providers",
  description: "Jelajahi semua sumber materi kuliah yang terintegrasi dengan LectureRouter",
};

export default function ProvidersPage() {
  return <ProvidersClient />;
}
