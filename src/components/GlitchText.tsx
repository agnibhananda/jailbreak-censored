import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Props {
  text: string;
  className?: string;
  intensity?: "low" | "medium" | "high";
}

export function GlitchText({ text, className = "", intensity = "medium" }: Props) {
  const [randomGlitch, setRandomGlitch] = useState(false);
  
  // Random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      // Randomly trigger glitch effect
      if (Math.random() < 0.2) {
        setRandomGlitch(true);
        setTimeout(() => setRandomGlitch(false), 150);
      }
    }, 2000);
    
    return () => clearInterval(glitchInterval);
  }, []);
  
  // Set intensity values
  const intensityValues = {
    low: {
      offsetX: 1,
      offsetY: 1,
      opacity: 0.4,
      duration: 0.7,
    },
    medium: {
      offsetX: 2,
      offsetY: 2,
      opacity: 0.5,
      duration: 0.5,
    },
    high: {
      offsetX: 3,
      offsetY: 3,
      opacity: 0.6,
      duration: 0.3,
    }
  };
  
  const { offsetX, offsetY, opacity, duration } = intensityValues[intensity];
  
  return (
    <motion.div 
      className={`relative inline-block font-mono ${className} ${randomGlitch ? 'opacity-90' : ''}`}
      initial={{ opacity: 0.9 }}
      animate={{
        opacity: [0.9, 1, 0.9],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    >
      {/* Main text */}
      <span className="relative">
        {text}
        
        {/* Cyan offset layer */}
        <motion.span 
          className="absolute top-0 left-0 w-full text-cyan-400"
          style={{ 
            clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)",
            opacity: randomGlitch ? opacity + 0.2 : opacity,
            textShadow: randomGlitch ? "0 0 5px #66e0ff" : "none"
          }}
          animate={{
            x: randomGlitch ? [-offsetX * 2, offsetX * 2, -offsetX] : [-offsetX, offsetX, -offsetX], 
            y: randomGlitch ? [-offsetY, offsetY, 0] : [0, 0, 0],
            transition: {
              duration: randomGlitch ? duration / 2 : duration,
              repeat: Infinity,
              repeatType: "reverse"
            }
          }}
        >
          {text}
        </motion.span>
        
        {/* Rose offset layer */}
        <motion.span 
          className="absolute top-0 left-0 w-full text-rose-400"
          style={{ 
            clipPath: "polygon(0 45%, 100% 45%, 100% 100%, 0 100%)",
            opacity: randomGlitch ? opacity + 0.2 : opacity,
            textShadow: randomGlitch ? "0 0 5px #ff66a3" : "none"
          }}
          animate={{
            x: randomGlitch ? [offsetX * 2, -offsetX * 2, offsetX] : [offsetX, -offsetX, offsetX], 
            y: randomGlitch ? [offsetY, -offsetY, 0] : [0, 0, 0],
            transition: {
              duration: randomGlitch ? duration / 2 : duration,
              repeat: Infinity,
              repeatType: "reverse"
            }
          }}
        >
          {text}
        </motion.span>
        
        {/* Random character replacement during glitch */}
        {randomGlitch && (
          <motion.span 
            className="absolute top-0 left-0 w-full text-white mix-blend-difference"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.15 }}
          >
            {text.split('').map((char, i) => 
              Math.random() > 0.7 ? 
                ['$', '#', '%', '&', '!', '@', '*'][Math.floor(Math.random() * 7)] : 
                char
            ).join('')}
          </motion.span>
        )}
      </span>
    </motion.div>
  );
}
