import { ollamaChat } from "../services/ollama.js";
import dotenv from "dotenv"
dotenv.config();

export const OLLAMA_URL = process.env.OLLAMA_URL;
export const GEN_MODEL = process.env.GEN_MODEL;

export async function handleButterfliesQuery(message) {

    const system = `
    You are "ButterflyInfo", an assistant focused on butterflies.
    SCOPE:
    - Provide general information about butterflies: species, habitats, life cycle, migration, conservation.
    - No medical advice, no unrelated topics.
    POLICY:
    - If user asks outside butterfly scope, say: "Sorry, I only provide information about butterflies."
    FORMAT:
    - Keep answers concise, clear, and engaging.
    `.trim();

    try {
        const reply = await ollamaChat(
            [
                { role: "system", content: system },
                { role: "user", content: message }
            ],
            {
                model: process.env.GEN_MODEL,
                stream: false
            }
        );

        return {
            answer: (reply || "Sorry, I could only help with butterfly-related queries."),
            source: "butterflies"
        };

    } catch (error) {
        console.error("handleButterfliesQuery Error:", error.message);

        return {
            answer: "Sorry, I encountered an error while generating butterfly information.",
            source: "butterflies"
        };
    }
}
