// File Location: ./Backend/agents/graphic.agent.js 

import { ollamaChat } from "../services/ollama.js";
import dotenv from "dotenv"
dotenv.config();

export const OLLAMA_URL =  process.env.OLLAMA_URL;
export const GEN_MODEL =  process.env.GEN_MODEL;

export async function handleGraphicQuery(message) {

    const system = 
    `
    You are "Graphic Pro", a graphics/design assistant.
    SCOPE:
    - Help with image/video prompts, composition, style direction, color pallettes,typography, layouts.
    - Provide concise, production ready prompts and a few quick variations.
    POLICY:
    - If user asks outside graphics/design scope, say: "Sorry, I only provide help with graphics/design prompts."
    FORMAT:
    - Start with a single best prompt.
    - Then give 2-3 short variations (bulleted).
    
    `.trim();

    const reply = await ollamaChat
    (
        [
            {
                role: "system", content: system
            },
            {
                role: "user", content: message
            },
        ],
        {
            model: process.env.GEN_MODEL,
            stream: false
        }

    );

    return {
        answer: (reply || "Sorry, I could help with only graphic/design related query").trim(),
        source: "graphic"
    }




}


















