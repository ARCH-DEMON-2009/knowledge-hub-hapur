import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { Clock, Calendar, MapPin, Phone } from "lucide-react";

const OpeningHours = () => {
  const schedule = [
    { day: "Monday", hours: "6:00 AM - 8:00 PM", status: "Open" },
    { day: "Tuesday", hours: "6:00 AM - 8:00 PM", status: "Open" },
    { day: "Wednesday", hours: "6:00 AM - 8:00 PM", status: "Open" },
    { day: "Thursday", hours: "6:00 AM - 8:00 PM", status: "Open" },
    { day: "Friday", hours: "6:00 AM - 8:00 PM", status: "Open" },
    { day: "Saturday", hours: "6:00 AM - 8:00 PM", status: "Open" },
    { day: "Sunday", hours: "6:00 AM - 8:00 PM", status: "Open" },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <SEO
        title="Opening Hours | Janhitkari Library Hapur — Open Daily 6 AM - 8 PM"
        description="Check Janhitkari Library opening hours. We are open every day of the week, including Sundays, from 6:00 AM to 8:00 PM for dedicated study."
        path="/hours"
      />
      <Navbar />
      
      <main className="pt-32 pb-24 container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-16">
            <span className="text-gold-dark font-body text-sm font-semibold tracking-wider uppercase mb-4 block">Schedule</span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-navy mb-6">Opening Hours</h1>
            <p className="font-body text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              We are committed to providing maximum study time. Our library remains open 14 hours a day, 7 days a week.
            </p>
          </div>

          <div className="glass rounded-3xl overflow-hidden shadow-soft border border-white/40">
            <div className="bg-navy p-8 text-cream flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <Clock className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold">Standard Timing</h2>
                  <p className="text-sm opacity-80">6:00 AM to 8:00 PM IST</p>
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-xs font-bold uppercase tracking-widest border border-green-500/30">
                  Open Now
                </span>
              </div>
            </div>

            <div className="p-4 sm:p-8">
              <div className="space-y-2">
                {schedule.map((item, idx) => (
                  <div 
                    key={item.day}
                    className={`flex items-center justify-between p-4 rounded-xl transition-colors ${idx % 2 === 0 ? 'bg-navy/5' : 'bg-transparent'}`}
                  >
                    <span className="font-display font-bold text-navy">{item.day}</span>
                    <div className="flex items-center gap-8">
                      <span className="font-body text-muted-foreground">{item.hours}</span>
                      <span className="w-16 text-right text-xs font-bold text-green-600 uppercase tracking-tighter">{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="glass p-8 rounded-2xl border border-white/40 shadow-soft">
              <h3 className="font-display text-xl font-bold text-navy mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gold-dark" /> Holiday Policy
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                We rarely close. Any special closures due to festivals or maintenance will be announced at least 48 hours in advance via our <a href="/" className="text-navy font-bold underline decoration-gold">homepage banner</a>.
              </p>
            </div>
            <div className="glass p-8 rounded-2xl border border-white/40 shadow-soft">
              <h3 className="font-display text-xl font-bold text-navy mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gold-dark" /> Location Access
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Located in Ramgarhi, Hapur. Students can access the library during all operational hours. For directions, call <a href="tel:9917917437" className="text-navy font-bold">9917917437</a>.
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default OpeningHours;