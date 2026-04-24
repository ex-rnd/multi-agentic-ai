// File Location: ./Backend/index.js 

import express from 'express';
import dotenv from 'dotenv';
import chatRoute from './routes/chatRoute.js';

dotenv.config()

const app = express();

const PORT = process.env.PORT || 3000;

// Express
app.use(express.json())

// Index Route 
app.get('/', (req, res) => {
    res.send("Backend Running")
}) 

app.use('/api', chatRoute)







// Start Server - App Listen 
app.listen(PORT, () => {
    console.log(`Server running on PORT no ${PORT}`)
})





