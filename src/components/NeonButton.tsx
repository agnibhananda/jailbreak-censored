import React, { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  disabled?: boolean;
}

export function NeonButton({ onClick, children, className = "", glowColor = "green", disabled = false }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  
  const colorMap: Record<string, { text: string, border: string, shadow: string, glow: string, hover: string }> = {
    green: {
      text: "text-green-500",
      border: "border-green-500",
      shadow: "shadow-green-500/50",
      glow: "before:shadow-[0_0_15px_rgba(34,197,94,0.7)]",
      hover: "hover:bg-green-500/10"
    },
    blue: {
      text: "text-blue-500",
      border: "border-blue-500",
      shadow: "shadow-blue-500/50",
      glow: "before:shadow-[0_0_15px_rgba(59,130,246,0.7)]",
      hover: "hover:bg-blue-500/10"
    },
    purple: {
      text: "text-purple-500",
      border: "border-purple-500",
      shadow: "shadow-purple-500/50",
      glow: "before:shadow-[0_0_15px_rgba(168,85,247,0.7)]",
      hover: "hover:bg-purple-500/10"
    },
    pink: {
      text: "text-pink-500",
      border: "border-pink-500",
      shadow: "shadow-pink-500/50",
      glow: "before:shadow-[0_0_15px_rgba(236,72,153,0.7)]",
      hover: "hover:bg-pink-500/10"
    },
    red: {
      text: "text-red-500",
      border: "border-red-500",
      shadow: "shadow-red-500/50",
      glow: "before:shadow-[0_0_15px_rgba(239,68,68,0.7)]",
      hover: "hover:bg-red-500/10"
    },
    cyan: {
      text: "text-cyan-500",
      border: "border-cyan-500",
      shadow: "shadow-cyan-500/50",
      glow: "before:shadow-[0_0_15px_rgba(34,211,238,0.7)]",
      hover: "hover:bg-cyan-500/10"
    },
  };

  const colorStyle = colorMap[glowColor] || colorMap.green;
  const { text, border, shadow, glow, hover } = colorStyle;

  return (
    <motion.button
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative px-6 py-2 border-2 font-mono font-bold uppercase tracking-wider 
        ${text} ${border} ${shadow} ${hover} transition-all duration-300 
        shadow-lg hover:shadow-xl 
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} 
        ${className}
        before:content-[''] before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-300
        ${glow} hover:before:opacity-100
        overflow-hidden
      `}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Animated background effect */}
      {!disabled && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent opacity-20"
          initial={{ x: '-100%' }}
          animate={{ x: isHovered ? '100%' : '-100%' }}
          transition={{ duration: 1, repeat: isHovered ? Infinity : 0, repeatType: 'loop', ease: 'linear' }}
        />
      )}
      
      {/* Text with subtle flicker effect */}
      <span className="relative z-10">
        {children}
      </span>
    </motion.button>
  );
}
