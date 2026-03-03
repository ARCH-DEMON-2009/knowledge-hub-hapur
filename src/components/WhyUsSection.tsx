import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Trophy, Shield, Target, Heart, Sparkles } from "lucide-react";

const reasons = [
  { icon: Trophy, text: "Best Free Library in Hapur" },
  { icon: Shield, text: "Safe & Secure Study Environment" },
  { icon: Target, text: "Focused Competitive Exam Atmosphere" },
  { icon: Heart, text: "Community-Driven Initiative" },
  { icon: Sparkles, text: "Zero Fees, Maximum Support" },
];

const WhyUsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-cream relative">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-gold-dark font-body text-sm font-semibold tracking-wider uppercase mb-4 block">🏆 Why Students Choose Us</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-navy mb-4">
            More Than a Library
          </h2>
          <p className="font-body text-muted-foreground text-lg max-w-xl mx-auto">
            We are a movement for accessible education.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
          {reasons.map((r, i) => (
            <motion.div
              key={r.text}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="glass rounded-xl px-6 py-4 flex items-center gap-3 shadow-soft hover:shadow-gold transition-all duration-300"
            >
              <r.icon className="w-5 h-5 text-gold-dark shrink-0" />
              <span className="font-body font-medium text-navy">{r.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
