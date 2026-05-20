import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
    Send, Bot, User, Loader2,
    ChevronRight, Code2, FileText, Brain, BookOpen,
    Search, CheckCircle2, Circle, PenTool, Shield,
    ExternalLink, ChevronDown, ChevronUp, Globe, Activity
} from 'lucide-react';
import { askBotStream } from '../services/chat';

/* ─────────────────────── Agent Config ─────────────────────── */
const AGENT_META = {
    research:  { label: 'Research Agent',  Icon: Search,   },
    cleaner:   { label: 'Cleaner Agent',   Icon: Activity, },
    verifier:  { label: 'Verifier Agent',  Icon: Shield,   },
    formatter: { label: 'Formatter Agent', Icon: PenTool,  },
};

/* ─────────────── Agent Pipeline Tracker Component ─────────── */
const AgentTracker = ({ agentSteps }) => {
    if (!agentSteps || agentSteps.length === 0) return null;

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', gap: '2px',
            padding: '16px 20px', borderRadius: '16px',
            background: '#ffffff',
            border: '1px solid #e0dfdb',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
            maxWidth: '380px',
        }}>
            <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                marginBottom: '10px', paddingBottom: '10px',
                borderBottom: '1px solid #f0f0ee',
            }}>
                <Activity size={14} style={{ color: '#8a8a84' }} />
                <span style={{
                    fontSize: '11px', fontWeight: 800, color: '#4a4a46',
                    textTransform: 'uppercase', letterSpacing: '1.5px',
                }}>
                    Agent Pipeline
                </span>
            </div>

            {agentSteps.map((step, idx) => {
                const meta = AGENT_META[step.agent] || AGENT_META.research;
                const { Icon } = meta;
                const isRunning = step.status === 'running';
                const isComplete = step.status === 'complete';
                const isLast = idx === agentSteps.length - 1;

                return (
                    <div key={`${step.agent}-${idx}`} style={{ display: 'flex', gap: '14px' }}>
                        {/* Timeline */}
                        <div style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            width: '24px', flexShrink: 0,
                        }}>
                            <div style={{
                                width: '24px', height: '24px', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: isComplete ? '#1a1a18' : isRunning ? '#e6e5e1' : '#f0f0ee',
                                border: `2px solid ${isComplete ? '#1a1a18' : isRunning ? '#a0a09b' : '#e0dfdb'}`,
                                transition: 'all 0.3s ease',
                            }}>
                                {isComplete ? (
                                    <CheckCircle2 size={12} style={{ color: '#f0f0ee' }} />
                                ) : isRunning ? (
                                    <Loader2 size={12} style={{ color: '#6b6b66', animation: 'spin 1s linear infinite' }} />
                                ) : (
                                    <Circle size={8} style={{ color: '#d0cfcb' }} />
                                )}
                            </div>
                            {!isLast && (
                                <div style={{
                                    width: '2px', flex: 1, minHeight: '12px',
                                    background: isComplete ? '#d0cfcb' : '#e0dfdb',
                                    transition: 'background 0.3s ease',
                                }} />
                            )}
                        </div>

                        {/* Content */}
                        <div style={{ paddingBottom: isLast ? '0' : '12px', flex: 1 }}>
                            <div style={{
                                fontSize: '12px', fontWeight: 700,
                                color: isRunning || isComplete ? '#1a1a18' : '#8a8a84',
                                transition: 'color 0.3s ease',
                                display: 'flex', alignItems: 'center', gap: '6px',
                            }}>
                                <Icon size={12} style={{
                                    color: isComplete ? '#4a4a46' : isRunning ? '#1a1a18' : '#a0a09b',
                                }} />
                                {meta.label}
                            </div>
                            <div style={{
                                fontSize: '11px', color: '#6b6b66', fontWeight: 500,
                                marginTop: '2px',
                                opacity: isRunning || isComplete ? 1 : 0.4,
                                transition: 'opacity 0.3s ease',
                            }}>
                                {step.message}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

/* ──────────────── Source Citations Component ───────────────── */
const SourceCitations = ({ sources }) => {
    const [expanded, setExpanded] = useState(false);

    if (!sources || sources.length === 0) return null;

    return (
        <div style={{
            marginTop: '10px', borderRadius: '12px',
            border: '1px solid #e0dfdb', overflow: 'hidden',
            background: '#ffffff',
        }}>
            <button
                onClick={() => setExpanded(!expanded)}
                style={{
                    width: '100%', padding: '8px 14px',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    fontSize: '11px', fontWeight: 700, color: '#4a4a46', textTransform: 'uppercase', letterSpacing: '0.5px'
                }}
            >
                <Globe size={12} style={{ color: '#8a8a84' }} />
                {sources.length} source{sources.length > 1 ? 's' : ''} cited
                {expanded ? <ChevronUp size={14} style={{ marginLeft: 'auto' }} /> : <ChevronDown size={14} style={{ marginLeft: 'auto' }} />}
            </button>

            {expanded && (
                <div style={{
                    padding: '4px 14px 12px',
                    display: 'flex', flexDirection: 'column', gap: '6px',
                }}>
                    {sources.map((src, i) => (
                        <a
                            key={i}
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                fontSize: '11px', color: '#1a1a18', fontWeight: 500,
                                textDecoration: 'none', padding: '6px 10px',
                                borderRadius: '8px', background: '#f0f0ee', border: '1px solid #e0dfdb',
                                transition: 'background 0.2s',
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#e6e5e1'}
                            onMouseOut={(e) => e.currentTarget.style.background = '#f0f0ee'}
                        >
                            <ExternalLink size={11} style={{ flexShrink: 0, color: '#8a8a84' }} />
                            <span style={{
                                overflow: 'hidden', textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}>
                                {src.title || src.url}
                            </span>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};


/* ────────────────────── Main Chatbot Page ─────────────────── */
const Chatbot = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            text: "Hi, I'm **CampusHire AI** — your placement prep assistant powered by a multi-agent pipeline.\n\nI can help you with:\n- **Interview Questions** — company-specific with live web search\n- **Resume Advice** and improvements\n- **Coding Problems** by topic and difficulty\n- **Aptitude Practice** — quant, logical, verbal\n- **Career Roadmaps** and skill guidance\n- **Company Info** — salary, process, eligibility\n\nTry asking about a specific company to see the agents in action.",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sources: [],
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [agentSteps, setAgentSteps] = useState([]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, agentSteps]);

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
        setAgentSteps([]);

        try {
            const historyForApi = updatedMessages.slice(1);

            await askBotStream(
                question,
                historyForApi,
                // onAgentStatus
                (status) => {
                    setAgentSteps(prev => {
                        const existing = prev.findIndex(
                            s => s.agent === status.agent && s.status === 'running'
                        );
                        if (existing >= 0 && status.status === 'complete') {
                            const updated = [...prev];
                            updated[existing] = status;
                            return updated;
                        }
                        if (status.status === 'running') {
                            const alreadyRunning = prev.find(
                                s => s.agent === status.agent && s.status === 'running'
                            );
                            if (alreadyRunning) return prev;
                        }
                        return [...prev, status];
                    });
                },
                // onResponse
                (data) => {
                    const botMessage = {
                        id: Date.now() + 1,
                        type: 'bot',
                        text: data.answer || "I'm having trouble processing that right now.",
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        sources: data.sources || [],
                        pipeline: data.pipeline || null,
                    };
                    setMessages(prev => [...prev, botMessage]);
                    setLoading(false);
                    setTimeout(() => setAgentSteps([]), 600);
                },
                // onError
                () => {
                    setMessages(prev => [...prev, {
                        id: Date.now() + 1,
                        type: 'bot',
                        text: "Something went wrong. Please try again.",
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        sources: [],
                    }]);
                    setLoading(false);
                    setAgentSteps([]);
                },
            );
        } catch {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: 'bot',
                text: "Something went wrong. Please try again.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                sources: [],
            }]);
            setLoading(false);
            setAgentSteps([]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSend();
    };

    const suggestedTopics = [
        { icon: Code2,    text: "TCS NQT coding questions with solutions" },
        { icon: FileText, text: "Infosys interview questions and hiring process" },
        { icon: Brain,    text: "Aptitude questions asked in Wipro placement drive" },
        { icon: BookOpen, text: "Deloitte salary and eligibility criteria" },
    ];

    return (
        <div className="w-full max-w-6xl mx-auto p-4 md:p-6 h-[calc(100vh-64px)] overflow-hidden flex flex-col">
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>

            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#e0dfdb] shadow-sm flex-1 flex flex-col overflow-hidden">

                {/* Header */}
                <div className="bg-[#1a1a18] px-6 py-4 flex items-center justify-between border-b border-[#e0dfdb]">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#f0f0ee] rounded-xl flex items-center justify-center">
                            <Bot className="w-5 h-5 text-[#1a1a18]" />
                        </div>
                        <div>
                            <h2 className="text-[#f0f0ee] font-extrabold text-sm tracking-widest uppercase">CampusHire AI</h2>
                            <span className="text-[#a0a09b] font-medium text-[11px] flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 bg-[#f0f0ee] rounded-full opacity-60" />
                                Multi-Agent Search Pipeline
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5 text-[#6b6b66] bg-[#2a2a26] px-3 py-1.5 rounded-lg border border-[#3a3a36]">
                        <Search size={14} />
                        <Activity size={14} />
                        <Shield size={14} />
                        <PenTool size={14} />
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-transparent">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] flex items-start gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                    msg.type === 'user' ? 'bg-[#1a1a18]' : 'bg-[#e6e5e1]'
                                }`}>
                                    {msg.type === 'user'
                                        ? <User className="w-4 h-4 text-[#f0f0ee]" />
                                        : <Bot className="w-4 h-4 text-[#1a1a18]" />
                                    }
                                </div>
                                <div>
                                    <div className={`p-5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                                        msg.type === 'user'
                                            ? 'bg-[#1a1a18] text-[#f0f0ee] rounded-tr-[4px]'
                                            : 'bg-white text-[#1a1a18] rounded-tl-[4px] border border-[#e0dfdb]'
                                    }`}>
                                        {msg.type === 'bot' ? (
                                            <div className="prose prose-p:text-[#1a1a18] prose-sm max-w-none prose-headings:text-[#1a1a18] prose-headings:font-extrabold prose-headings:text-base prose-p:mb-3 prose-li:mb-1 prose-code:bg-[#f0f0ee] prose-code:rounded-md prose-code:px-1.5 prose-code:py-0.5 prose-code:text-xs prose-pre:bg-[#1a1a18] prose-pre:text-[#f0f0ee] prose-pre:border prose-pre:border-[#4a4a46] prose-pre:rounded-xl prose-pre:text-xs prose-strong:text-[#1a1a18]">
                                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                                            </div>
                                        ) : (
                                            msg.text
                                        )}
                                        <div className={`text-[10px] mt-3 font-bold uppercase tracking-widest flex items-center justify-between ${msg.type === 'user' ? 'text-[#8a8a84]' : 'text-[#8a8a84]'}`}>
                                            <span>{msg.time}</span>
                                            {msg.pipeline && msg.pipeline.search_performed && (
                                                <span className="flex items-center gap-1.5 text-[#6b6b66] bg-[#f0f0ee] px-2 py-0.5 rounded">
                                                    <Globe size={10} />
                                                    web-sourced / {msg.pipeline.total_time}s
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {msg.type === 'bot' && msg.sources && msg.sources.length > 0 && (
                                        <SourceCitations sources={msg.sources} />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Live Agent Tracker */}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="max-w-[85%] flex items-start gap-3">
                                <div className="w-8 h-8 rounded-xl bg-[#e6e5e1] flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-[#1a1a18]" />
                                </div>
                                <div>
                                    {agentSteps.length > 0 ? (
                                        <AgentTracker agentSteps={agentSteps} />
                                    ) : (
                                        <div className="py-4 px-6 bg-white rounded-2xl rounded-tl-[4px] border border-[#e0dfdb] flex items-center gap-2 shadow-sm">
                                            <div className="w-2 h-2 bg-[#1a1a18] rounded-full animate-bounce" />
                                            <div className="w-2 h-2 bg-[#1a1a18] rounded-full animate-bounce [animation-delay:0.15s]" />
                                            <div className="w-2 h-2 bg-[#1a1a18] rounded-full animate-bounce [animation-delay:0.3s]" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Suggested Topics */}
                {messages.length <= 1 && (
                    <div className="px-6 py-5 bg-[#f0f0ee]/80 border-t border-[#e0dfdb]">
                        <p className="text-[10px] font-bold text-[#8a8a84] uppercase tracking-widest mb-3">
                            Quick Start Guide
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {suggestedTopics.map((topic, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSend(topic.text)}
                                    className="flex items-center gap-3 px-4 py-3 bg-white border border-[#e0dfdb] rounded-xl text-[13px] font-bold text-[#4a4a46] hover:border-[#1a1a18] hover:text-[#1a1a18] hover:shadow-sm transition-all text-left group"
                                >
                                    <topic.icon className="w-4 h-4 flex-shrink-0 text-[#8a8a84] group-hover:text-[#1a1a18] transition-colors" />
                                    <span className="flex-1">{topic.text}</span>
                                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#1a1a18]" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input */}
                <form onSubmit={handleSubmit} className="p-5 bg-white border-t border-[#e0dfdb] rounded-b-2xl">
                    <div className="flex items-center gap-3 bg-[#f0f0ee] rounded-xl p-1.5 border border-[#e0dfdb] focus-within:border-[#1a1a18] focus-within:ring-2 focus-within:ring-[#1a1a18]/10 transition-all">
                        <input
                            type="text"
                            placeholder="Ask about companies, interviews, coding, resume..."
                            className="flex-1 bg-transparent px-4 py-2.5 outline-none text-[#1a1a18] font-medium placeholder-[#8a8a84] text-[15px]"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || loading}
                            className="w-11 h-11 bg-[#1a1a18] text-[#f0f0ee] rounded-xl flex items-center justify-center hover:bg-black disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-[-2px] mt-[2px]" />}
                        </button>
                    </div>
                    <p className="text-[10px] text-[#8a8a84] mt-3 font-bold uppercase tracking-widest text-center">
                        Secure AI Pipeline: Research → Clean → Verify → Format
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Chatbot;
