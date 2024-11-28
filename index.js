// Import required libraries
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import OpenAI from 'openai';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configure OpenAI API
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

// Endpoint to handle OpenAI requests
app.post('/generate', async (req, res) => {
    const { transcribe } = req.body;

    if (!transcribe) {
        return res.status(400).json({ error: 'transcribe is required' });
    }

    try {
        // Call OpenAI API to create a chat completion
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: process.env.PROMPT },
                {
                    role: "user",
                    content: transcribe,
                },
            ],
        });

        // Return the AI's response
        res.json({ soapnote: completion.choices[0].message });
    } catch (error) {
        console.error('Error generating response:', error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data?.error?.message || error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
