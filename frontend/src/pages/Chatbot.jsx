import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
    Send, Bot, User, Loader2, Sparkles,
    ChevronRight, Code2, FileText, Brain, BookOpen
} from 'lucide-react';
import { askBot } from '../services/chat';

const Chatbot = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            text: "Hi! I'm **CampusHire AI** — your personal placement prep assistant.\n\nI can help you with:\n- 🎯 **Interview Questions** (domain-specific)\n- 📝 **Resume Advice** & improvements\n- 💻 **Coding Problems** by topic & difficulty\n- 🧠 **Aptitude Practice** (quant, logical, verbal)\n- 🗺️ **Career Roadmaps** & skill guidance\n\nWhat would you like to work on?",
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

    const handleSend = async (text) => {
        const question = text || input;
        if (!question.trim() || loading) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            text: question,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput('');
        setLoading(true);

        try {
            // Send conversation history (skip the initial bot greeting)
            const historyForApi = updatedMessages.slice(1);
            const response = await askBot(question, historyForApi);
            const botMessage = {
                id: Date.now() + 1,
                type: 'bot',
                text: response.answer || "I'm having trouble processing that right now.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (err) {
            console.error('Chat error:', err);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: 'bot',
                text: "Sorry, I'm having trouble connecting. Please try again in a moment.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSend();
    };

    const suggestedTopics = [
        { icon: Code2, text: "Give me 5 medium-level DSA problems on trees" },
        { icon: FileText, text: "Review my resume for a software engineer role" },
        { icon: Brain, text: "Ask me aptitude questions with solutions" },
        { icon: BookOpen, text: "Top interview questions for React developer" },
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-6 h-[calc(100vh-64px-32px)] overflow-hidden flex flex-col">
            <div className="bg-white rounded-3xl shadow-2xl shadow-blue-500/10 border border-gray-100 flex-1 flex flex-col overflow-hidden">

                {/* Chat Header */}
                <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-white font-bold leading-none">CampusHire AI</h2>
                            <span className="text-blue-100 text-xs flex items-center gap-1 mt-1">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                Powered by Llama 3.3 • Career-focused
                            </span>
                        </div>
                    </div>
                    <Sparkles className="w-5 h-5 text-blue-200" />
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] flex items-start gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    msg.type === 'user' ? 'bg-blue-100' : 'bg-gradient-to-br from-blue-100 to-indigo-100'
                                }`}>
                                    {msg.type === 'user'
                                        ? <User className="w-4 h-4 text-blue-600" />
                                        : <Bot className="w-4 h-4 text-blue-600" />
                                    }
                                </div>
                                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                    msg.type === 'user'
                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                        : 'bg-gray-50 text-gray-800 rounded-tl-none border border-gray-100'
                                }`}>
                                    {msg.type === 'bot' ? (
                                        <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-headings:text-sm prose-p:mb-2 prose-li:mb-0.5 prose-code:bg-gray-200 prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:text-xs prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:text-xs prose-strong:text-gray-900">
                                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                                        </div>
                                    ) : (
                                        msg.text
                                    )}
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
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="py-3 px-5 bg-gray-50 rounded-2xl rounded-tl-none border border-gray-100 flex items-center gap-1.5">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Suggested Topics */}
                {messages.length < 3 && (
                    <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-50">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Quick Start:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {suggestedTopics.map((topic, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSend(topic.text)}
                                    className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/50 transition-all text-left group"
                                >
                                    <topic.icon className="w-4 h-4 flex-shrink-0 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                    <span className="flex-1">{topic.text}</span>
                                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input Area */}
                <form onSubmit={handleSubmit} className="p-5 bg-white border-t border-gray-50">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-2xl p-2 border border-gray-200 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
                        <input
                            type="text"
                            placeholder="Ask about interviews, coding, resume, aptitude..."
                            className="flex-1 bg-transparent px-3 py-2 outline-none text-gray-800 placeholder-gray-400 text-sm"
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
                    <p className="text-[10px] text-gray-400 mt-2 text-center">
                        CampusHire AI only answers career & placement related questions.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Chatbot;
