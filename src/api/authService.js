import apiClient from './apiClient';

/**
 * Logs in a user.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} The response data from the API, including user and token.
 */
export const login = async (email, password) => {
    try {
        const response = await apiClient.post('/auth/login', {
            email,
            password,
        });
        return response.data;
    } catch (error) {
        console.error("Login failed:", error.response?.data?.message || error.message);
        throw error.response?.data || new Error("An unknown error occurred");
    }
};

/**
 * Logs out the current user by invalidating the token on the server.
 * The token is sent automatically in the headers by our apiClient.
 * @returns {Promise<object>} The response from the API.
 */
export const logout = async () => {
    try {
        const response = await apiClient.post('/auth/logout');
        return response.data;
    } catch (error) {
        console.error("Server logout failed:", error.response?.data?.message || error.message);
        throw error;
    }
};