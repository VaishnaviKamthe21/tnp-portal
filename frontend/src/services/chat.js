import api from './api';
import { getCurrentUser } from './auth';

export const askBot = async (question, history = []) => {
    const user = getCurrentUser();
    const response = await api.post('/chat/ask', {
        question,
        user_id: user?.id || null,
        history: history.map(m => ({
            role: m.type === 'user' ? 'user' : 'assistant',
            content: m.text,
        })),
    });
    return response.data;
};
