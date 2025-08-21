import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { AiCapabilitiesSection } from "@/components/ai-capabilities-section";
import { Footer } from "@/components/footer";
import { getCalendarEvents } from "./actions/actions";

export default async function HomePage() {

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <AiCapabilitiesSection />
      </main>
      <Footer />
    </div>
  );
}
