import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  BookOpen, Wifi, Monitor, Printer, Newspaper,
  Droplets, Shield, Armchair, Sun, Volume2, GraduationCap,
} from "lucide-react";

const facilities = [
  { icon: BookOpen, title: "Peaceful Study Areas", desc: "Quiet zones designed for deep focus and concentration", color: "45 80% 50%" },
  { icon: GraduationCap, title: "Exam Preparation Space", desc: "Dedicated area for competitive exam preparation", color: "200 70% 50%" },
  { icon: Wifi, title: "Free Wi-Fi", desc: "High-speed internet for research and online study", color: "160 60% 45%" },
  { icon: Monitor, title: "Computer Lab", desc: "Computers available for digital learning", color: "260 60% 55%" },
  { icon: Printer, title: "Printing Services", desc: "Print notes, assignments, and study materials", color: "340 65% 55%" },
  { icon: Newspaper, title: "Newspapers & Magazines", desc: "Stay updated with current affairs daily", color: "25 80% 50%" },
  { icon: Droplets, title: "Clean Drinking Water", desc: "Safe and purified water always available", color: "195 80% 50%" },
  { icon: Shield, title: "CCTV Security", desc: "24/7 surveillance for a safe environment", color: "0 65% 55%" },
  { icon: Armchair, title: "Comfortable Seating", desc: "Ergonomic chairs for long study sessions", color: "280 50% 55%" },
  { icon: Sun, title: "Proper Lighting", desc: "Well-lit spaces to reduce eye strain", color: "50 85% 50%" },
  { icon: Volume2, title: "Silent Environment", desc: "Strict no-noise policy for maximum focus", color: "170 55% 45%" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.08 * i,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const FacilitiesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="facilities" className="py-24 bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,hsl(var(--gold)/0.06),transparent_70%)] blur-2xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[radial-gradient(circle,hsl(var(--navy)/0.04),transparent_70%)] blur-2xl" />

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold-dark font-body text-sm font-semibold tracking-wider uppercase mb-4 block">💻 What We Offer</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Our Facilities
          </h2>
          <p className="font-body text-muted-foreground text-lg max-w-xl mx-auto">
            A professional environment designed for serious learners.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {facilities.map((f, i) => (
            <FacilityCard key={f.title} facility={f} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FacilityCard = ({
  facility,
  index,
  inView,
}: {
  facility: (typeof facilities)[0];
  index: number;
  inView: boolean;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group cursor-default"
    >
      {/* Glow effect behind card */}
      <motion.div
        animate={{
          opacity: hovered ? 0.5 : 0,
          scale: hovered ? 1.05 : 0.95,
        }}
        transition={{ duration: 0.4 }}
        className="absolute -inset-1 rounded-2xl blur-xl"
        style={{ background: `hsl(${facility.color} / 0.15)` }}
      />

      <div className="relative glass rounded-2xl p-6 flex items-start gap-4 shadow-soft border border-transparent hover:border-[hsl(var(--gold)/0.25)] transition-all duration-500 overflow-hidden h-full">
        {/* Subtle gradient overlay on hover */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--gold)/0.04)] to-transparent pointer-events-none"
        />

        {/* Icon */}
        <motion.div
          animate={{
            scale: hovered ? 1.1 : 1,
            rotate: hovered ? 5 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="w-12 h-12 shrink-0 rounded-xl flex items-center justify-center relative z-10 transition-colors duration-500"
          style={{
            background: hovered
              ? `hsl(${facility.color} / 0.2)`
              : `hsl(var(--navy))`,
          }}
        >
          <facility.icon
            className="w-6 h-6 transition-colors duration-500"
            style={{
              color: hovered
                ? `hsl(${facility.color})`
                : `hsl(var(--gold-light))`,
            }}
          />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 flex-1 min-w-0">
          <h3 className="font-display text-base font-semibold text-foreground mb-1 group-hover:text-navy transition-colors duration-300">
            {facility.title}
          </h3>
          <p className="font-body text-sm text-muted-foreground leading-relaxed">
            {facility.desc}
          </p>
        </div>

        {/* Corner accent */}
        <motion.div
          animate={{
            width: hovered ? 40 : 0,
            height: hovered ? 40 : 0,
            opacity: hovered ? 1 : 0,
          }}
          transition={{ duration: 0.4 }}
          className="absolute top-0 right-0 rounded-bl-2xl"
          style={{ background: `hsl(${facility.color} / 0.12)` }}
        />
      </div>
    </motion.div>
  );
};

export default FacilitiesSection;
