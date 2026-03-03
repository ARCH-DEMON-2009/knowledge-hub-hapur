import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  BookOpen, Wifi, Monitor, Printer, Newspaper,
  Droplets, Shield, Armchair, Sun, Volume2, GraduationCap,
} from "lucide-react";

const facilities = [
  { icon: BookOpen, title: "Peaceful Study Areas", desc: "Quiet zones designed for deep focus and concentration" },
  { icon: GraduationCap, title: "Exam Preparation Space", desc: "Dedicated area for competitive exam preparation" },
  { icon: Wifi, title: "Free Wi-Fi", desc: "High-speed internet for research and online study" },
  { icon: Monitor, title: "Computer Lab", desc: "Computers available for digital learning" },
  { icon: Printer, title: "Printing Services", desc: "Print notes, assignments, and study materials" },
  { icon: Newspaper, title: "Newspapers & Magazines", desc: "Stay updated with current affairs daily" },
  { icon: Droplets, title: "Clean Drinking Water", desc: "Safe and purified water always available" },
  { icon: Shield, title: "CCTV Security", desc: "24/7 surveillance for a safe environment" },
  { icon: Armchair, title: "Comfortable Seating", desc: "Ergonomic chairs for long study sessions" },
  { icon: Sun, title: "Proper Lighting", desc: "Well-lit spaces to reduce eye strain" },
  { icon: Volume2, title: "Silent Environment", desc: "Strict no-noise policy for maximum focus" },
];

const FacilitiesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="facilities" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,hsl(var(--gold),0.04),transparent_50%)]" />
      
      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-gold-dark font-body text-sm font-semibold tracking-wider uppercase mb-4 block">💻 What We Offer</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-navy mb-4">
            Our Facilities
          </h2>
          <p className="font-body text-muted-foreground text-lg max-w-xl mx-auto">
            A professional environment designed for serious learners.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {facilities.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="glass rounded-xl p-5 flex items-start gap-4 shadow-soft hover:shadow-gold transition-all duration-300 group"
            >
              <div className="w-11 h-11 shrink-0 rounded-lg bg-navy flex items-center justify-center group-hover:bg-[hsl(var(--gold))] transition-colors duration-300">
                <f.icon className="w-5 h-5 text-gold-light group-hover:text-navy transition-colors duration-300" />
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-navy">{f.title}</h3>
                <p className="font-body text-sm text-muted-foreground mt-0.5">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FacilitiesSection;
