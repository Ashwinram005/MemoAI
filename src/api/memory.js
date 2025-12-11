import apiClient from './client';

export const getMemory = async (userId) => {
    const response = await apiClient.get('/memory', {
        params: { userId },
    });
    return response.data;
};
