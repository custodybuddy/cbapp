import { GoogleGenAI } from "@google/genai";

/**
 * The singleton instance of the GoogleGenAI client.
 * Initialized with the API key from environment variables as per guidelines.
 * This client is imported by all feature-specific AI services.
 */
export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
