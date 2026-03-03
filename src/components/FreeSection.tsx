import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Heart, DollarSign, Clock, Users } from "lucide-react";

const items = [
  { icon: DollarSign, title: "No Registration Fees", desc: "Walk in freely without any sign-up or payment" },
  { icon: Heart, title: "No Monthly Charges", desc: "Study as long and as often as you want — always free" },
  { icon: Clock, title: "Open 6 AM – 8 PM", desc: "14 hours daily, every single day of the year" },
  { icon: Users, title: "Equal Opportunity", desc: "Every student gets the same access, same respect" },
];

const FreeSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-navy relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(45,80%,55%,0.06),transparent_60%)]" />
      
      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-gold font-body text-sm font-semibold tracking-wider uppercase mb-4 block">🌟 Our Promise</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-cream mb-4">
            100% Free for <span className="text-gradient-gold">Everyone</span>
          </h2>
          <p className="font-body text-cream/60 text-lg max-w-xl mx-auto">
            We believe education should never be limited by money. Just walk in, follow the rules, and start studying.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="glass-navy rounded-2xl p-6 text-center group hover:border-[hsl(var(--gold),0.3)] transition-all duration-300"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[hsl(45,80%,55%,0.1)] flex items-center justify-center group-hover:bg-[hsl(45,80%,55%,0.2)] transition-colors">
                <item.icon className="w-7 h-7 text-gold" />
              </div>
              <h3 className="font-display text-lg font-semibold text-cream mb-2">{item.title}</h3>
              <p className="font-body text-cream/50 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FreeSection;
