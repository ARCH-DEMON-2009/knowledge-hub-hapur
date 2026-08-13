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
      <main className="pt-32 pb-12 bg-navy">
        <div className="container mx-auto px-4 text-center mb-8">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-cream mb-6">Library Code of Conduct</h1>
          <p className="font-body text-cream/80 text-lg max-w-2xl mx-auto">
            To ensure the best study experience for everyone, we ask all members to strictly follow these guidelines.
          </p>
        </div>
        <RulesSection />
        <div className="container mx-auto px-4 pb-24">
          <div className="max-w-4xl mx-auto glass-navy p-8 rounded-3xl border border-white/10">
            <h2 className="font-display text-2xl font-bold text-gold mb-6">Violation Policy</h2>
            <div className="space-y-4 font-body text-cream/80">
              <p>1. <strong>First Warning:</strong> Verbal notification of the rule violation.</p>
              <p>2. <strong>Second Warning:</strong> Temporary suspension of library access for 3 days.</p>
              <p>3. <strong>Serious Offenses:</strong> Direct permanent ban for activities including theft, damage to property, or harassment.</p>
            </div>
            <div className="mt-8 p-4 bg-gold/10 rounded-xl border border-gold/20 flex items-center gap-3">
              <span className="text-gold font-bold">Note:</span>
              <p className="text-xs text-cream/70 italic">Management reserves the right to modify rules or restrict entry to ensure the safety and focus of students.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Rules;
