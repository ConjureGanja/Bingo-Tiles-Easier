import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getStrategyTips = async (taskTitle: string, taskDescription: string, detailed: boolean = false): Promise<string> => {
  try {
    const prompt = detailed 
      ? `
        You are a legendary Old School RuneScape (OSRS) player and strategist.
        Provide a detailed, high-level strategy guide for the following bingo tile:
        
        Title: ${taskTitle}
        Description: ${taskDescription}
        
        Consider:
        1. The most efficient method.
        2. Gear or stat requirements.
        3. Pitfalls or 'noob traps'.
        
        Keep the advice bulleted and comprehensive.
      `
      : `
        You are a legendary Old School RuneScape (OSRS) player.
        Provide a very short, concise tip (1-2 sentences max) on how to complete this task efficiently.
        
        Title: ${taskTitle}
        Description: ${taskDescription}
      `;

    // Use high thinking budget for detailed answers to leverage complex reasoning.
    // Use 0 thinking budget for quick answers to ensure low latency.
    const thinkingBudget = detailed ? 32768 : 0;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingBudget: thinkingBudget, 
        }
      }
    });

    return response.text || " The oracle is silent on this matter.";
  } catch (error) {
    console.error("Gemini strategy failed:", error);
    return "Could not retrieve strategy at this time.";
  }
};