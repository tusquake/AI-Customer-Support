import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import geminiRoutes from "./routes/gemini.js";
import { aiAgent } from "./agent.js"; 

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/query", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "query required" });

    const result = await aiAgent(query);
    return res.json({ reply: result });
  } catch (err) {
    console.error("Agent Error:", err);
    return res.status(500).json({ error: "server error" });
  }
});

app.use("/api/gemini", geminiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
