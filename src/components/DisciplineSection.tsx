import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ClipboardList, Clock, Shield, TrendingUp } from "lucide-react";

const steps = [
  { icon: ClipboardList, title: "Sign the Register", desc: "Write your name, entry time upon arrival" },
  { icon: Clock, title: "Study with Focus", desc: "Utilize the peaceful, disciplined environment" },
  { icon: TrendingUp, title: "Track Your Progress", desc: "Building consistency through daily records" },
  { icon: Shield, title: "Log Your Exit", desc: "Note your departure time before leaving" },
];

const DisciplineSection = () => {
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
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.15 }}
              className="relative"
            >
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%-40px)] h-0.5 bg-gradient-to-r from-[hsl(var(--gold))] to-transparent" />
              )}
              <div className="glass rounded-2xl p-6 text-center shadow-soft hover:shadow-gold transition-shadow duration-300">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-navy flex items-center justify-center">
                  <step.icon className="w-6 h-6 text-gold-light" />
                </div>
                <span className="font-body text-xs text-gold-dark font-semibold">Step {i + 1}</span>
                <h3 className="font-display text-lg font-semibold text-navy mt-1 mb-2">{step.title}</h3>
                <p className="font-body text-sm text-muted-foreground">{step.desc}</p>
              </div>
            </motion.div>
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

export default DisciplineSection;
