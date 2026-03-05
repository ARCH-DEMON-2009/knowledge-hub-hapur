import { motion } from "framer-motion";
import { MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";
import logo from "@/assets/logo.png";
import LiveStatusBadge from "@/components/LiveStatusBadge";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="Library interior with warm golden lighting" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(222,60%,8%,0.8)] via-[hsl(222,60%,12%,0.75)] to-[hsl(222,60%,8%,0.9)]" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[hsl(45,80%,55%,0.08)] rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[hsl(45,80%,55%,0.05)] rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 text-center py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img src={logo} alt="Janhitkari Library Emblem" className="w-24 h-24 mx-auto mb-6 drop-shadow-2xl" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-block mb-6 px-5 py-2 rounded-full border border-[hsl(45,80%,55%,0.4)] bg-[hsl(45,80%,55%,0.1)]"
        >
          <span className="text-gold-light font-body text-sm font-medium tracking-wider uppercase">
            100% Free for Everyone
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-cream mb-6 leading-tight"
        >
          The Best Free Study
          <br />
          <span className="text-gradient-gold">Library in Hapur</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-body text-lg md:text-xl text-cream/90 max-w-2xl mx-auto mb-4"
        >
          A peaceful, disciplined, and fully equipped study space in Ramgarhi — 100% free for every student.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-body text-base text-cream/75 max-w-xl mx-auto mb-10"
        >
          Whether you're preparing for competitive exams or building daily study discipline, Janhitkari Library provides the environment you need to succeed.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gold text-navy font-semibold font-body text-lg shadow-gold transition-all duration-300 hover:brightness-110 hover:scale-105"
          >
            <MapPin className="w-5 h-5" />
            Visit Today
          </Link>
          <a
            href="tel:9917917437"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-gold/50 text-gold-light font-semibold font-body text-lg transition-all duration-300 hover:bg-gold/10 hover:scale-105"
          >
            <Phone className="w-5 h-5" />
            Call Now – 9917917437
          </a>
        </motion.div>

        {/* Live status badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12"
        >
          <LiveStatusBadge />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
