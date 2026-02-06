import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, X, MessageCircle } from 'lucide-react';
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
                className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-2xl shadow-blue-500/30 flex items-center justify-center hover:scale-110 transition-all duration-300 group relative"
                aria-label="Open AI Assistant"
            >
                <Bot className="w-8 h-8 text-white" />

                {/* Pulse animation */}
                <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></span>

                {/* Tooltip */}
                {isHovered && (
                    <div className="absolute bottom-full right-0 mb-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl whitespace-nowrap shadow-lg">
                        AI Assistant
                        <div className="absolute top-full right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900"></div>
                    </div>
                )}
            </button>
        </div>
    );
};

export default FloatingChatbot;
