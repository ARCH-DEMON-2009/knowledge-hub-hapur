import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Clock, Volume2, BookOpen } from "lucide-react";

const rules = [
  { icon: Clock, title: "Timing", desc: "Open daily from 6:00 AM to 8:00 PM. Please arrive and leave on time." },
  { icon: Volume2, title: "Silence", desc: "Maintain complete silence in reading areas. Use of phones on silent mode only." },
  { icon: BookOpen, title: "Book Care", desc: "Handle all books with care and responsibility. Return them to their proper place." },
];

const RulesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="rules" className="py-24 bg-navy relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(45,80%,55%,0.04),transparent_70%)]" />
      
      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-gold font-body text-sm font-semibold tracking-wider uppercase mb-4 block">📜 Guidelines</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-cream mb-4">
            Library Rules
          </h2>
          <p className="font-body text-cream text-lg opacity-85">A disciplined environment benefits everyone.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {rules.map((rule, i) => (
            <motion.div
              key={rule.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.15 }}
              className="glass-navy rounded-2xl p-8 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[hsl(45,80%,55%,0.1)] flex items-center justify-center">
                <rule.icon className="w-8 h-8 text-gold" />
              </div>
              <h3 className="font-display text-xl font-semibold text-cream mb-3">{rule.title}</h3>
              <p className="font-body text-cream text-sm leading-relaxed opacity-85">{rule.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RulesSection;
