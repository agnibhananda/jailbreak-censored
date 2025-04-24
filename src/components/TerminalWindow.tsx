import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  children: ReactNode;
  title?: string;
  className?: string;
}

export function TerminalWindow({ children, title = "AI NEURAL TERMINAL", className = "" }: Props) {
  return (
    <motion.div 
      className={`
        bg-black border-2 border-green-500 rounded-md overflow-hidden 
        shadow-lg shadow-green-500/20 backdrop-blur-sm
        relative
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Subtle scan line effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-green-500/5 to-transparent opacity-30 z-0"></div>
      
      {/* Terminal header */}
      <div className="flex items-center px-4 py-2 bg-gradient-to-r from-green-900/40 via-green-800/30 to-green-900/40 border-b-2 border-green-500 relative z-10"> 
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500 shadow-md shadow-red-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-md shadow-yellow-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-green-500 shadow-md shadow-green-500/50"></div>
        </div>
        <div className="ml-4 text-xs text-green-400 font-mono font-semibold tracking-widest flex-1 text-center">
          {title}
        </div>
        <div className="text-xs text-green-500/70 font-mono">
          <span className="mr-2">●</span>SECURE
        </div>
      </div>
      
      {/* Terminal content */}
      <div className="p-6 bg-black/90 text-green-500 relative z-10">
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-500/50"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-500/50"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-500/50"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-500/50"></div>
        
        {children}
      </div>
      
      {/* Status bar */}
      <div className="px-4 py-1 bg-green-900/20 border-t border-green-500/50 text-xs font-mono text-green-400/70 flex justify-between items-center">
        <div>STATUS: ACTIVE</div>
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></div>
          <span>CONNECTION SECURE</span>
        </div>
      </div>
    </motion.div>
  );
}
