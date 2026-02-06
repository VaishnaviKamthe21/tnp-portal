import { useState, useRef, useEffect } from 'react';
import {
    Send,
    Bot,
    User,
    Loader2,
    Sparkles,
    MessageSquare,
    ChevronRight,
    Search
} from 'lucide-react';
import { askBot } from '../services/chat';

const Chatbot = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            text: "Hello! I'm your AI Career Assistant. How can I help you with your placement journey today?",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            text: input,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await askBot(userMessage.text);
            const botMessage = {
                id: Date.now() + 1,
                type: 'bot',
                text: response.answer || "I'm having trouble processing that right now.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (err) {
            console.error('Chat error:', err);
            const errorMessage = {
                id: Date.now() + 1,
                type: 'bot',
                text: "Sorry, I'm offline at the moment. Please try again later.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const suggestedTopics = [
        "How to improve my resume?",
        "Top coding skills for 2024",
        "How to prepare for interviews?",
        "Recommend jobs for me"
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-64px-64px)] overflow-hidden flex flex-col">
            <div className="bg-white rounded-3xl shadow-2xl shadow-blue-500/10 border border-gray-100 flex-1 flex flex-col overflow-hidden">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-white font-bold leading-none">Career Assistant</h2>
                            <span className="text-blue-100 text-xs flex items-center gap-1 mt-1">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                Online & Ready to help
                            </span>
                        </div>
                    </div>
                    <Sparkles className="w-5 h-5 text-blue-200" />
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] flex items-start gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.type === 'user' ? 'bg-blue-100' : 'bg-gray-100'
                                    }`}>
                                    {msg.type === 'user' ? <User className="w-4 h-4 text-blue-600" /> : <Bot className="w-4 h-4 text-gray-600" />}
                                </div>
                                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.type === 'user'
                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                        : 'bg-gray-50 text-gray-800 rounded-tl-none border border-gray-100'
                                    }`}>
                                    {msg.text}
                                    <div className={`text-[10px] mt-2 ${msg.type === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                                        {msg.time}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="max-w-[80%] flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-gray-600" />
                                </div>
                                <div className="py-3 px-4 bg-gray-50 rounded-2xl rounded-tl-none border border-gray-100 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Suggested Topics (if few messages) */}
                {messages.length < 3 && (
                    <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-50">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Try asking about:</p>
                        <div className="flex flex-wrap gap-2">
                            {suggestedTopics.map((topic, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setInput(topic)}
                                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-all flex items-center gap-1 group"
                                >
                                    {topic}
                                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input Area */}
                <form onSubmit={handleSend} className="p-6 bg-white border-t border-gray-50">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-2xl p-2 border border-gray-200 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
                        <input
                            type="text"
                            placeholder="Type your question..."
                            className="flex-1 bg-transparent px-3 py-2 outline-none text-gray-800 placeholder-gray-400"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || loading}
                            className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Chatbot;
