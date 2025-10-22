import apiClient from './apiClient';

const BASE_URL = '/admin/center-requests';

/**
 * Fetches a paginated list of center registration requests.
 * @param {object} params - The query parameters for pagination.
 * @returns {Promise<object>}
 */
export const getCenterRequests = async (params = {}) => {
    try {
        const response = await apiClient.get(BASE_URL, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching center requests:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Fetches the details of a single registration request.
 * @param {number|string} id - The ID of the request.
 * @returns {Promise<object>}
 */
export const getCenterRequestDetails = async (id) => {
    try {
        const response = await apiClient.get(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching request details:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Deletes a center registration request.
 * @param {number|string} id - The ID of the request to delete.
 * @returns {Promise<object>}
 */
export const deleteCenterRequest = async (id) => {
    try {
        const response = await apiClient.delete(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting request:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Approves a center registration request.
 * @param {number|string} id - The ID of the request to approve.
 * @returns {Promise<object>}
 */
export const approveCenterRequest = async (id) => {
    try {
        const response = await apiClient.post(`${BASE_URL}/${id}/approve`);
        return response.data;
    } catch (error) {
        console.error("Error approving request:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Rejects a center registration request.
 * @param {number|string} id - The ID of the request to reject.
 * @param {object} data - The rejection data, including the reason.
 * @param {string} data.rejection_reason - The reason for rejection.
 * @returns {Promise<object>}
 */
export const rejectCenterRequest = async (id, { rejection_reason }) => {
    try {
        const response = await apiClient.post(`${BASE_URL}/${id}/reject`, { rejection_reason });
        return response.data;
    } catch (error) {
        console.error("Error rejecting request:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};