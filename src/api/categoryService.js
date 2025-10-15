import apiClient from './apiClient';

const BASE_URL = '/admin/categories';

/**
 * Fetches a simple list of all categories for filtering.
 * @returns {Promise<Array>} A promise that resolves to an array of category objects.
 */
export const getAllCategories = async () => {
    try {
        const response = await apiClient.get(`${BASE_URL}/all-categories`);
        return response.data.data || [];
    } catch (error) {
        console.error("Error fetching all categories:", error.response?.data || error.message);
        return [];
    }
};