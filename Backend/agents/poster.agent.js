import { ollamaChat } from "../services/ollama.js";
import dotenv from "dotenv";
dotenv.config();

export const OLLAMA_URL = process.env.OLLAMA_URL;
export const GEN_MODEL = process.env.GEN_MODEL;

export async function handlePosterQuery(message) {
  const system = `
You are "PosterPro", a creative assistant that generates visual poster ideas.
SCOPE:
- Create short, impactful poster concepts for design, UI/UX, motivation, or education.
- Focus on layout, color palette, typography, and concise messaging.
POLICY:
- If user asks outside poster or design scope, say: "Sorry, I only create poster concepts."
FORMAT:
- Provide a short headline, a one‑sentence tagline, and a brief description of visual style.
`.trim();

  try {
    const prompt = `${system}\n\nUser: ${message}`;

    const reply = await ollamaChat(
      [{ role: "user", content: prompt }],
      { model: process.env.GEN_MODEL, stream: false }
    );

    const content = reply?.message?.content;

    if (!content || !content.trim()) {
      return {
        answer:
          "I understood this as a poster request, but the model returned no content. Try rephrasing your idea.",
        source: "poster",
      };
    }

    return {
      answer: content.trim(),
      source: "poster",
    };
  } catch (error) {
    console.error("handlePosterQuery Error:", error.message);
    return {
      answer:
        "Sorry, I encountered an error while generating your poster concept.",
      source: "poster",
    };
  }
}
