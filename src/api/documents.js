import apiClient from './client';

export const uploadDocument = async (userId, file) => {
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('file', file);

    const response = await apiClient.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const searchDocuments = async (userId, query) => {
    const response = await apiClient.get('/ask-bucket', {
        params: { userId, q: query },
    });
    return response.data;
};
