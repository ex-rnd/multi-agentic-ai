// File Location: ./Backend/controllers//chatController.js 

import axios from "axios";

export const chatController = async(req, res) => {
    const { message } = req.body;

    if(!message) {
        return res.status(400).json("Message is required");
    }

    try {
        const response = await axios.post(
            'http://localhost:11434/api/generate',
            {
                "model": "mistral",
                "prompt": message,
                "stream": false 
            }
        );

        const data = response.data;

        return res.status(200).json(
            {
                reply: data.response
            }
        )
    
    } catch (error) {

        return res.status(200).json(
                "Something went wrong"
        )
        
    }


}


