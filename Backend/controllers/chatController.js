// File Location: ./Backend/controllers/chatController.js 

import axios from "axios";
import { handleQuery } from "../agents/agent.router.js";

export const chatController = async(req, res) => {
    const { message } = req.body;

    if(!message) {
        return res.status(400).json({
            error: "Message is required"
        });
    }

    try {
        const result = await handleQuery(message);

        if (!result || !result.answer) {
            return res.status(500).json({
                error: "No valid response from agent router"
            });
        }

        return res.status(200).json({
            reply: result.answer,
            source: result.source || "unknown"
        });
    } catch (error) {
        console.error("chatController Error:", error.message);
        return res.status(500).json(
            {
                error: "Something went wrong"
            }
        )
    }



}


