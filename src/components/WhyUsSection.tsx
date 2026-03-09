import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Trophy, Shield, Target, Heart, Sparkles } from "lucide-react";

const reasons = [
  { icon: Trophy, text: "Best Free Library in Hapur", color: "45 80% 50%" },
  { icon: Shield, text: "Safe & Secure Study Environment", color: "200 70% 50%" },
  { icon: Target, text: "Focused Competitive Exam Atmosphere", color: "0 65% 55%" },
  { icon: Heart, text: "Community-Driven Initiative", color: "340 65% 55%" },
  { icon: Sparkles, text: "Zero Fees, Maximum Support", color: "160 60% 45%" },
];

const WhyUsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-cream relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[radial-gradient(circle,hsl(var(--navy)/0.04),transparent_70%)] blur-2xl" />

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
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
            <WhyCard key={r.text} reason={r} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
};

const WhyCard = ({ reason, index, inView }: { reason: typeof reasons[0]; index: number; inView: boolean }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ delay: 0.15 + index * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group"
    >
      <motion.div
        animate={{ opacity: hovered ? 0.4 : 0, scale: hovered ? 1.05 : 0.95 }}
        transition={{ duration: 0.4 }}
        className="absolute -inset-1 rounded-xl blur-lg"
        style={{ background: `hsl(${reason.color} / 0.2)` }}
      />

      <div className="relative glass rounded-xl px-6 py-4 flex items-center gap-3 shadow-soft border border-transparent hover:border-[hsl(var(--gold)/0.25)] hover:shadow-gold transition-all duration-500 overflow-hidden">
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--gold)/0.04)] to-transparent pointer-events-none"
        />

        <motion.div
          animate={{ scale: hovered ? 1.2 : 1, rotate: hovered ? 10 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="relative z-10"
        >
          <reason.icon className="w-5 h-5 text-gold-dark shrink-0" />
        </motion.div>
        <span className="font-body font-medium text-navy relative z-10">{reason.text}</span>
      </div>
    </motion.div>
  );
};

export default WhyUsSection;
