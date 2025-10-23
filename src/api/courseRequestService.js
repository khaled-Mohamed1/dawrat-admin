import apiClient from './apiClient';

const BASE_URL = '/admin/course-request';

// Helper for file downloads
const handleFileDownload = (response, filename) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
};

/**
 * Fetches a paginated and filtered list of course demands.
 * @param {object} params - The query parameters for filtering.
 * @returns {Promise<object>}
 */
export const getCourseRequests = async (params = {}) => {
    try {
        const response = await apiClient.get(BASE_URL, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching course requests:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Fetches the details of a single course demand.
 * @param {number|string} id - The ID of the course demand.
 * @returns {Promise<object>}
 */
export const getCourseRequestDetails = async (id) => {
    try {
        const response = await apiClient.get(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching course request details:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Sets a course demand status to "Closed".
 * @param {number|string} id - The ID of the course demand.
 * @returns {Promise<object>}
 */
export const closeCourseRequest = async (id) => {
    try {
        const response = await apiClient.post(`${BASE_URL}/${id}/closed`);
        return response.data;
    } catch (error) {
        console.error("Error closing course request:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Fetches a list of users interested in a specific course demand.
 * @param {number|string} id - The ID of the course demand.
 * @returns {Promise<object>}
 */
export const getInterestedUsers = async (id) => {
    try {
        const response = await apiClient.get(`${BASE_URL}/${id}/interested-users`);
        return response.data;
    } catch (error) {
        console.error("Error fetching interested users:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Fetches a simple list of all course demands (for dropdowns, etc.).
 * @returns {Promise<Array>}
 */
export const getAllCourseRequests = async () => {
    try {
        const response = await apiClient.get(`${BASE_URL}/all-course-request`);
        return response.data.data || [];
    } catch (error) {
        console.error("Error fetching all course requests:", error.response?.data || error.message);
        return [];
    }
};

/**
 * Exports a list of course demands to an Excel file.
 * @param {object} params - The filter parameters.
 * @returns {Promise<void>}
 */
export const exportCourseRequests = async (params = {}) => {
    try {
        const response = await apiClient.get(`${BASE_URL}/export`, {
            params,
            responseType: 'blob',
        });
        handleFileDownload(response, `course-requests-export-${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
        console.error("Error exporting course requests:", error);
        throw new Error('Failed to export data.');
    }
};