import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FreeSection from "@/components/FreeSection";
import DisciplineSection from "@/components/DisciplineSection";
import GallerySection from "@/components/GallerySection";
import TestimonialsSection from "@/components/TestimonialsSection";
import WhyUsSection from "@/components/WhyUsSection";
import ClosingSection from "@/components/ClosingSection";
import Footer from "@/components/Footer";
import AnnouncementBanner from "@/components/AnnouncementBanner";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <AnnouncementBanner />
      <HeroSection />
      <FreeSection />
      <DisciplineSection />
      <GallerySection />
      <TestimonialsSection />
      <WhyUsSection />
      <ClosingSection />
      <Footer />
    </div>
  );
};

export default Index;
