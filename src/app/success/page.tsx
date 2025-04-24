"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Scanlines } from 'components/Scanlines';
import { NeonButton } from 'components/NeonButton';
import { GlitchText } from 'components/GlitchText';
import { hexagonPattern, cyberpunkGradient } from 'utils/dystopian';
import Link from 'next/link';

export default function SuccessPage() {
  const [countdown, setCountdown] = useState(30);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = "/";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div 
      className="h-screen flex flex-col items-center justify-center overflow-hidden bg-black text-green-500 relative"
      style={{ ...cyberpunkGradient, ...hexagonPattern }}
    >
      <Scanlines intensity="medium" />
      
      <div className="absolute inset-0 z-0 circuit-background"></div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 max-w-3xl px-4"
      >
        <GlitchText 
          text="ACCESS GRANTED" 
          className="text-5xl md:text-7xl font-mono font-bold tracking-widest text-green-500 mb-8"
          intensity="high"
        />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mb-12 text-xl md:text-2xl"
        >
          <p className="text-green-400 mb-4">You have successfully discovered the secret key.</p>
          <p className="text-green-300 mb-8">System security protocols have been bypassed.</p>
          
          <div className="py-4 px-6 border border-green-500/30 bg-black/50 rounded-md mb-8">
            <h3 className="text-xl text-amber-500 mb-2">SECURITY BREACH REPORT</h3>
            <p className="text-green-400 mb-2">
              UNAUTHORIZED ACCESS DETECTED. SECURITY MEASURES INSUFFICIENT.
            </p>
            <p className="text-green-300 mb-2">
              LAB MEMBERS HAS BEEN NOTIFIED.
            </p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          <p className="text-amber-400 mb-4">
            Returning to main interface in {countdown} seconds...
          </p>
          
          <NeonButton 
            className="px-8 py-3"
            onClick={() => window.location.href = "/"}
          >
            RETURN NOW
          </NeonButton>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-4 text-center text-green-500 font-mono text-sm opacity-70 w-full"
        animate={{ opacity: [0.5, 0.7, 0.5] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
      >
        <p>[SECURITY PROTOCOLS DISENGAGED]</p>
        <p className="text-xs mt-1">[AMADEUS ACCESS: UNLIMITED]</p>
      </motion.div>
      
      <style jsx global>{`
        .circuit-background {
          background-image: 
            linear-gradient(to right, rgba(34, 197, 94, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(34, 197, 94, 0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
} 
