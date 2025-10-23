import apiClient from './apiClient';

const BASE_URL = '/admin/sections';

/**
 * Fetches a list of sections.
 * @param {object} params - The query parameters for pagination.
 * @returns {Promise<object>}
 */
export const getSections = async (params = {}) => {
    try {
        const response = await apiClient.get(BASE_URL, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching sections:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Fetches the details of a single section.
 * @param {number|string} id - The ID of the section.
 * @returns {Promise<object>}
 */
export const getSectionDetails = async (id) => {
    try {
        const response = await apiClient.get(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching section details:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Creates a new section.
 * @param {object} data - The data for the new section.
 * @returns {Promise<object>}
 */
export const createSection = async (data) => {
    try {
        const response = await apiClient.post(BASE_URL, data);
        return response.data;
    } catch (error) {
        console.error("Error creating section:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Updates an existing section.
 * @param {number|string} id - The ID of the section.
 * @param {object} data - The updated data.
 * @returns {Promise<object>}
 */
export const updateSection = async (id, data) => {
    try {
        const response = await apiClient.put(`${BASE_URL}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating section:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Deletes a section.
 * @param {number|string} id - The ID of the section.
 * @returns {Promise<object>}
 */
export const deleteSection = async (id) => {
    try {
        const response = await apiClient.delete(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting section:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Toggles the status of a section.
 * @param {number|string} id - The ID of the section.
 * @param {object} statusData - e.g., { status: true }
 * @returns {Promise<object>}
 */
export const changeSectionStatus = async (id, statusData) => {
    try {
        // Note: Your route was 'put'
        const response = await apiClient.put(`/admin/status-sections/${id}`, statusData);
        return response.data;
    } catch (error) {
        console.error("Error changing section status:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Updates the display order of all sections.
 * @param {Array<number>} orderArray - An array of section IDs in the new order.
 * @returns {Promise<object>}
 */
export const updateSectionOrder = async (orderArray) => {
    try {
        const response = await apiClient.patch('/admin/order-sections', { order: orderArray });
        return response.data;
    } catch (error) {
        console.error("Error updating section order:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};