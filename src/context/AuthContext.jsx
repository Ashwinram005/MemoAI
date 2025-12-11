import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, signup as apiSignup, logout as apiLogout } from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const email = localStorage.getItem('userEmail');
        const name = localStorage.getItem('userName');

        if (userId) {
            setUser({ userId, email, name });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const data = await apiLogin(email, password);
        setUser(data);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userName', data.name);
        return data;
    };

    const signup = async (name, email, password) => {
        const data = await apiSignup(name, email, password);
        setUser(data);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userName', data.name);
        return data;
    };

    const logout = () => {
        apiLogout();
        setUser(null);
    };

    const value = {
        user,
        login,
        signup,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
