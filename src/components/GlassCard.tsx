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
    strong: "bg-white/90 border-white/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-[24px]",
    mid: "bg-white/80 border-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_24px_rgba(0,0,0,0.07)] backdrop-blur-[18px]",
    light: "bg-white/70 border-white/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_4px_12px_rgba(0,0,0,0.06)] backdrop-blur-[12px]"
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
