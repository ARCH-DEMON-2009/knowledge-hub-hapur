import Navbar from "@/components/Navbar";
import FacilitiesSection from "@/components/FacilitiesSection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Facilities = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Facilities | Janhitkari Library Hapur — Free Wi-Fi, Computer Lab & More"
        description="Explore free facilities at Janhitkari Library: Wi-Fi, computer lab, printing, newspapers, CCTV security, comfortable seating, and a silent study environment."
        path="/facilities"
      />
      <Navbar />
      <div className="pt-20">
        <FacilitiesSection />
      </div>
      <Footer />
    </div>
  );
};

export default Facilities;
