// File Location: ./Backend/controllers//chatController.js 

import axios from "axios";

export const chatController = async(req, res) => {
    const { message } = req.body;

    if(!message) {
        return res.status(400).json("Message is required");
    }

    try {
        const result = await handleQuery(message);

        return res.status(200).json(
            {
                reply: result.answer,
                source: result.source
            }
        )
    } catch (error) {
        return res.status(500).json(
            "Something went wrong"
        )
    }



}


