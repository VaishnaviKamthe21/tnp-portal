/**
 * Chat service — SSE stream consumer for the agentic AI pipeline.
 *
 * Instead of a single JSON response, the backend now streams
 * Server-Sent Events with live agent status updates.
 */

import { getCurrentUser } from './auth';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Stream-based chat call.
 *
 * @param {string}   question       The user's question
 * @param {Array}    history        Conversation history
 * @param {Function} onAgentStatus  Called for each agent status event
 * @param {Function} onResponse     Called once with the final response
 * @param {Function} onError        Called if something goes wrong
 */
export const askBotStream = async (
    question,
    history = [],
    onAgentStatus,
    onResponse,
    onError,
) => {
    const user = getCurrentUser();

    try {
        const res = await fetch(`${API_BASE}/chat/ask`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question,
                user_id: user?.id || null,
                history: history.map((m) => ({
                    role: m.type === 'user' ? 'user' : 'assistant',
                    content: m.text,
                })),
            }),
        });

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            // SSE frames are delimited by double-newline
            const frames = buffer.split('\n\n');
            buffer = frames.pop() || '';

            for (const frame of frames) {
                if (!frame.trim()) continue;

                let eventType = '';
                let eventData = '';

                for (const line of frame.split('\n')) {
                    if (line.startsWith('event: ')) {
                        eventType = line.slice(7).trim();
                    } else if (line.startsWith('data: ')) {
                        eventData = line.slice(6);
                    }
                }

                if (!eventType || !eventData) continue;

                try {
                    const data = JSON.parse(eventData);

                    if (eventType === 'agent_status' && onAgentStatus) {
                        onAgentStatus(data);
                    } else if (eventType === 'response' && onResponse) {
                        onResponse(data);
                    }
                    // 'done' event is a no-op on the client
                } catch {
                    console.warn('Failed to parse SSE data:', eventData);
                }
            }
        }
    } catch (err) {
        console.error('Chat stream error:', err);
        if (onError) onError(err);
    }
};
