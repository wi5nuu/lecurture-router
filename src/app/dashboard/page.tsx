import type { Metadata } from "next";
import { DashboardClient } from "./client";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Jelajahi dan cari materi kuliah dari berbagai sumber",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
