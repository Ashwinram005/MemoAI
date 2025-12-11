import apiClient from './client';

export const sendMessage = async (userId, sessionId, message) => {
    const response = await apiClient.post('/chat', { userId, sessionId, message });
    return response.data;
};
