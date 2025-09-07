import express from "express";
import { genAI } from "../config/gemini.js";

const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const res = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await res.generateContent(message);
    const output = await result.response.text();

    res.json({ reply: output });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Something went wrong with Gemini API" });
  }
});

export default router;
