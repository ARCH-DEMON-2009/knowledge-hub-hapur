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
      <main className="pt-32 pb-12">
        <div className="container mx-auto px-4 text-center mb-8">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-navy mb-6">World-Class Facilities</h1>
          <p className="font-body text-muted-foreground text-lg max-w-2xl mx-auto">
            Free high-quality resources for every student in Hapur.
          </p>
        </div>
        <FacilitiesSection />
        <div className="container mx-auto px-4 pb-24">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-3xl border border-white/40 shadow-soft">
              <h2 className="font-display text-2xl font-bold text-navy mb-4">Upcoming Additions</h2>
              <ul className="space-y-3 font-body text-muted-foreground">
                <li className="flex items-center gap-2">• Digital Archive Access</li>
                <li className="flex items-center gap-2">• Group Discussion Room</li>
                <li className="flex items-center gap-2">• Career Counseling Sessions</li>
              </ul>
            </div>
            <div className="glass p-8 rounded-3xl border border-white/40 shadow-soft bg-navy/5">
              <h2 className="font-display text-2xl font-bold text-navy mb-4">Request a Facility</h2>
              <p className="font-body text-muted-foreground mb-4">
                Missing something? We are always looking to improve our space for students.
              </p>
              <a href="tel:9917917437" className="inline-flex items-center gap-2 text-navy font-bold hover:text-gold-dark transition-colors">
                Contact Founder →
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Facilities;
