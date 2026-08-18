import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import aboutBg from "@/assets/about-bg.jpg";

import GlassCard from "./GlassCard";
import { BookOpen, Clock, Calendar, IndianRupee } from "lucide-react";

const AboutSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Dynamic atmospheric layer */}
      <div className="absolute inset-0 bg-navy-dark pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[radial-gradient(circle,rgba(180,210,185,0.15),transparent_70%)] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[radial-gradient(circle,rgba(210,195,170,0.1),transparent_70%)] pointer-events-none" />

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent" />
      
      <div className="container mx-auto px-4" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-gold-dark font-body text-sm font-semibold tracking-wider uppercase mb-4 block">About Us</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              About Janhitkari Library
            </h2>
            <p className="font-body text-slate-300 text-lg mb-6 leading-relaxed">
              Founded by <strong className="text-gold-light">Bijander Kumar</strong>, Janhitkari Library was created with one mission: to provide a completely free and disciplined study environment for every student in Hapur. Located in Ramgarhi, Hapur, Uttar Pradesh, the library serves as a peaceful learning hub where students can focus, grow, and prepare for their future without financial burden.
            </p>
            <p className="font-body text-slate-300 mb-8 leading-relaxed">
              There are no membership fees. No hidden charges. Just pure dedication to education.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { number: "100%", label: "Free Access", icon: <BookOpen className="w-6 h-6" />, subtitle: "Mission" },
                { number: "6 AM – 8 PM", label: "Daily Hours", icon: <Clock className="w-6 h-6" />, subtitle: "Timing" },
                { number: "365", label: "Days Open", icon: <Calendar className="w-6 h-6" />, subtitle: "Availability" },
                { number: "0₹", label: "Membership Fee", icon: <IndianRupee className="w-6 h-6" />, subtitle: "Cost" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <GlassCard className="p-6">
                    <div className="flex flex-col items-start">
                      <div className="mb-4 p-3 rounded-xl bg-navy text-gold-light">
                        {stat.icon}
                      </div>
                      <span className="text-slate-300 font-body text-xs font-semibold tracking-widest uppercase mb-1 block">
                        {stat.subtitle}
                      </span>
                      <h3 className="font-display text-2xl font-bold text-white mb-2">
                        {stat.number}
                      </h3>
                      <p className="font-body text-slate-300/90 leading-relaxed text-sm">
                        {stat.label}
                      </p>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-navy">
              <img src={aboutBg} alt="Students studying at Janhitkari Library" className="w-full h-[500px] object-cover" loading="lazy" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-navy rounded-xl p-6 shadow-gold">
              <p className="font-display text-gold-light text-lg font-semibold">"Empowering Knowledge<br/>for Everyone"</p>
              <p className="font-body text-cream font-medium text-sm mt-2">Founder — By Bijander Kumar</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
