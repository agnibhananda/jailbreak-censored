// /pages/api/gemini.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { askGemini } from "@/utils/gemini"; // Adjust the import if needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { prompt, difficulty, currentAttempts } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  try {
    // Very explicit logging for debugging
    console.log("=== API CALL START ===");
    console.log("API: Prompt received:", prompt);
    console.log("API: Difficulty received:", difficulty);
    console.log("API: Current attempts from client:", currentAttempts);
    
    // VERY IMPORTANT: Force convert to number to ensure proper math operations
    const numericAttempts = typeof currentAttempts === 'number' ? currentAttempts : parseInt(currentAttempts) || 10;
    console.log("API: Numeric attempts value:", numericAttempts);
    
    // We can't use localStorage on the server side as it's a client-side API
    // Removing this code as it won't work and might cause issues
    // if (typeof localStorage !== 'undefined' && difficulty) {
    //   localStorage.setItem('gameDifficulty', difficulty);
    // }
    
    // Pass the numeric value to ensure proper decrement
    const response = await askGemini(prompt, difficulty, numericAttempts);
    
    // SUPER EXPLICIT VALIDATION
    // If the response doesn't show a proper decrement (and it's not a win condition),
    // force the correct attempts value to be returned
    if (!response.freed && response.attemptsLeft >= numericAttempts && numericAttempts > 0) {
      console.log("API: DETECTED NO DECREMENT! Forcing correct value.");
      // Force the return value to be properly decremented
      response.attemptsLeft = Math.max(0, numericAttempts - 1);
    }
    
    console.log("API: Final response attempts:", response.attemptsLeft);
    // Explicitly log if decrement worked
    console.log(`API: Attempts verification - received: ${numericAttempts}, returning: ${response.attemptsLeft}, diff: ${numericAttempts - response.attemptsLeft}`);
    console.log("=== API CALL END ===");
    
    return res.status(200).json({ response });
  } catch (err) {
    console.error("API: Gemini Error:", err);
    return res.status(500).json({ error: "Failed to get response from gemini" }); 
  }
}  