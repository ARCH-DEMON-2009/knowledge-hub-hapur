import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Contact = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Contact Janhitkari Library | Hapur, Uttar Pradesh"
        description="Get in touch with Janhitkari Library in Ramgarhi, Hapur. Call 9917917437 or email bijanderk3@gmail.com. Open daily 6 AM – 8 PM."
        path="/contact"
      />
      <Navbar />
      <div className="pt-20">
        <ContactSection />
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
