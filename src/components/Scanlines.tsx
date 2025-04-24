import React from "react";

interface Props {
  className?: string;
  intensity?: "low" | "medium" | "high";
  animated?: boolean;
}

export function Scanlines({ 
  className = "", 
  intensity = "medium",
  animated = true 
}: Props) {
  // Intensity settings
  const intensitySettings = {
    low: { opacity: 0.08, size: "100% 3px" },
    medium: { opacity: 0.15, size: "100% 4px" },
    high: { opacity: 0.25, size: "100% 5px" }
  };
  
  const { opacity, size } = intensitySettings[intensity];
  
  return (
    <>
      {/* Static scanlines */}
      <div 
        className={`pointer-events-none fixed inset-0 z-10 overflow-hidden ${className}`}
        style={{
          background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)",
          backgroundSize: size,
          opacity: opacity,
        }}
      />
      
      {/* Moving scanline effect */}
      {animated && (
        <div 
          className="pointer-events-none fixed inset-0 z-20 overflow-hidden"
          style={{
            background: "linear-gradient(transparent 0%, rgba(34, 197, 94, 0.15) 50%, transparent 100%)",
            backgroundSize: "100% 10px",
            opacity: 0.3,
            animation: "scanline 8s linear infinite",
          }}
        />
      )}
      
      {/* CRT flicker effect */}
      <div 
        className="pointer-events-none fixed inset-0 z-10 overflow-hidden"
        style={{
          background: "rgba(0, 0, 0, 0.03)",
          opacity: 0.2,
          animation: "flicker 0.15s infinite",
          mixBlendMode: "overlay",
        }}
      />
      
      {/* Vignette effect */}
      <div 
        className="pointer-events-none fixed inset-0 z-5 overflow-hidden"
        style={{
          background: "radial-gradient(circle at center, transparent 60%, rgba(0, 0, 0, 0.8) 100%)",
          opacity: 0.4,
          mixBlendMode: "multiply",
        }}
      />
    </>
  );
}
