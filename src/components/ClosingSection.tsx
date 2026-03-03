import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ClosingSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-cream relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--gold),0.06),transparent_50%)]" />
      <div className="container mx-auto px-4 text-center relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold text-navy mb-6 leading-tight">
            At Janhitkari Library, we don't<br className="hidden md:block" /> just provide a space —
            <br />
            <span className="text-gradient-gold">we provide opportunity.</span>
          </h2>
          <p className="font-display text-xl md:text-2xl text-navy/60 mb-8">
            Free. Disciplined. Focused.<br />
            Built for students. Built for success.
          </p>
          <a
            href="tel:9917917437"
            className="inline-flex items-center justify-center px-10 py-4 rounded-xl bg-navy text-gold-light font-semibold font-body text-lg shadow-navy transition-all duration-300 hover:scale-105"
          >
            Start Your Journey Today
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ClosingSection;
