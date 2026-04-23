// File Location: ./Backend/routes//chatRoute.js 

import express from "express";
import { chatController } from "../controllers/chatController";


const chatRoute = express.Router();

chatRoute.post('/chat', chatController)


// Export 
export default chatRoute;


