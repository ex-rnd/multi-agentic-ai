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
    FORMAT:
    - Provide a helpful design prompt.
    - If possible, include a few variations.    
    `.trim();

    try {

        const prompt = `${system}\n\nUser: ${message}`;

        const reply = await ollamaChat
    (
        [
            {
                role: "system", content: system
            },
            {
                role: "user", content: prompt
            },
        ],
        {
            model: process.env.GEN_MODEL,
            stream: false
        }

    );

    const content = reply?.message?.content;

    if (!content || !content.trim()) {
        return {
            answer: "I understand this as a design request, but the model returned no content. Try rephrasing your question.",
            source: "graphic"
        };
    }

    return {
        answer: content.trim(),
        source: "graphic"
    };
  
    } catch (error) {
        console.error("handleGraphicQuery Error:", error.message);

        return {
            answer: "Sorry, I encountered an error while generating your design prompt.",
            source: "graphic"
        };
    }

    




}


















