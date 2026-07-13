import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/landing/hero";
import { TrustedSources } from "@/components/landing/trusted-sources";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Categories } from "@/components/landing/categories";
import { ProvidersTable } from "@/components/landing/providers-table";
import { PricingSection } from "@/components/landing/pricing-section";
import { Testimonials } from "@/components/landing/testimonials";
import { FAQSection } from "@/components/landing/faq-section";
import { CTASection } from "@/components/landing/cta-section";

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustedSources />
        <HowItWorks />
        <Categories />
        <ProvidersTable />
        <PricingSection />
        <Testimonials />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
