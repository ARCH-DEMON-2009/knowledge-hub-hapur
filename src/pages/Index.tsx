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
import SEO from "@/components/SEO";

const libraryJsonLd = {
  "@context": "https://schema.org",
  "@type": "Library",
  "name": "Janhitkari Library",
  "description": "A completely free study library in Ramgarhi, Hapur offering peaceful study areas, free Wi-Fi, computer lab, printing services, and competitive exam preparation environment.",
  "url": "https://janhitkari-library-hapur.vercel.app/",
  "telephone": "+919917917437",
  "email": "bijanderk3@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Ramgarhi",
    "addressLocality": "Hapur",
    "addressRegion": "Uttar Pradesh",
    "addressCountry": "IN"
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    "opens": "06:00",
    "closes": "20:00"
  },
  "founder": { "@type": "Person", "name": "Bijander Kumar" },
  "isAccessibleForFree": true,
  "priceRange": "Free"
};

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Best Free Library in Hapur | Janhitkari Library Ramgarhi Uttar Pradesh"
        description="Janhitkari Library in Ramgarhi, Hapur is a completely free study library offering peaceful study areas, free Wi-Fi, computer lab, printing services, competitive exam preparation environment. Open daily 6 AM – 8 PM."
        path="/"
        jsonLd={libraryJsonLd}
      />
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
