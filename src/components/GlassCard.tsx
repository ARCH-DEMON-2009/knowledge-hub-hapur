import { motion } from "framer-motion";

interface GlassCardProps {
  title: string;
  subtitle: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
}

const GlassCard = ({ title, subtitle, description, icon, className = "" }: GlassCardProps) => {
  return (
    <div className={`relative group ${className}`}>
      {/* Glowing Blobs */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-navy-light/30 rounded-full blur-3xl group-hover:bg-gold/20 transition-colors duration-700" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-navy-dark/40 rounded-full blur-3xl group-hover:bg-gold-dark/20 transition-colors duration-700" />
      
      {/* Main Glass Container */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="relative backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl overflow-hidden"
      >
        {/* Subtle inner glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        
        {icon && (
          <div className="mb-6 inline-flex items-center justify-center p-3 rounded-xl bg-white/10 border border-white/10 text-gold-light group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        )}
        
        <div className="relative z-10">
          <span className="text-slate-300 font-body text-xs font-semibold tracking-widest uppercase mb-2 block">
            {subtitle}
          </span>
          <h3 className="font-display text-2xl font-bold text-white mb-4 group-hover:text-gold-light transition-colors">
            {title}
          </h3>
          <p className="font-body text-slate-300/90 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Decorative corner element */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/10 to-transparent opacity-50 translate-x-12 -translate-y-12 rotate-45" />
      </motion.div>
    </div>
  );
};

export default GlassCard;
