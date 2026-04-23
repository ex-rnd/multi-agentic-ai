// File Location: ./Backend/index.js 

import express from 'express';
import dotenv from 'dotenv';

const app = express();

// Port 
const PORT = process.env.PORT;

// Index Route 
app.get('/', (req, res) => {
    res.send("Backend Running")
}) 

// Start Server - App Listen 
app.listen(PORT, () => {
    console.log(`Server running on PORT no ${PORT}`)
})





