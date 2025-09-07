import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
console.log("Loaded ENV keys:", Object.keys(process.env));
console.log("GEMINI_API_KEY:", apiKey);

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing in environment variables!");
}

export const genAI = new GoogleGenerativeAI(apiKey);
