import apiClient from './apiClient';

const BASE_URL = '/admin/features';

/**
 * Fetches a list of all available features.
 * @param {object} params - Optional parameters like search or status.
 * @returns {Promise<Array>} A promise that resolves to an array of feature objects.
 */
export const getFeatures = async (params = {}) => {
    try {
        const response = await apiClient.get(BASE_URL, { params });
        return response.data.data || [];
    } catch (error){
        console.error("Error fetching features:", error.response?.data || error.message);
        return [];
    }
};