// Import necessary modules
import express from "express";
import cors from "cors";
import "dotenv/config"
import { getSpeakingData } from "./utils/generateAudio.js";
import { generateResponse } from "./utils/generateResponse.js";
import fs from "fs";

// Initialize Express app
const app = express();
const port = 4000;

// Middleware
app.use(cors({
    origin: "*"
})); // Enable CORS
app.use(express.json()); // Parse JSON request bodies
app.use(express.static("audios")); // Serve static files from the "audios" directory

//check
app.get("/", (req, res) => {
    res.status(200).send("Server is in working...");
})
// Chat route
app.get("/chat", async (req, res) => {
    try {
        const { message } = req.query;
        console.log("User: ",message);
        const text = await generateResponse(message)
        console.log("Bot: ",text);
        const audio = await getSpeakingData(text);
        
        console.log("message send successfully")
        res.json({...audio, transcription: text});
    } catch (error) {
        console.log(error.message,'hello')
        res.status(501).json({success: false,message: error.message})
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});