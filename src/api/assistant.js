import apiClient from './client';

// Content Analysis & Task Extraction
export const extractTasksFromText = async (userId, text) => {
    const response = await apiClient.post('/analyze/extract-tasks', { userId, text });
    return response.data;
};

// Daily Briefing
export const getDailyBriefing = async (userId) => {
    const response = await apiClient.get('/assistant/briefing', {
        params: { userId }
    });
    return response.data;
};

// Idea Incubator
export const brainstormIdea = async (userId, idea) => {
    const response = await apiClient.post('/assistant/brainstorm', { userId, idea });
    return response.data;
};

// Quick Capture
export const quickCapture = async (userId, input) => {
    const response = await apiClient.post('/assistant/quick-capture', { userId, input });
    return response.data;
};

// Productivity Insights
export const getProductivityInsights = async (userId) => {
    const response = await apiClient.get('/assistant/insights', {
        params: { userId }
    });
    return response.data;
};
