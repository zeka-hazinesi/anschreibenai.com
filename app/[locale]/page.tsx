import ComparisonSection from "@/components/home/comparison-section";
import FromToSection from "@/components/home/FromToSection";
import HowToSection from "@/components/home/HowToSection";
import HeroSection from "@/components/home/HeroSection"; // Import the new component
import FAQSection from "@/components/home/faq-section";

export default function Home() {
  return (
    <div className="flex h-auto w-full flex-col items-center">
      <HeroSection />
      <FromToSection />
      <ComparisonSection />
      <HowToSection />
      <FAQSection />
    </div>
  );
}
