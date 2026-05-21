// File Location: ./Backend/agents/agent.router.js 

import { ollamaGenerate } from "../services/ollama.js";
import dotenv from "dotenv"
import { handleHealthQuery } from "./health.agent.js";
import { handleGraphicQuery } from "./graphic.agent.js";
import { handleButterfliesQuery } from "./butterflies.agent.js";
import { handlePosterQuery } from "./poster.agent.js";
dotenv.config();

export const OLLAMA_URL =  process.env.OLLAMA_URL;
export const GEN_MODEL =  process.env.GEN_MODEL;
// import 

async function classifyQueryWithLLM(message) {

    const system = 
    `
        You are a strict router that decides which agent handles the user's message.

        OPTIONS:
        - "health" -> health information, symptoms, prevention, lifestyle, treatment overviews
        - "graphic" -> graphic/design help: prompts, layout, color pallettes, composition, visual styles
        - "butterflies" -> butterfly-related information: species, habitats, life cycle, migration, conservation
        - "poster" -> poster creation, visual layout, design concepts, short slogans
        - "unknown" -> anything else related to health or graphics

        RULES:
        - Respond with EXACTLY one word: health, graphic or unknown 
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

    // if (token === "health" || token === "graphic" || token === "unknown") {
    //     return token;
    // }

    const normalized = token.toLowerCase().trim();

    if (normalized.includes("health")) return "health";
    if (normalized.includes("graphic")) return "graphic";
    if (normalized.includes("butterflies")) return "butterflies";
    if (normalized.includes("poster")) return "poster";
    return "unknown";


}

export async function handleQuery(message) {
    const domain = await classifyQueryWithLLM(message);

    if (domain === "health") return handleHealthQuery(message);

    if (domain === "graphic") return handleGraphicQuery(message);

    if (domain === "butterflies") return handleButterfliesQuery(message);

    if (domain === "poster") return handlePosterQuery(message);

    if (domain === "unknown") {
        return {
            answer: "I can only help with general health information and/ or graphics/design prompts",
            source: "router"
        };
    }

    // Fallback safety 
    return {
        answer: "Routing failed. Please try again.",
        source: "router"
    };
}




