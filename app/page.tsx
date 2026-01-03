import { LandingHero } from "@/components/landing/hero";
import { LandingDemo } from "@/components/landing/demo";
import { LandingFeatures } from "@/components/landing/features";
import { LandingPricing } from "@/components/landing/pricing";
import { LandingCTA } from "@/components/landing/cta";
import { LandingNav } from "@/components/landing/nav";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <LandingNav />
      <LandingHero />
      <LandingDemo />
      <LandingFeatures />
      <LandingPricing />
      <LandingCTA />
    </main>
  );
}
