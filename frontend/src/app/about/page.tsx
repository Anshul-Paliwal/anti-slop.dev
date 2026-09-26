import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DigitalNightBackground from "@/components/DigitalNightBackground";
import AboutSection from "@/components/AboutSection";
import SwotAnalysis from "@/components/SwotAnalysis";
import SectionDivider from "@/components/SectionDivider";

export const metadata = {
  title: "About | AntiSlop.dev",
  description: "Learn more about the Anti-Slop AST purification tool.",
};

export default function AboutPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background bg-grain selection:bg-terminal-green/30 selection:text-terminal-green overflow-hidden">
      <DigitalNightBackground />
      <Navbar />
      
      <main className="flex-1 z-10 relative pt-24">
        <AboutSection />
        <SectionDivider />
        <SwotAnalysis />
      </main>
      
      <Footer />
    </div>
  );
}
