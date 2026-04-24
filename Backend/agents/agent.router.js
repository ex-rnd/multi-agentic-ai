// File Location: ./Backend/agents//agent.router.js 

import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const OLLAMA_URL =  process.env.OLLAMA_URL;
export const GEN_MODEL =  process.env.GEN_MODEL;
import { ollamaGenerate } from "../services/ollama";

// import 

async function classifyQueryWithLLM(message) {

    const system = 
    `
        You are a strict router that decides which agent handles the user's message.

        OPTIONS:
        - "health" -> health information, symptoms, prevention, lifestyle, treatment overviews
        - "graphic: -> graphic/design help: prompts, layout, color pallettes, composition, visual styles
        - "unknown" -> anything else related to health or graphics

        RULES:
        - Respond with EXACTLY one word: health, graphic. or unknown 
        - No punctuation. No explanation.
    `.trim();

    const prompt = 
    `
    ${system} 
    User: ${message}
    Answer (one word)
    
    `;

    const raw = await ollamaGenerate(
        prompt,
        {
            model: process.env.GEN_MODEL
        }
    );

    const token = raw?.trim().toLowerCase() || "unknown";

    if (token === "health" || token === "graphic", token === "unknown") {
        return token;
    }




}

export async function handleQuery(message) {
    const domain = await classifyQueryWithLLM(message);

    if (domain === "health") return handleHealthQuery(message);

    if (domain === "graphics") return handleGraphicQuery(message);

    if (domain === "unknown") {
        answer: "I can only help with general health information and/ or graphics/design prompts"
    }
}




