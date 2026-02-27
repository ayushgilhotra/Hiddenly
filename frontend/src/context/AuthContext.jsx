import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

// Create the context
const AuthContext = createContext(null);

/**
 * LEARNING NOTE:
 * This is a Provider component. It wraps the entire app and shares the "user" state.
 * We use localStorage to persist the user even if they refresh the page.
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in on mount
        const storedUser = localStorage.getItem('userData');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { accessToken, refreshToken, userName, userEmail } = response.data;

        const userData = { name: userName, email: userEmail };
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userData', JSON.stringify(userData));

        setUser(userData);
        return response.data;
    };

    const register = async (name, email, password) => {
        const response = await api.post('/auth/register', { name, email, password });
        const { accessToken, refreshToken, userName, userEmail } = response.data;

        const userData = { name: userName, email: userEmail };
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userData', JSON.stringify(userData));

        setUser(userData);
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the context
export const useAuth = () => useContext(AuthContext);
