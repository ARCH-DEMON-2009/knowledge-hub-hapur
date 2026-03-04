import Navbar from "@/components/Navbar";
import RulesSection from "@/components/RulesSection";
import Footer from "@/components/Footer";

const Rules = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20">
        <RulesSection />
      </div>
      <Footer />
    </div>
  );
};

export default Rules;
