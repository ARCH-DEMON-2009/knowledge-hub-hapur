import Navbar from "@/components/Navbar";
import RulesSection from "@/components/RulesSection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Rules = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Library Rules | Janhitkari Library Hapur"
        description="Read the rules and guidelines for using Janhitkari Library in Hapur. Maintain discipline, silence, and respect for a productive study environment."
        path="/rules"
      />
      <Navbar />
      <div className="pt-20">
        <RulesSection />
      </div>
      <Footer />
    </div>
  );
};

export default Rules;
