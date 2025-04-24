import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Props {
  text: string;
  typingSpeed?: number;
  onComplete?: () => void;
  className?: string;
  blinkCursor?: boolean;
}

export function Terminal({ 
  text, 
  typingSpeed = 40, 
  onComplete, 
  className = "",
  blinkCursor = true
}: Props) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Typing effect with random pauses for realism
  useEffect(() => {
    if (currentIndex < text.length) {
      // Add random pauses at punctuation for more realistic typing
      const shouldPause = 
        text[currentIndex] === '.' || 
        text[currentIndex] === '\n' || 
        text[currentIndex] === '>' ||
        text[currentIndex] === '?';
      
      const randomVariation = Math.random() * 30; // Add some randomness to typing speed
      const pauseDuration = shouldPause ? 300 + Math.random() * 200 : 0;
      
      if (isPaused) {
        const pauseTimeout = setTimeout(() => {
          setIsPaused(false);
        }, pauseDuration);
        
        return () => clearTimeout(pauseTimeout);
      }
      
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
        
        if (shouldPause) {
          setIsPaused(true);
        }
      }, typingSpeed + randomVariation);
      
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      // Small delay before calling onComplete
      const completeTimeout = setTimeout(() => {
        onComplete();
      }, 500);
      
      return () => clearTimeout(completeTimeout);
    }
  }, [currentIndex, text, typingSpeed, onComplete, isPaused]);

  // Blinking cursor effect
  useEffect(() => {
    if (!blinkCursor) return;
    
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);
    
    return () => clearInterval(cursorInterval);
  }, [blinkCursor]);

  // Process text to add line breaks and styling
  const formattedText = displayedText.split('\n').map((line, index) => {
    // Add special styling to command lines (starting with >)
    if (line.startsWith('>')) {
      return (
        <div key={index} className="text-green-400 font-bold my-1">
          {line}
        </div>
      );
    }
    return <div key={index} className="my-1">{line}</div>;
  });

  return (
    <div className={`font-mono ${className}`}> 
      <div className="terminal-text">
        {formattedText}
      </div>
      <span 
        className={`
          ${cursorVisible ? 'opacity-100' : 'opacity-0'} 
          transition-opacity duration-100 text-green-400 font-bold
        `}
      >
        _
      </span>
    </div>
  );
}
