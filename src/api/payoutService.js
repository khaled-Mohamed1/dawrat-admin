import apiClient from './apiClient';

const BASE_URL = '/admin/payout-batches';

/**
 * Fetches a paginated and filtered list of payout batches.
 * @param {object} params - The query parameters for filtering.
 * @returns {Promise<object>}
 */
export const getPayouts = async (params = {}) => {
    try {
        const response = await apiClient.get(BASE_URL, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching payouts:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Fetches the details of a single payout batch.
 * @param {number|string} id - The ID of the payout batch.
 * @returns {Promise<object>}
 */
export const getPayoutDetails = async (id) => {
    try {
        const response = await apiClient.get(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching payout details:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Locks a payout batch. (Status must be 'Draft')
 * @param {number|string} id - The ID of the payout batch.
 * @returns {Promise<object>}
 */
export const lockPayout = async (id) => {
    try {
        const response = await apiClient.post(`${BASE_URL}/${id}/lock`);
        return response.data;
    } catch (error) {
        console.error("Error locking payout:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Marks a payout batch as sent. (Status must be 'Locked')
 * @param {number|string} id - The ID of the payout batch.
 * @returns {Promise<object>}
 */
export const sendPayout = async (id) => {
    try {
        const response = await apiClient.post(`${BASE_URL}/${id}/send`);
        return response.data;
    } catch (error) {
        console.error("Error sending payout:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Retries a failed payout batch. (Status must be 'Failed')
 * @param {number|string} id - The ID of the payout batch.
 * @returns {Promise<object>}
 */
export const retryPayout = async (id) => {
    try {
        const response = await apiClient.post(`${BASE_URL}/${id}/retry`);
        return response.data;
    } catch (error) {
        console.error("Error retrying payout:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};