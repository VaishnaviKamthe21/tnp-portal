import api from './api';

export const askBot = async (question) => {
    const params = new URLSearchParams({ question });
    const response = await api.post(`/chat/ask?${params.toString()}`);
    return response.data;
};
