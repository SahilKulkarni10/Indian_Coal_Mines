import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, AiAction } from '../types';
import { runChat } from '../services/geminiService';

interface ChatbotProps {
    onAiAction: (action: AiAction) => void;
}

const ChatbotIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9.47 14.12a.63.63 0 0 1-.03-.69c.1-.23.26-.43.46-.57.2-.14.43-.22.68-.22.43 0 .78.14 1.05.43.27.28.4.63.4 1.04 0 .4-.13.74-.4 1.02s-.63.42-1.07.42c-.22 0-.42-.06-.6-.18-.18-.12-.32-.28-.4-.48l-.02-.07zm5.06 0a.63.63 0 0 1-.03-.69c.1-.23.26-.43.46-.57.2-.14.43-.22.68-.22.43 0 .78.14 1.05.43.27.28.4.63.4 1.04 0 .4-.13.74-.4 1.02s-.63.42-1.07.42c-.22 0-.42-.06-.6-.18-.18-.12-.32-.28-.4-.48l-.02-.07zM12 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 4.5 12 4.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
);

const SendIcon = () => (
    <svg xmlns="http://www.w.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const Chatbot: React.FC<ChatbotProps> = ({ onAiAction }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', content: "Hello! I'm CoalSight AI's assistant. Ask me to filter the map, like 'Show me surface mines in Jharkhand'." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const newUserMessage: ChatMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, newUserMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await runChat(input);
            console.log('Chatbot received response:', response);
            if (response.action) {
                console.log('Calling onAiAction with:', response.action);
                onAiAction(response.action);
                 const confirmationMessage: ChatMessage = {
                    role: 'model',
                    content: `Sure, I've updated the map based on your request.`
                };
                setMessages(prev => [...prev, confirmationMessage]);
            } else if (response.text) {
                const newModelMessage: ChatMessage = { role: 'model', content: response.text };
                setMessages(prev => [...prev, newModelMessage]);
            }
        } catch (error) {
            console.error("Chatbot error:", error);
            const errorMessage: ChatMessage = { role: 'model', content: "Sorry, I encountered an error. Please try again." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110 z-50"
                aria-label="Toggle Chatbot"
            >
                {isOpen ? <CloseIcon /> : <ChatbotIcon />}
            </button>

            {isOpen && (
                <div className="fixed bottom-20 right-6 w-full max-w-md h-2/3 max-h-[600px] bg-white/95 backdrop-blur-md rounded-lg shadow-2xl flex flex-col z-40 border border-gray-200">
                    <header className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white text-lg font-semibold rounded-t-lg">
                        AI Assistant
                    </header>
                    <div className="flex-1 p-4 overflow-y-auto chatbot-messages space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`px-4 py-2 rounded-xl max-w-xs lg:max-w-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900 border border-gray-200'}`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="px-4 py-2 rounded-xl bg-gray-100 text-gray-900 border border-gray-200">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="p-4 bg-gray-50 rounded-b-lg border-t border-gray-200">
                        <div className="flex items-center bg-white rounded-full border border-gray-300">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="e.g., show predicted zones"
                                className="w-full bg-transparent px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none"
                                disabled={isLoading}
                                aria-label="Chat message input"
                            />
                            <button 
                                onClick={handleSend} 
                                className="p-2 text-blue-600 hover:text-blue-700 disabled:text-gray-400" 
                                disabled={isLoading}
                                aria-label="Send message"
                                title="Send message"
                            >
                                <SendIcon />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;
