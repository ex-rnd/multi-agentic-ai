// File Location: ./Backend/services//ollama.js 

import axios from "axios";
import dotenv from "dotenv";

export const OLLAMA_URL =  process.env.OLLAMA_URL;
export const GEN_MODEL =  process.env.GEN_MODEL;

export async function ollamaChat(
    messages,
    {
        model = GEN_MODEL,
        stream = false
    } = {}
) {
    try {
        const {data} = await axios.post(`${OLLAMA_URL}/api/chat`,{
            model,
            messages,
            stream
        });

        return data?.message?.content ?? "";
        
    } catch (error) {
        console.error("ollamaChatError:", error.message)
    }
}

export async function ollamaGenerate(
    prompt,
    {
        model = GEN_MODEL,
        stream = false
    } = {}
) {
    try {
        const {data} = await axios.post(`${OLLAMA_URL}/api/generate`,{
            model,
            prompt,
            stream
        });

        return data?.response ?? "";
        
    } catch (error) {
        console.error("ollamaGenerate Error:", error.message)
    }
}

