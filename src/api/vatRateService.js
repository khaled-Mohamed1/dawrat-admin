import apiClient from './apiClient';

const BASE_URL = '/admin/vat-rates';

/**
 * Fetches a paginated list of VAT rates.
 * @param {object} params - The query parameters for pagination.
 * @returns {Promise<object>}
 */
export const getVatRates = async (params = {}) => {
    try {
        const response = await apiClient.get(BASE_URL, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching VAT rates:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Fetches the details of a single VAT rate.
 * @param {number|string} id - The ID of the VAT rate.
 * @returns {Promise<object>}
 */
export const getVatRateDetails = async (id) => {
    try {
        const response = await apiClient.get(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching VAT rate details:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Creates a new VAT rate.
 * @param {object} data - The data for the new rate.
 * @returns {Promise<object>}
 */
export const createVatRate = async (data) => {
    try {
        const response = await apiClient.post(BASE_URL, data);
        return response.data;
    } catch (error) {
        console.error("Error creating VAT rate:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Updates an existing VAT rate.
 * @param {number|string} id - The ID of the rate to update.
 * @param {object} data - The updated data.
 * @returns {Promise<object>}
 */
export const updateVatRate = async (id, data) => {
    try {
        const response = await apiClient.put(`${BASE_URL}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating VAT rate:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Deletes a VAT rate.
 * @param {number|string} id - The ID of the rate to delete.
 * @returns {Promise<object>}
 */
export const deleteVatRate = async (id) => {
    try {
        const response = await apiClient.delete(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting VAT rate:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};