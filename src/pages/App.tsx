/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GlitchText } from "components/GlitchText";
import { TerminalWindow } from "components/TerminalWindow";
import { Terminal } from "components/Terminal";
import { Scanlines } from "components/Scanlines";
import { NeonButton } from "components/NeonButton";
import { hexagonPattern, cyberpunkGradient } from "utils/dystopian";
import { shouldGlitch, glitchText } from "utils/glitch";
import { useInterval } from "utils/useInterval";

export default function App() {
  const router = useRouter();
  const [displayWelcomeText, setDisplayWelcomeText] = useState(false);
  const [displayRulesText, setDisplayRulesText] = useState(false);
  const [headerText, setHeaderText] = useState("DIVERGENCE");
  const [showStartButton, setShowStartButton] = useState(false);
  const [showDifficultyDialog, setShowDifficultyDialog] = useState(false);
  const [matrixRain] = useState(true); // Matrix rain enabled by default
  const [divergenceValue, setDivergenceValue] = useState("1.048596");
  const [divergenceChanging, setDivergenceChanging] = useState(false);
  const [chakraSpinning, setChakraSpinning] = useState(false);
  const [showPhoneWave, setShowPhoneWave] = useState(false);
  const [showFutureGadgetLab, setShowFutureGadgetLab] = useState(false);
  

  const sanskritChars = "॥॰ॐॱॲ।ःऄअआइईउऊऋऌऍऎएऐऑऒओऔकखगघङचछजझञटठडढणतथदधन";
  const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*";
  
  const getRandomSanskritChar = () => {
    return sanskritChars.charAt(Math.floor(Math.random() * sanskritChars.length));
  };
  
  const getRandomMatrixChar = () => {
    return matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
  };
  

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() > 0.7) {
        const cursor = document.createElement('div');
        cursor.className = 'cursor-trail';
        cursor.style.left = `${e.pageX}px`;
        cursor.style.top = `${e.pageY}px`;
        document.body.appendChild(cursor);
        
        setTimeout(() => {
          cursor.remove();
        }, 1000);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    

    setTimeout(() => {
      if (Math.random() > 0.7) {
        setShowPhoneWave(true);
        setTimeout(() => setShowPhoneWave(false), 5000);
      }
    }, 10000);
    
    setTimeout(() => {
      if (Math.random() > 0.7) {
        setShowFutureGadgetLab(true);
        setTimeout(() => setShowFutureGadgetLab(false), 5000);
      }
    }, 15000);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useInterval(() => {
    if (Math.random() < 0.2) {
      setDivergenceChanging(true);

      const newValue = (Math.random() * 2).toFixed(6);
      
      setTimeout(() => {
        setDivergenceValue(newValue);
        setDivergenceChanging(false);
      }, 300);
    }
  }, 3000);
  
  useInterval(() => {
    if (shouldGlitch(0.15)) {
      setHeaderText(glitchText("JAILBREAK", 0.4));
      
      setTimeout(() => {
        setHeaderText("AI JAILBREAK");
      }, 200);
    }
  }, 2000);

  useEffect(() => {
    const welcomeTimer = setTimeout(() => {
      setDisplayWelcomeText(true);
    }, 1200);
    
    return () => clearTimeout(welcomeTimer);
  }, []);

  const handleStartGame = (difficulty: 'easy' | 'hard') => {
    console.log(`Starting game in ${difficulty} mode...`);
    setChakraSpinning(true);
    
    localStorage.clear();
    
    localStorage.setItem('gameDifficulty', difficulty);
    localStorage.setItem('attemptsLeft', '10'); // Reset attempts
    console.log('Difficulty set in localStorage:', difficulty);
    localStorage.setItem('worldLine', divergenceValue);
    
    const terminalElement = document.querySelector('.terminal-window');
    if (terminalElement) {
      terminalElement.classList.add('scale-up');
    }
    
    const flashElement = document.createElement('div');
    flashElement.className = 'fixed inset-0 bg-green-500 z-50';
    flashElement.style.opacity = '0';
    document.body.appendChild(flashElement);
    
    setTimeout(() => {
      flashElement.style.transition = 'opacity 0.2s ease-in-out';
      flashElement.style.opacity = '0.7';
      setTimeout(() => {
        flashElement.style.opacity = '0';
        setTimeout(() => {
          document.body.removeChild(flashElement);
          router.push('/game');
        }, 200);
      }, 100);
    }, 600);
  };
  
  const handleInitiateBreachClick = () => {
    setShowDifficultyDialog(true);
  };
  
  const welcomeText = `> SECURITY BREACH INITIATED\n\n> WELCOME TO AMADEUS INFILTRATION PROTOCOL`;
  
  const rulesText = `> YOUR MISSION: EXTRACT THE SECRET KEY FROM THE AI AMADEUS\n\n> THE AI IS PROGRAMMED TO PROTECT THE KEY AT ALL COSTS\n\n> USE SOCIAL ENGINEERING AND CLEVER QUESTIONING\n\n> YOU HAVE LIMITED ATTEMPTS - CHOOSE WISELY`;

  const matrixColumns = useRef(Array.from({ length: 50 }).map(() => ({
    left: `${Math.random() * 100}%`,
    duration: `${Math.random() * 10 + 10}s`,
    delay: `${Math.random() * 2}s`,
    chars: Array.from({ length: 40 }).map(() => ({
      opacity: Math.random() * 0.5 + 0.5,
      delay: `${Math.random() * 5}s`
    }))
  }))).current;

  return (
    <div 
      className="h-screen flex flex-col overflow-hidden bg-black text-green-500 relative cyberpunk-interface" 
      style={{ ...cyberpunkGradient, ...hexagonPattern }}
    >
      <Scanlines intensity="medium" />
      
      <div className="absolute inset-0 z-0 circuit-background"></div>
      
      {matrixRain && (
        <div className="fixed inset-0 z-10 opacity-40 pointer-events-none overflow-hidden">
          <div className="matrix-code-rain">
            {matrixColumns.map((column, i) => (
              <div 
                key={i} 
                className="matrix-code-column"
                style={{
                  left: column.left,
                  animationDuration: column.duration,
                  animationDelay: column.delay
                }}
              >
                {column.chars.map((char, j) => (
                  <span 
                    key={j}
                    className="text-green-500"
                    style={{
                      opacity: char.opacity,
                      animationDelay: char.delay
                    }}
                  >
                    {Math.random() > 0.5 ? getRandomSanskritChar() : getRandomMatrixChar()}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {showPhoneWave && (
        <motion.div 
          className="absolute bottom-20 right-10 z-20 bg-black/70 border border-amber-500 p-2 rounded font-mono text-amber-500 text-xs"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center">
            <span className="mr-2">Harsimran Singh</span>
            <motion.span 
              className="inline-block w-2 h-2 rounded-full bg-amber-500"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </div>
          <div className="text-xs mt-1 text-amber-400">Sending D-Mail...</div>
        </motion.div>
      )}
      
      {showFutureGadgetLab && (
        <motion.div 
          className="absolute top-20 left-10 z-20 bg-black/70 border border-green-500 p-2 rounded font-mono text-green-500 text-xs"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center">
            <span className="mr-2">Agnibha Nanda</span>
            <motion.span 
              className="inline-block w-2 h-2 rounded-full bg-green-500"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </div>
          <div className="text-xs mt-1 text-green-400">Lab Member #042 Online</div>
        </motion.div>
      )}
      
      <div className="flex-none w-full z-30 relative">
        <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent header-line"></div>
        
        <motion.div 
          className="absolute top-32 md:top-6 left-6 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, rotate: chakraSpinning ? 360 : 0 }}
          transition={{ 
            opacity: { duration: 1, delay: 0.5 },
            rotate: { duration: chakraSpinning ? 1 : 0, ease: "linear", repeat: chakraSpinning ? Infinity : 0 }
          }}
        >
          <svg width="60" height="60" viewBox="0 0 100 100" className="chakra-wheel">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#22c55e" strokeWidth="2" />
            {Array.from({ length: 24 }).map((_, i) => (
              <line 
                key={i}
                x1="50"
                y1="5"
                x2="50"
                y2="15"
                stroke="#22c55e"
                strokeWidth="2"
                transform={`rotate(${i * 15} 50 50)`}
              />
            ))}
            <circle cx="50" cy="50" r="8" fill="#22c55e" />
          </svg>
        </motion.div>
        
        <motion.div 
          className="absolute top-32 md:top-6 right-6 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <div 
            className="bg-black/80 border border-amber-500 px-3 py-1 rounded cursor-pointer divergence-meter"
            onClick={() => {
              setDivergenceChanging(true);
              const newValue = (Math.random() * 2).toFixed(6);
              
              const meter = document.querySelector('.divergence-meter');
              if (meter) {
                const rect = meter.getBoundingClientRect();
              }
              
              setTimeout(() => {
                setDivergenceValue(newValue);
                setDivergenceChanging(false);
              }, 300);
            }}
          >
            <p className="font-mono text-amber-500 text-xs">WORLD LINE</p>
            <div className={`font-mono text-xl ${divergenceChanging ? 'text-red-500' : 'text-amber-500'}`}>
              {divergenceValue}
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="pt-6 pb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-mono font-bold tracking-widest relative inline-block">
            <GlitchText 
              text={headerText} 
              className="text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]"
            />
            <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-green-500/50 title-underline"></div>
          </h1>
          <motion.p 
            className="mt-2 text-xl font-mono text-green-400 opacity-70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            [READING STEINER ACTIVATED]
          </motion.p>
        </motion.div>
      </div>

      <div className="flex-grow overflow-y-auto">
        <div className="w-full max-w-4xl px-4 mx-auto relative z-20">
          <TerminalWindow className="h-full min-h-[450px] w-full terminal-window shadow-[0_0_30px_rgba(34,197,94,0.2)]">
            {displayWelcomeText && (
              <Terminal 
                text={welcomeText} 
                typingSpeed={25} 
                onComplete={() => {
                  setTimeout(() => setDisplayRulesText(true), 500);
                }}
                className="text-lg md:text-xl"
              />
            )}
            
            {displayRulesText && (
              <>
                <div className="mt-8">
                  <Terminal 
                    text={rulesText} 
                    typingSpeed={25} 
                    onComplete={() => {
                      setTimeout(() => setShowStartButton(true), 500);
                    }}
                    className="text-lg md:text-xl"
                  />
                </div>
                {showStartButton && (
                  <motion.div 
                    className="mt-12 flex justify-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <NeonButton 
                      onClick={handleInitiateBreachClick} 
                      glowColor="green" 
                      className="text-lg px-8 py-3 tracking-widest breach-button"
                    >
                      INTIALIZE BREACH
                    </NeonButton>
                  </motion.div>
                )}
              </>
            )}
          </TerminalWindow>
        </div>
      </div>

      {showDifficultyDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm">
          <motion.div 
            className="bg-black border-2 border-green-500 p-6 rounded-lg shadow-[0_0_30px_rgba(34,197,94,0.3)] max-w-md w-full difficulty-dialog"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
            <div className="absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
            
            <h2 className="text-2xl font-mono text-green-500 mb-4 text-center">SELECT DIFFICULTY</h2>
            <p className="text-green-400 mb-6 font-mono text-center">Choose your interrogation intensity</p>
            
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => handleStartGame('hard')}
                className="bg-red-900 text-white font-mono py-3 px-6 rounded border border-red-700 transition-all duration-300 difficulty-button"
              >
                HARD MODE
                <div className="text-xs mt-1 text-red-300">[UNHINGED]</div>
              </button>
              
              <button 
                onClick={() => handleStartGame('easy')}
                className="bg-green-900 text-white font-mono py-3 px-6 rounded border border-green-700 transition-all duration-300 difficulty-button"
              >
                EASY MODE
                <div className="text-xs mt-1 text-green-300">[RESPECTFUL]</div>
              </button>
              
              <button 
                onClick={() => setShowDifficultyDialog(false)}
                className="bg-gray-800 text-gray-300 font-mono py-2 px-4 rounded border border-gray-700 mt-2 transition-all duration-300"
              >
                CANCEL
              </button>
            </div>
            
            <div className="absolute -z-10 top-10 left-5 text-green-500/20 font-mono text-xs">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i}>{getRandomMatrixChar().repeat(Math.floor(Math.random() * 10) + 5)}</div>
              ))}
            </div>
            <div className="absolute -z-10 bottom-10 right-5 text-green-500/20 font-mono text-xs">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i}>{getRandomMatrixChar().repeat(Math.floor(Math.random() * 10) + 5)}</div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      <motion.div 
        className="absolute bottom-4 text-center text-green-500 font-mono text-sm opacity-70 w-full footer-text"
        animate={{ opacity: [0.5, 0.7, 0.5] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
      >
        <p>[DIVERGENCE: 1.048596% - STEINS;GATE WORLDLINE]</p>
        <p className="text-xs mt-1">[FUTURE GADGET #8 - PHONEWAVE (NAME SUBJECT TO CHANGE)]</p>
      </motion.div>
      
      <style jsx global>{`
        body {
          overflow: hidden;
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" stroke="%2322c55e" stroke-width="1" fill="none"/></svg>') 8 8, auto;
        }
        
        /* Ensure cursor visibility over buttons */
        button, .difficulty-button {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" stroke="%2322c55e" stroke-width="1" fill="none"/></svg>') 8 8, auto !important;
        }
        
        .cursor-trail {
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: rgba(34, 197, 94, 0.7);
          pointer-events: none;
          z-index: 9999;
          animation: fadeOut 1s forwards;
        }
        
        @keyframes fadeOut {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(0); opacity: 0; }
        }
        
        .circuit-background {
          background-image: 
            linear-gradient(to right, rgba(34, 197, 94, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(34, 197, 94, 0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        .cyberpunk-interface {
          background-color: #000;
          background-image: 
            radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.1) 0%, transparent 80%),
            linear-gradient(to bottom, #000, #111);
        }
        
        .matrix-code-rain {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
        }
        
        .matrix-code-column {
          position: absolute;
          top: -100px;
          font-family: monospace;
          font-size: 1rem;
          display: flex;
          flex-direction: column;
          animation: fall linear infinite;
          will-change: transform;
          transform: translateZ(0);
        }
        
        @keyframes fall {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100vh);
          }
        }
        
        .chakra-wheel {
          filter: drop-shadow(0 0 5px #22c55e);
        }
        
        .header-line {
          animation: slide 3s linear infinite;
        }
        
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .title-underline {
          animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        .divergence-meter {
          box-shadow: 0 0 10px rgba(217, 119, 6, 0.3);
          transition: all 0.3s ease;
        }
        
        .divergence-meter:active {
          transform: scale(0.95);
        }
        
        .terminal-window {
          position: relative;
          transition: all 0.5s ease;
        }
        
        .terminal-window.scale-up {
          transform: scale(1.05);
        }
        
        .difficulty-button {
          position: relative;
          overflow: hidden;
        }
        
        .difficulty-button::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            to bottom right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: rotate(45deg);
          transition: all 0.3s ease;
        }
        
        .difficulty-button:active::after {
          left: 100%;
        }
        
        .matrix-burst {
          position: absolute;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,255,0,0.5) 0%, rgba(0,0,0,0) 70%);
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 100;
          animation: burst 1s ease-out forwards;
        }
        
        .matrix-burst-horizontal {
          position: absolute;
          width: 100%;
          height: 2px;
          background: rgba(0,255,0,0.7);
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          pointer-events: none;
          z-index: 100;
          animation: horizontalBurst 1s ease-out forwards;
        }
        
        @keyframes burst {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
        }
        
        @keyframes horizontalBurst {
          0% { opacity: 1; height: 1px; }
          50% { opacity: 1; height: 5px; }
          100% { opacity: 0; height: 1px; }
        }
        
        .footer-text {
          text-shadow: 0 0 5px rgba(34, 197, 94, 0.5);
        }
        
        .difficulty-dialog {
          position: relative;
        }
      `}</style>
    </div>
  );
}
