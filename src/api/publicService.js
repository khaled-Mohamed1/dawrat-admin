import apiClient from './apiClient';

/**
 * Fetches a list of all countries.
 * @returns {Promise<Array>} A promise that resolves to an array of country objects.
 */
export const getCountries = async () => {
    try {
        const response = await apiClient.get('/public/countries');
        return response.data.data || [];
    } catch (error) {
        console.error("Error fetching countries:", error.response?.data || error.message);
        return [];
    }
};