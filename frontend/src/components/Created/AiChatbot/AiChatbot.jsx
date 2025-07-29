import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import MarkdownRenderer from './MarkdownRenderer';

import { FaRobot } from "react-icons/fa";
const AiChatbot = () => {
    const [prompt, setPrompt] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        const userMessage = { text: prompt, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setPrompt('');
        setIsLoading(true);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/v1/ai/analyze/', {
                prompt: prompt
            });

            const aiMessage = { text: response.data.response, sender: 'ai' };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage = { text: 'Error processing your request', sender: 'ai' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen max-w-5xl mx-auto px-6 py-4 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 shadow-xl rounded-lg border border-slate-700">
            <div className="flex items-center justify-center gap-3 mb-6">
                <FaRobot className="text-5xl text-green-400 animate-pulse" />
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
                    Ask AI
                </h1>
            </div>

            <div className="flex-grow overflow-auto mb-4 p-4 bg-gray-100 rounded-lg shadow-inner">
                <ul>
                    {messages.map((message, index) => (
                        <React.Fragment key={index}>
                            <li className="flex items-start space-x-4 mb-4 transition-all duration-300">
                                <div className={`rounded-full w-10 h-10 flex items-center justify-center text-white font-bold ring-2 ring-offset-2 ${message.sender === 'user' ? 'bg-gradient-to-tr from-blue-500 to-purple-600 ring-blue-400' : 'bg-gradient-to-tr from-green-400 to-teal-500 ring-green-300'}`}>
                                    {message.sender === 'user' ? 'U' : 'B'}
                                </div>
                                <div>
                                    <div className="font-semibold mb-1 text-gray-700">
                                        {message.sender === 'user' ? 'You' : 'AI Assistant'}
                                    </div>
                                    <div className="text-sm text-gray-900 whitespace-pre-wrap p-3 bg-white rounded-md shadow-md">
                                        <MarkdownRenderer>
                                            {message.text.replace(/(\[.*?\])/g, "$1\n")}
                                        </MarkdownRenderer>
                                    </div>
                                </div>
                            </li>
                            <hr className="border-gray-300 ml-14" />
                        </React.Fragment>
                    ))}
                    {isLoading && (
                        <div className="flex justify-center p-2">
                            <CircularProgress size={24} />
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </ul>
            </div>

            <form onSubmit={handleSubmit} className="flex mt-4">
                <input
                    type="text"
                    placeholder="Type your prompt here..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="flex-grow px-4 py-3 rounded-l-full bg-white text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-r-full flex items-center justify-center transition duration-300 hover:scale-105"
                >
                    <SendIcon />
                </button>
            </form>
        </div>
    );
};

export default AiChatbot;