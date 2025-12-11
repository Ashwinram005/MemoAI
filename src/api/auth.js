import apiClient from './client';

export const login = async (email, password) => {
    const response = await apiClient.post('/login', { email, password });
    return response.data;
};

export const signup = async (name, email, password) => {
    const response = await apiClient.post('/signup', { name, email, password });
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
};
