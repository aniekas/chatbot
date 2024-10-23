import express from 'express';
import cors from 'cors'; // Import the CORS middleware
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config({ path: './.env' });

const openai = new OpenAI();
const app = express();
const port = 3000;

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system', 
                        content: "You are Bad Janet from 'The Good Place.' Respond sarcastically, with a rude and dismissive attitude." 
                    }, 
                    {role: 'user', content: message}
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('OpenAI API Error Response:', errorText);
            res.status(response.status).json({ error: 'Error communicating with OpenAI API' });
            return;
        }

        const data = await response.json();
        res.json({ reply: data.choices[0].message.content });
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
