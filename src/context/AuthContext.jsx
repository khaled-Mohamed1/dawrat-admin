import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../api/apiClient';

// 1. Create the context
const AuthContext = createContext(null);

// 2. Create the AuthProvider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    // On initial load, check for a user object in storage to prevent screen flicker
    const [isLoading, setIsLoading] = useState(true);

    // Effect to verify token and load user data on app start
    useEffect(() => {
        const loadUserFromStorage = () => {
            const storedToken = localStorage.getItem('authToken');
            const storedUser = localStorage.getItem('authUser');

            if (storedToken && storedUser) {
                setUser(JSON.parse(storedUser));
            }
            setIsLoading(false); // Finished checking, stop loading
        };

        loadUserFromStorage();
    }, []);

    // Login function
    const login = async (email, password) => {
        try {
            const response = await apiClient.post('/auth/login', { email, password });

            if (response.data.success) {
                // The API response nests the user and token inside the 'data' object
                const { id, name, email: userEmail, type } = response.data.data;
                const token = response.data.data.token;
                const userData = { id, name, email: userEmail, type };

                // Store user data in state
                setUser(userData);

                // Persist token and user data in localStorage
                localStorage.setItem('authToken', token);
                localStorage.setItem('authUser', JSON.stringify(userData));

                return userData;
            } else {
                // Handle cases where API returns success: false
                throw new Error(response.data.message || 'Login failed');
            }
        } catch (error) {
            console.error("Login failed in AuthContext:", error);
            // Re-throw a more user-friendly error
            throw new Error(error.response?.data?.message || 'Invalid credentials or server error.');
        }
    };

    // Logout function
    const logout = () => {
        // Clear state
        setUser(null);

        // Clear from localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
    };

    // The value provided to the context consumers
    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user, // True if user object exists
        isLoading, // Provide loading state for protected routes
    };

    // Don't render children until we've checked for a user session
    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

// 3. Create a custom hook for easy access to the context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

