import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ClipboardList, Clock, Shield, TrendingUp } from "lucide-react";

const steps = [
  { icon: ClipboardList, title: "Sign the Register", desc: "Write your name, entry time upon arrival", color: "200 70% 50%" },
  { icon: Clock, title: "Study with Focus", desc: "Utilize the peaceful, disciplined environment", color: "160 60% 45%" },
  { icon: TrendingUp, title: "Track Your Progress", desc: "Building consistency through daily records", color: "45 80% 50%" },
  { icon: Shield, title: "Log Your Exit", desc: "Note your departure time before leaving", color: "260 60% 55%" },
];

const DisciplineSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-cream relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle,hsl(var(--gold)/0.06),transparent_70%)] blur-2xl" />

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-gold-dark font-body text-sm font-semibold tracking-wider uppercase mb-4 block">📝 Discipline System</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-navy mb-4">
            Entry & Exit Register
          </h2>
          <p className="font-body text-muted-foreground text-lg max-w-2xl mx-auto">
            All students must fill their entry and exit time in the register placed on the table. This simple system ensures transparency and responsibility.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <StepCard key={step.title} step={step} index={i} inView={inView} totalSteps={steps.length} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-10 font-display text-lg text-navy/70 italic"
        >
          "Discipline builds success — and we promote it every day."
        </motion.p>
      </div>
    </section>
  );
};

const StepCard = ({ step, index, inView, totalSteps }: { step: typeof steps[0]; index: number; inView: boolean; totalSteps: number }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: 0.15 + index * 0.12, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {index < totalSteps - 1 && (
        <div className="hidden lg:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%-40px)] h-0.5 bg-gradient-to-r from-[hsl(var(--gold))] to-transparent" />
      )}

      {/* Glow */}
      <motion.div
        animate={{ opacity: hovered ? 0.4 : 0, scale: hovered ? 1.05 : 0.95 }}
        transition={{ duration: 0.4 }}
        className="absolute -inset-1 rounded-2xl blur-xl"
        style={{ background: `hsl(${step.color} / 0.15)` }}
      />

      <div className="relative glass rounded-2xl p-6 text-center shadow-soft border border-transparent hover:border-[hsl(var(--gold)/0.25)] hover:shadow-gold transition-all duration-500 overflow-hidden h-full">
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--gold)/0.04)] to-transparent pointer-events-none"
        />

        <motion.div
          animate={{ scale: hovered ? 1.1 : 1, rotate: hovered ? 5 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="w-14 h-14 mx-auto mb-4 rounded-full bg-navy flex items-center justify-center relative z-10"
        >
          <step.icon className="w-6 h-6 text-gold-light" />
        </motion.div>

        <span className="font-body text-xs text-gold-dark font-semibold relative z-10">Step {index + 1}</span>
        <h3 className="font-display text-lg font-semibold text-navy mt-1 mb-2 relative z-10">{step.title}</h3>
        <p className="font-body text-sm text-muted-foreground relative z-10">{step.desc}</p>

        <motion.div
          animate={{ width: hovered ? 40 : 0, height: hovered ? 40 : 0, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="absolute bottom-0 left-0 rounded-tr-2xl"
          style={{ background: `hsl(${step.color} / 0.12)` }}
        />
      </div>
    </motion.div>
  );
};

export default DisciplineSection;
