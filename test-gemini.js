import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyCwD0KQepOnSwzrU0Y6v84dqbD9A82DtW0';

async function testGemini() {
    console.log('Testing Gemini API...');
    
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const systemPrompt = `You are an AI assistant for CoalSight AI. When a user asks to filter the map, respond with:
{"action": {"name": "setMapFilters", "args": {"state": "Jharkhand", "mineType": "surface"}}}`;
    
    const chat = model.startChat({
        history: [
            {
                role: 'user',
                parts: [{ text: systemPrompt }],
            },
            {
                role: 'model',
                parts: [{ text: 'Understood.' }],
            },
        ],
    });
    
    const result = await chat.sendMessage('Show me surface mines in Jharkhand');
    const response = await result.response;
    const text = response.text();
    
    console.log('Response:', text);
}

testGemini().catch(console.error);
