import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Heart, DollarSign, Clock, Users } from "lucide-react";

const items = [
  { icon: DollarSign, title: "No Registration Fees", desc: "Walk in freely without any sign-up or payment", color: "160 60% 45%" },
  { icon: Heart, title: "No Monthly Charges", desc: "Study as long and as often as you want — always free", color: "340 65% 55%" },
  { icon: Clock, title: "Open 6 AM – 8 PM", desc: "14 hours daily, every single day of the year", color: "200 70% 50%" },
  { icon: Users, title: "Equal Opportunity", desc: "Every student gets the same access, same respect", color: "45 80% 50%" },
];

const FreeSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-navy relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(45,80%,55%,0.06),transparent_60%)]" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,hsl(var(--gold)/0.04),transparent_70%)] blur-3xl" />
      
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
          <p className="font-body text-cream text-lg max-w-xl mx-auto opacity-90">
            We believe education should never be limited by money. Just walk in, follow the rules, and start studying.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <FreeCard key={item.title} item={item} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FreeCard = ({ item, index, inView }: { item: typeof items[0]; index: number; inView: boolean }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: 0.15 + index * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group"
    >
      {/* Glow */}
      <motion.div
        animate={{ opacity: hovered ? 0.4 : 0, scale: hovered ? 1.05 : 0.95 }}
        transition={{ duration: 0.4 }}
        className="absolute -inset-1 rounded-2xl blur-xl"
        style={{ background: `hsl(${item.color} / 0.2)` }}
      />

      <div className="relative glass-navy rounded-2xl p-6 text-center border border-transparent hover:border-[hsl(var(--gold)/0.3)] transition-all duration-500 overflow-hidden h-full">
        {/* Gradient overlay */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--gold)/0.06)] to-transparent pointer-events-none"
        />

        <motion.div
          animate={{ scale: hovered ? 1.15 : 1, rotate: hovered ? 8 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center relative z-10 transition-colors duration-500"
          style={{ background: hovered ? `hsl(${item.color} / 0.2)` : `hsl(45,80%,55%,0.1)` }}
        >
          <item.icon className="w-7 h-7 text-gold" />
        </motion.div>

        <h3 className="font-display text-lg font-semibold text-cream mb-2 relative z-10">{item.title}</h3>
        <p className="font-body text-cream text-sm opacity-80 relative z-10">{item.desc}</p>

        {/* Corner accent */}
        <motion.div
          animate={{ width: hovered ? 40 : 0, height: hovered ? 40 : 0, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="absolute top-0 right-0 rounded-bl-2xl"
          style={{ background: `hsl(${item.color} / 0.15)` }}
        />
      </div>
    </motion.div>
  );
};

export default FreeSection;
