import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import FreeSection from "@/components/FreeSection";
import DisciplineSection from "@/components/DisciplineSection";
import FacilitiesSection from "@/components/FacilitiesSection";
import RulesSection from "@/components/RulesSection";
import WhyUsSection from "@/components/WhyUsSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import ClosingSection from "@/components/ClosingSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <FreeSection />
      <DisciplineSection />
      <FacilitiesSection />
      <RulesSection />
      <WhyUsSection />
      <FAQSection />
      <ContactSection />
      <ClosingSection />
      <Footer />
    </div>
  );
};

export default Index;
