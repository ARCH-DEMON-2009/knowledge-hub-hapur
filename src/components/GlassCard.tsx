import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "strong" | "mid" | "light";
  hoverable?: boolean;
}

const GlassCard = ({ 
  children, 
  className = "", 
  variant = "mid",
  hoverable = true 
}: GlassCardProps) => {
  const opacities = {
    strong: "bg-white/50 border-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-[20px]",
    mid: "bg-white/35 border-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.05)] backdrop-blur-[16px]",
    light: "bg-white/25 border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_4px_12px_rgba(0,0,0,0.04)] backdrop-blur-[10px]"
  };

  return (
    <motion.div
      whileHover={hoverable ? { y: -4, transition: { duration: 0.2 } } : {}}
      className={`relative rounded-2xl border ${opacities[variant]} ${className} overflow-hidden`}
    >
      {/* Subtle inner glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      <div className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
};

export default GlassCard;
