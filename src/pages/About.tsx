import Navbar from "@/components/Navbar";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const About = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="About Janhitkari Library | Free Study Library in Hapur"
        description="Learn about Janhitkari Library in Ramgarhi, Hapur — founded by Bijander Kumar to provide free, disciplined education to every student."
        path="/about"
      />
      <Navbar />
      <div className="pt-20">
        <AboutSection />
      </div>
      <Footer />
    </div>
  );
};

export default About;
