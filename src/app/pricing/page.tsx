import type { Metadata } from "next";
import { PricingClient } from "./client";

export const metadata: Metadata = {
  title: "Harga",
  description: "Pilih paket LectureRouter yang sesuai dengan kebutuhan Anda",
};

export default function PricingPage() {
  return <PricingClient />;
}
