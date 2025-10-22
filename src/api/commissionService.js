import apiClient from './apiClient';

const BASE_URL = '/admin/commissions';

/**
 * Fetches a paginated and filtered list of commissions.
 * @param {object} params - The query parameters for filtering and pagination.
 * @returns {Promise<object>}
 */
export const getCommissions = async (params = {}) => {
    try {
        const response = await apiClient.get(BASE_URL, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching commissions:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Fetches the commission details for a single user.
 * @param {number|string} userId - The ID of the user.
 * @returns {Promise<object>}
 */
export const getCommissionDetails = async (userId) => {
    try {
        const response = await apiClient.get(`${BASE_URL}/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching commission details:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};