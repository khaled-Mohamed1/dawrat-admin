import apiClient from './apiClient';

const BASE_URL = '/admin/contact-us';

/**
 * Fetches a paginated list of contact us submissions.
 * @param {object} params - The query parameters for pagination.
 * @returns {Promise<object>}
 */
export const getContactSubmissions = async (params = {}) => {
    try {
        const response = await apiClient.get(BASE_URL, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching contact submissions:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Fetches the details of a single submission.
 * @param {number|string} id - The ID of the submission.
 * @returns {Promise<object>}
 */
export const getContactSubmissionDetails = async (id) => {
    try {
        const response = await apiClient.get(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching submission details:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Deletes a contact us submission.
 * @param {number|string} id - The ID of the submission to delete.
 * @returns {Promise<object>}
 */
export const deleteContactSubmission = async (id) => {
    try {
        const response = await apiClient.delete(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting submission:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};