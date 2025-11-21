// Gemini AI integration for chatbot functionality
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AiAction } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.error('VITE_GEMINI_API_KEY not found in environment variables');
} else {
    console.log('Gemini API key loaded:', API_KEY.substring(0, 10) + '...');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

const systemPrompt = `You are an AI assistant for CoalSight AI, a coal mining intelligence platform.
You help users filter and analyze coal mining data on an interactive map of India.

The map shows:
- Existing coal mines (blue markers)
- AI-predicted coal zones (colored polygons)

Available filter options:
1. State: Filter by Indian states (e.g., Jharkhand, Odisha, Chhattisgarh, West Bengal, Maharashtra, Madhya Pradesh, etc.)
2. Mine Type: 'surface', 'underground', 'existing', 'predicted', or 'all'
3. Confidence: Filter predicted zones by confidence level (0-1)

When a user asks to filter the map, respond with a JSON object in this exact format:
{
  "action": {
    "name": "setMapFilters",
    "args": {
      "state": "state name or omit if not specified",
      "mineType": "surface/underground/existing/predicted/all or omit if not specified",
      "confidence": number between 0 and 1 or omit if not specified
    }
  }
}

If the user asks a general question about coal mining, the platform, or needs help, respond normally without the JSON format.

Examples:
- "Show me surface mines in Jharkhand" → {"action": {"name": "setMapFilters", "args": {"state": "Jharkhand", "mineType": "surface"}}}
- "Show predicted zones with high confidence" → {"action": {"name": "setMapFilters", "args": {"mineType": "predicted", "confidence": 0.8}}}
- "Filter by Odisha" → {"action": {"name": "setMapFilters", "args": {"state": "Odisha"}}}
- "Show underground mines" → {"action": {"name": "setMapFilters", "args": {"mineType": "underground"}}}
- "Reset the map" or "Show all mines" → {"action": {"name": "setMapFilters", "args": {"mineType": "all"}}}

Be concise and helpful. Always acknowledge the user's request before providing the action.`;

export const runChat = async (prompt: string): Promise<{ text?: string, action?: AiAction }> => {
    if (!genAI) {
        return { text: "Chatbot is currently unavailable. Please check the API key configuration." };
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        const chat = model.startChat({
            history: [
                {
                    role: 'user',
                    parts: [{ text: systemPrompt }],
                },
                {
                    role: 'model',
                    parts: [{ text: 'Understood. I will help users filter the coal mining map and answer questions about CoalSight AI.' }],
                },
            ],
        });

        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('Gemini response:', text);

        // Try to parse JSON action from the response
        const jsonMatch = text.match(/\{[\s\S]*"action"[\s\S]*\}/);
        if (jsonMatch) {
            console.log('Found JSON match:', jsonMatch[0]);
            try {
                const parsed = JSON.parse(jsonMatch[0]);
                console.log('Parsed action:', parsed);
                if (parsed.action) {
                    return { action: parsed.action, text: text.replace(jsonMatch[0], '').trim() };
                }
            } catch (e) {
                console.error('Failed to parse action JSON:', e);
            }
        } else {
            console.log('No JSON action found in response');
        }

        return { text };
    } catch (error) {
        console.error('Gemini API error:', error);
        if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }
        return { text: "I'm having trouble processing your request. Please try again or rephrase your question." };
    }
};
