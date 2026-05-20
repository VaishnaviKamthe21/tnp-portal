import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot } from 'lucide-react';
import { getCurrentUser } from '../services/auth';

const FloatingChatbot = () => {
    const navigate = useNavigate();
    const user = getCurrentUser();
    const [isHovered, setIsHovered] = useState(false);

    // Only show for students
    if (!user || user.role !== 'student') {
        return null;
    }

    const handleClick = () => {
        navigate('/student/chatbot');
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <button
                onClick={handleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="w-14 h-14 bg-[#1a1a18] rounded-2xl shadow-xl flex items-center justify-center hover:bg-black hover:scale-105 transition-all duration-200 group relative"
                aria-label="Open AI Assistant"
            >
                <Bot className="w-6 h-6 text-[#f0f0ee]" />

                {/* Tooltip */}
                {isHovered && (
                    <div className="absolute bottom-full right-0 mb-3 px-4 py-2 bg-[#1a1a18] text-[#f0f0ee] text-xs font-bold uppercase tracking-widest rounded-xl whitespace-nowrap shadow-lg">
                        AI Assistant
                        <div className="absolute top-full right-5 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-[#1a1a18]" />
                    </div>
                )}
            </button>
        </div>
    );
};

export default FloatingChatbot;
