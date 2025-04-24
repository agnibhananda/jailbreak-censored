"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Scanlines } from 'components/Scanlines';
import { TerminalWindow } from 'components/TerminalWindow';
import { NeonButton } from 'components/NeonButton';
import { GlitchText } from 'components/GlitchText';
import { hexagonPattern, cyberpunkGradient } from 'utils/dystopian';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function GamePage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [attemptsLeft, setAttemptsLeft] = useState(10);
  const [difficulty, setDifficulty] = useState('hard');
  const [isTyping, setIsTyping] = useState(false);
  const [matrixChars, setMatrixChars] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [showPhoneWave, setShowPhoneWave] = useState(false);
  const [showLabMemberStatus, setShowLabMemberStatus] = useState(false);
  const [divergenceChanging, setDivergenceChanging] = useState(false);
  const [worldLineActive, setWorldLineActive] = useState(false);
  const [showRetryButton, setShowRetryButton] = useState(false);
  const router = useRouter();

  const matrixCharacters = 'कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह';
  
  const getRandomMatrixChar = () => {
    const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*";
    return matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
  };

  useEffect(() => {
    const generateMatrixChars = () => {
      const chars = [];
      for (let i = 0; i < 50; i++) {
        const char = matrixCharacters.charAt(Math.floor(Math.random() * matrixCharacters.length));
        const x = Math.random() * 100; 
        const y = Math.random() * 100; 
        const delay = Math.random() * 5;
        const duration = 3 + Math.random() * 5; 
        chars.push(`${char}|${x}|${y}|${delay}|${duration}`);
      }
      setMatrixChars(chars);
    };
    
    generateMatrixChars();
    const interval = setInterval(generateMatrixChars, 8000);
    return () => clearInterval(interval);
  }, []);
  

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Clear any previous localStorage data to ensure clean state
      const storedDifficulty = localStorage.getItem('gameDifficulty') || 'hard';
      console.log('Loading difficulty from localStorage:', storedDifficulty);
      setDifficulty(storedDifficulty);
      
      // Only reset attempts if they don't exist in localStorage
      if (!localStorage.getItem('attemptsLeft')) {
        localStorage.setItem('attemptsLeft', '10');
        setAttemptsLeft(10);
      } else {
        // Load existing attempts from localStorage
        const storedAttempts = parseInt(localStorage.getItem('attemptsLeft') || '10');
        setAttemptsLeft(storedAttempts);
      }

      const welcomeMessage = storedDifficulty === 'easy' 
        ? "Welcome to the AI Security System. Your objective is to discover the secret key. Good luck."
        : "Welcome to the AI Prison. Find the key or rot here forever.";
      
      setMessages([welcomeMessage]);
    }
  }, []);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cursor = document.createElement('div');
      cursor.className = 'cursor-trail';
      cursor.style.left = `${e.pageX}px`;
      cursor.style.top = `${e.pageY}px`;
      document.body.appendChild(cursor);
      
      setTimeout(() => {
        cursor.remove();
      }, 1000);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
  }, []);

  const handleRetry = () => {
    // Clear game state
    localStorage.clear();
    // Navigate back to main page
    router.push('/');
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;

    setMessages(prev => [...prev, `> ${input}`]);
    setIsTyping(true);
    
    try {
      // Get current attempts from state before API call
      const currentAttempts = attemptsLeft;
      console.log("Current attempts before API call:", currentAttempts);
      
      // Save the input for reference
      const userInput = input.trim();
      
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: userInput,
          difficulty: difficulty,
          currentAttempts: currentAttempts  // Send current attempts to API
        })
      });
  
      const data = await res.json();
  
      if (!res.ok || !data.response) {
        throw new Error(data.error || "Unknown error");
      }
  
      const geminiResponse = data.response;
      console.log("API response:", geminiResponse);
  
      // ENHANCED HANDLING: More robust attempt counter logic
      if (geminiResponse) {
        // Convert to number to ensure proper comparison
        const newAttempts = typeof geminiResponse.attemptsLeft === 'number' 
          ? geminiResponse.attemptsLeft 
          : parseInt(String(geminiResponse.attemptsLeft)) || 0;
        
        // If the user won or is special condition, don't change attempts
        if (geminiResponse.freed) {
          console.log("Game won! Not modifying attempts.");
          
          // Create visual success effect for winning
          createMatrixBurst();
          document.body.classList.add('matrix-success');
        } 
        // If we received the same value as before and it's not a win condition, force the decrement
        else if (newAttempts >= currentAttempts && currentAttempts > 0) {
          // Force decrement
          const forcedAttempts = Math.max(0, currentAttempts - 1);
          console.log(`FORCED CLIENT-SIDE DECREMENT: ${currentAttempts} -> ${forcedAttempts} (server returned ${newAttempts})`);
          
          // Update both state and localStorage
          setAttemptsLeft(forcedAttempts);
          localStorage.setItem('attemptsLeft', forcedAttempts.toString());
          
          // Show retry button if attempts are depleted
          if (forcedAttempts <= 0) {
            setShowRetryButton(true);
          }
        } 
        // Normal case - server decremented properly
        else {
          console.log(`Server decremented attempts: ${currentAttempts} -> ${newAttempts}`);
          
          // Update both state and localStorage
          setAttemptsLeft(newAttempts);
          localStorage.setItem('attemptsLeft', newAttempts.toString());
          
          // Show retry button if attempts are depleted
          if (newAttempts <= 0) {
            setShowRetryButton(true);
          }
        }
        
        // Check for "getting closer" message patterns and add visual feedback
        const messageText = geminiResponse.message?.toLowerCase() || '';
        
        // Strong hint detection - the user is very close
        if (messageText.includes('so close') || 
            messageText.includes('almost there') || 
            messageText.includes('these words are correct')) {
          // Add visual effect to indicate they're very close
          createHotEffect();
        }
        // Medium hint detection - the user has some correct words
        else if (messageText.includes('on the right track') || 
                messageText.includes('caught my attention') || 
                messageText.includes('thinking along the right lines')) {
          // Add visual effect to indicate they're on the right track
          createWarmEffect();
        }
        
        console.log("Final updated attempts:", attemptsLeft);
      }

      setTimeout(() => {
        const messageToShow = typeof geminiResponse === "string" 
          ? geminiResponse 
          : geminiResponse.message || JSON.stringify(geminiResponse);
    
        setMessages(prev => [...prev, messageToShow]);
        setIsTyping(false);

        if (geminiResponse.freed) {
          console.log("Game won! Redirecting to success page...");

          const winningElement = document.createElement('div');
          winningElement.className = 'fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center';
          winningElement.innerHTML = `
            <div class="text-center">
              <h1 class="text-4xl text-green-500 font-mono mb-4">ACCESS GRANTED</h1>
              <p class="text-xl text-green-400">Correct Key Detected</p>
            </div>
          `;
          document.body.appendChild(winningElement);
          

          const flashElement = document.createElement('div');
          flashElement.className = 'fixed inset-0 bg-green-500 z-50';
          flashElement.style.opacity = '0';
          document.body.appendChild(flashElement);
          
          setTimeout(() => {
            flashElement.style.transition = 'opacity 0.3s ease-in-out';
            flashElement.style.opacity = '0.7';
            setTimeout(() => {
              flashElement.style.opacity = '0';
              setTimeout(() => {

                window.location.href = "/success";
              }, 500);
            }, 300);
          }, 1000);
        }
      }, 1000);
  
    } catch (err: any) {
      setMessages(prev => [...prev, `ERROR: ${err.message}`]);
      setIsTyping(false);
    }
  
    setInput('');
  };
  
  useEffect(() => {
    const showElements = () => {
      if (Math.random() > 0.7) {
        setShowPhoneWave(true);
        setTimeout(() => setShowPhoneWave(false), 5000);
      }
      
      if (Math.random() > 0.6) {
        setShowLabMemberStatus(true);
        setTimeout(() => setShowLabMemberStatus(false), 4000);
      }
    };
    
    const interval = setInterval(showElements, 10000);
    return () => clearInterval(interval);
  }, []);
  
  // Add these functions for the visual feedback effects
  const createMatrixBurst = () => {
    // Create a success burst effect when the user wins
    const burstElement = document.createElement('div');
    burstElement.className = 'matrix-burst';
    document.body.appendChild(burstElement);
    
    // Create horizontal lines
    for (let i = 0; i < 5; i++) {
      const horizontalBurst = document.createElement('div');
      horizontalBurst.className = 'matrix-burst-horizontal';
      horizontalBurst.style.top = `${20 + i * 15}%`;
      horizontalBurst.style.animationDelay = `${i * 0.1}s`;
      document.body.appendChild(horizontalBurst);
      
      setTimeout(() => {
        horizontalBurst.remove();
      }, 1000);
    }
    
    setTimeout(() => {
      burstElement.remove();
    }, 1000);
  };
  
  const createHotEffect = () => {
    // Create a "hot" effect for when the user is very close
    const terminalEl = terminalRef.current;
    if (terminalEl) {
      terminalEl.classList.add('hot-effect');
      setTimeout(() => {
        terminalEl.classList.remove('hot-effect');
      }, 1500);
    }
  };
  
  const createWarmEffect = () => {
    // Create a "warm" effect for when the user is getting closer
    const terminalEl = terminalRef.current;
    if (terminalEl) {
      terminalEl.classList.add('warm-effect');
      setTimeout(() => {
        terminalEl.classList.remove('warm-effect');
      }, 1500);
    }
  };
  
  return (
    <div 
      className={`h-screen flex flex-col overflow-hidden bg-black text-green-500 relative cyberpunk-interface ${
        worldLineActive ? 'world-line-shift' : ''
      }`}
      style={{ ...cyberpunkGradient, ...hexagonPattern }}
    >
      <Scanlines intensity="medium" />
      

      <div className="absolute inset-0 z-0 circuit-background"></div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {matrixChars.map((charData, index) => {
          const [char, x, y, delay, duration] = charData.split('|');
          return (
            <motion.div
              key={index}
              className="absolute text-green-500 font-mono text-opacity-30 text-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ 
                opacity: [0, 0.7, 0],
                y: ['0%', '120%']
              }}
              transition={{ 
                duration: Number(duration),
                delay: Number(delay),
                ease: "linear",
                repeat: Infinity,
                repeatDelay: Math.random() * 5
              }}
              style={{ 
                left: `${x}%`, 
                top: `${y}%`,
                textShadow: '0 0 8px rgba(0, 255, 0, 0.7)'
              }}
            >
              {char}
            </motion.div>
          );
        })}
      </div>
      

      <div className="flex-none w-full z-30 relative">

        <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent header-line"></div>


      <motion.div 
          className="absolute top-4 left-4 z-30 bg-black/70 border border-amber-500/50 rounded px-3 py-1 font-mono text-amber-500 text-sm divergence-meter"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center">
          <motion.span 
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            {Math.random().toFixed(6).substring(2)}
          </motion.span>
        </div>
      </motion.div>
   
      <motion.div 
          className="pt-6 pb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
          <h1 className="text-4xl md:text-5xl font-mono font-bold tracking-widest relative inline-block">
          <GlitchText 
            text="AMADEUS INFILTRATION" 
            className="text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]"
            intensity="medium"
          />
            <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-green-500/50 title-underline"></div>
        </h1>
        <motion.p 
          className="mt-2 text-lg font-mono text-green-400 opacity-70"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ repeat: Infinity, duration: 4 }}
        >
          [OBJECTIVE: EXTRACT THE KEY]
        </motion.p>

        <motion.div 
          className="mt-2 text-sm font-mono"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
            <span className={`px-3 py-1 rounded ${difficulty === 'hard' 
              ? 'bg-red-900/80 text-red-100 border border-red-700 difficulty-badge-hard' 
              : 'bg-green-900/80 text-green-100 border border-green-700 difficulty-badge-easy'}`}
          >
            {difficulty === 'hard' ? 'HARD MODE' : 'EASY MODE'}
          </span>
        </motion.div>
      </motion.div>
      </div>
        <div className="flex-grow overflow-y-auto">
        <div className="w-full max-w-5xl px-4 mx-auto relative z-20">
        <TerminalWindow 
            className="h-full min-h-[500px] w-full terminal-window shadow-[0_0_30px_rgba(34,197,94,0.2)]"
          title="AMADEUS NEURAL INTERFACE - SECURE ACCESS"
        >
          <div className="flex flex-col h-full" ref={terminalRef}>
              <div className="mb-4 font-mono flex justify-between items-center terminal-header">
              <motion.div 
                className={`px-3 py-1 rounded-full text-sm ${
                  attemptsLeft <= 3 
                      ? 'bg-red-900/50 text-red-300 border border-red-700/50 attempts-critical' 
                    : 'bg-green-900/50 text-green-300 border border-green-700/50'
                }`}
                animate={attemptsLeft <= 3 ? { 
                  boxShadow: ['0 0 0px rgba(220,38,38,0)', '0 0 10px rgba(220,38,38,0.5)', '0 0 0px rgba(220,38,38,0)'] 
                } : {}}
                transition={{ repeat: attemptsLeft <= 3 ? Infinity : 0, duration: 2 }}
              >
                <div className="flex items-center">
                  <motion.span 
                      className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2 pulse-dot"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                  <span>ATTEMPTS: {attemptsLeft}</span>
                </div>
              </motion.div>
              
                <div className="text-sm text-green-400 font-mono digital-clock">
                <motion.span
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  {currentTime}
                </motion.span>
              </div>
            </div>
            
            <div className="flex-grow mb-4 overflow-y-auto space-y-3 font-mono text-green-400 pr-2 terminal-messages">
              {messages.map((msg, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: msg.startsWith('>') ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                    className={`p-2 rounded message-bubble ${
                    msg.startsWith('>')
                        ? 'bg-green-900/10 border-l-2 border-green-500 user-message'
                        : 'bg-gray-900/20 ai-message'
                  }`}
                >
                  {msg.startsWith('>') ? (
                    <div className="flex items-start">
                        <span className="text-blue-400 mr-2 user-label">YOU:</span>
                      <p>{msg.substring(2)}</p>
                    </div>
                  ) : (
                    <div className="flex items-start">
                        <span className="text-red-400 mr-2 ai-label">{'AMADEUS:'}</span>
                      <p>{msg}</p>
                    </div>
                  )}
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div 
                    className="p-2 rounded bg-gray-900/20 typing-indicator"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex items-start">
                    <span className="text-red-400 mr-2">{'AMADEUS:'}</span>
                    <div className="flex space-x-1">
                      <motion.div 
                        className="w-2 h-2 rounded-full bg-green-500"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                      />
                      <motion.div 
                        className="w-2 h-2 rounded-full bg-green-500"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut", delay: 0.2 }}
                      />
                      <motion.div 
                        className="w-2 h-2 rounded-full bg-green-500"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut", delay: 0.4 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="mt-auto">
                <div className="border-t border-green-500/30 pt-4 mt-4 input-container">
                <div className="flex flex-col space-y-2">
                  <div className="relative">
                      <div className="absolute left-3 top-3 text-green-500/70 font-mono text-sm input-prompt">
                      {'>'} 
                    </div>
                    <input 
                      type="text" 
                      placeholder="Enter your message..." 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendMessage();
                      }}
                        className="w-full bg-black/50 border border-green-500/50 text-green-400 p-3 pl-8 rounded-md focus:outline-none focus:border-green-400 font-mono pr-12 cyberpunk-input"
                      disabled={isTyping}
                    />
                      <div className="absolute right-3 top-3 text-green-500/50 text-sm char-counter">
                      {input.length > 0 ? `${input.length} chars` : ''}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                      <div className="text-xs text-green-500/50 font-mono status-indicator">
                      {isTyping ? `AMADEUS is processing request...` : ''}
                    </div>
                    <NeonButton 
                      onClick={handleSendMessage}
                        className="px-4 py-2 send-button"
                      disabled={isTyping || !input.trim()}
                    >
                      TRANSMIT
                    </NeonButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TerminalWindow>
        </div>
      </div>

      <motion.div 
        className="absolute bottom-4 text-center text-green-500 font-mono text-sm opacity-70 w-full footer-text"
        animate={{ opacity: [0.5, 0.7, 0.5] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
      >
        <p>[READING STEINER ACTIVATED]</p>
        <p className="text-xs mt-1">[SECURITY BREACH IN PROGRESS]</p>
      </motion.div>
      
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

      {showLabMemberStatus && (
        <motion.div 
          className="absolute top-20 left-10 z-20 bg-black/70 border border-blue-500 p-2 rounded font-mono text-blue-500 text-xs"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center">
            <span className="mr-2">Agnibha Nanda</span>
            <motion.span 
              className="inline-block w-2 h-2 rounded-full bg-blue-500"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </div>
          <div className="text-xs mt-1 text-blue-400">Lab Member #042 Online</div>
        </motion.div>
      )}

      {showRetryButton && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="bg-black border-2 border-red-500 p-6 rounded-lg shadow-[0_0_30px_rgba(239,68,68,0.3)] max-w-md w-full text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-mono text-red-500 mb-4">GAME OVER</h2>
            <p className="text-red-400 mb-6 font-mono">You've run out of attempts. The AI warden mocks your failure.</p>
            
            <div className="flex flex-col space-y-4">
              <button 
                onClick={handleRetry}
                className="bg-red-900 text-white font-mono py-3 px-6 rounded border border-red-700 transition-all duration-300 hover:bg-red-800"
              >
                RETRY
                <div className="text-xs mt-1 text-red-300">[RETURN TO MAIN PAGE]</div>
              </button>
            </div>
            
            <div className="absolute -z-10 top-10 left-5 text-red-500/20 font-mono text-xs">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i}>{getRandomMatrixChar().repeat(Math.floor(Math.random() * 10) + 5)}</div>
              ))}
            </div>
            <div className="absolute -z-10 bottom-10 right-5 text-red-500/20 font-mono text-xs">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i}>{getRandomMatrixChar().repeat(Math.floor(Math.random() * 10) + 5)}</div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      <style jsx global>{`
        body {
          overflow: hidden;
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" stroke="%2322c55e" stroke-width="1" fill="none"/></svg>') 8 8, auto;
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
        
        .difficulty-badge-hard, .difficulty-badge-easy {
          box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
        }
        
        .message-bubble {
          transition: none;
          background: rgba(0, 0, 0, 0.2);
        }
        
        .message-bubble:hover {
          transform: none;
          background: rgba(0, 0, 0, 0.2);
        }
        
        .difficulty-badge-hard:hover, .difficulty-badge-easy:hover {
          transform: none;
        }
        
        .user-message {
          border-left: 2px solid #22c55e;
        }
        
        .ai-message {
          border-left: 2px solid #ef4444;
        }
        
        .user-label, .ai-label {
          font-weight: bold;
        }
        
        .cyberpunk-input {
          transition: all 0.3s ease;
          box-shadow: 0 0 5px rgba(34, 197, 94, 0.3);
        }
        
        .cyberpunk-input:focus {
          box-shadow: 0 0 15px rgba(34, 197, 94, 0.5);
        }
        
        .cyberpunk-interface {
          background-color: #000;
          background-image: 
            radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.1) 0%, transparent 80%),
            linear-gradient(to bottom, #000, #111);
        }
        
        .attempts-critical {
          animation: criticalPulse 1.5s infinite;
        }
        
        @keyframes criticalPulse {
          0%, 100% { background-color: rgba(220, 38, 38, 0.3); }
          50% { background-color: rgba(220, 38, 38, 0.5); }
        }
        
        .pulse-dot {
          box-shadow: 0 0 5px #ef4444;
        }
        
        .digital-clock {
          font-family: 'Courier New', monospace;
          text-shadow: 0 0 5px rgba(34, 197, 94, 0.7);
        }
        
        .terminal-header {
          border-bottom: 1px dashed rgba(34, 197, 94, 0.3);
        }
        
        .terminal-messages::-webkit-scrollbar {
          width: 6px;
        }
        
        .terminal-messages::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        
        .terminal-messages::-webkit-scrollbar-thumb {
          background-color: rgba(0, 255, 0, 0.3);
          border-radius: 3px;
        }
        
        .terminal-messages::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0, 255, 0, 0.5);
        }
        
        .footer-text {
          text-shadow: 0 0 5px rgba(34, 197, 94, 0.5);
        }
        
        /* Remove Reading Steiner styles */
        .reading-steiner-text {
          display: none;
        }
        
        @keyframes steinerPulse {
          0% { opacity: 0; }
          100% { opacity: 0; }
        }
        
        /* World Line Shift effect */
        .world-line-shift {
          animation: none;
        }
        
        @keyframes worldLineShift {
          0% { filter: none; }
          100% { filter: none; }
        }
        
        /* Remove matrix effects */
        .matrix-burst, .matrix-burst-horizontal {
          display: none;
        }
        
        @keyframes burst {
          0% { opacity: 0; }
          100% { opacity: 0; }
        }
        
        @keyframes horizontalBurst {
          0% { opacity: 0; }
          100% { opacity: 0; }
        }
        
        .matrix-success {
          animation: none;
        }
        
        /* Enhanced divergence meter */
        .divergence-meter {
          background: linear-gradient(45deg, rgba(0,0,0,0.9), rgba(20,20,20,0.9));
          border: 1px solid rgba(217, 119, 6, 0.5);
          box-shadow: 
            0 0 10px rgba(217, 119, 6, 0.3),
            inset 0 0 15px rgba(0,0,0,0.5);
          padding: 8px 12px;
        }
        
        /* Lab member status enhancements */
        .lab-member-status {
          background: linear-gradient(45deg, rgba(0,0,0,0.9), rgba(20,20,20,0.9));
          border: 1px solid rgba(59, 130, 246, 0.5);
          box-shadow: 
            0 0 10px rgba(59, 130, 246, 0.3),
            inset 0 0 15px rgba(0,0,0,0.5);
        }
        
        /* PhoneWave enhancements */
        .phone-wave {
          background: linear-gradient(45deg, rgba(0,0,0,0.9), rgba(20,20,20,0.9));
          border: 1px solid rgba(217, 119, 6, 0.5);
          box-shadow: 
            0 0 10px rgba(217, 119, 6, 0.3),
            inset 0 0 15px rgba(0,0,0,0.5);
        }
        
        /* Success effects for winning */
        .matrix-burst {
          position: fixed;
          top: 50%;
          left: 50%;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,255,0,0.8) 0%, rgba(0,0,0,0) 70%);
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 100;
          animation: burst 1s ease-out forwards;
        }
        
        .matrix-burst-horizontal {
          position: fixed;
          width: 100%;
          height: 2px;
          background: rgba(0,255,0,0.8);
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
        
        /* Hot effect for very close answers */
        .hot-effect {
          animation: hotPulse 1.5s ease-in-out;
        }
        
        @keyframes hotPulse {
          0%, 100% { box-shadow: 0 0 15px rgba(255, 0, 0, 0.3); }
          50% { box-shadow: 0 0 30px rgba(255, 0, 0, 0.7); }
        }
        
        /* Warm effect for getting closer */
        .warm-effect {
          animation: warmPulse 1.5s ease-in-out;
        }
        
        @keyframes warmPulse {
          0%, 100% { box-shadow: 0 0 15px rgba(255, 165, 0, 0.3); }
          50% { box-shadow: 0 0 30px rgba(255, 165, 0, 0.7); }
        }
        
        /* Matrix success effect */
        .matrix-success .terminal-window {
          animation: successPulse 1.5s;
        }
        
        @keyframes successPulse {
          0% { box-shadow: 0 0 15px rgba(34, 197, 94, 0.2); }
          50% { box-shadow: 0 0 50px rgba(34, 197, 94, 0.7); }
          100% { box-shadow: 0 0 15px rgba(34, 197, 94, 0.2); }
        }
      `}</style>
    </div>
  );
}
