// Function to randomly decide if we should trigger a glitch
export const shouldGlitch = (probability = 0.01): boolean => {
  return Math.random() < probability;
};

// Array of possible glitch characters
const glitchChars = "!@#$%^&*()_+-=[]{}|;:'\\,.<>/?`~";

// Function to get a random glitch character
export const getRandomGlitchChar = (): string => {
  return glitchChars[Math.floor(Math.random() * glitchChars.length)];
};

// Function to apply a glitch effect to a string
export const glitchText = (text: string, intensity = 0.1): string => {
  return text
    .split('')
    .map(char => (Math.random() < intensity ? getRandomGlitchChar() : char))
    .join('');
};
