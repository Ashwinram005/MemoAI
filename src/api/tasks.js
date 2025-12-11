import apiClient from './client';

export const createTask = async ({ userId, title, status, dueDate }) => {
    const response = await apiClient.post('/task', { userId, title, status, dueDate });
    return response.data;
};

export const getTaskSummary = async (userId, weekStart, weekEnd) => {
    const response = await apiClient.get('/task-summary', {
        params: { userId, weekStart, weekEnd },
    });
    return response.data;
};
