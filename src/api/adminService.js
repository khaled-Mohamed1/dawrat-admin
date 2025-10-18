import apiClient from './apiClient';

const BASE_URL = '/admin/admins';

/**
 * Fetches a list of all admins.
 * @returns {Promise<object>} The API response with the list of admins.
 */
export const getAdmins = async () => {
    try {
        const response = await apiClient.get(BASE_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching admins:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Fetches the details of a single admin.
 * @param {number|string} adminId - The ID of the admin.
 * @returns {Promise<object>} The admin data.
 */
export const getAdminDetails = async (adminId) => {
    try {
        const response = await apiClient.get(`${BASE_URL}/${adminId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching admin details:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Creates a new admin.
 * @param {object} adminData - The data for the new admin.
 * @returns {Promise<object>} The API response.
 */
export const createAdmin = async (adminData) => {
    try {
        const response = await apiClient.post(BASE_URL, adminData);
        return response.data;
    } catch (error) {
        console.error("Error creating admin:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Updates an existing admin.
 * @param {number|string} adminId - The ID of the admin to update.
 * @param {object} adminData - The updated data for the admin.
 * @returns {Promise<object>} The API response.
 */
export const updateAdmin = async (adminId, adminData) => {
    try {
        const response = await apiClient.put(`${BASE_URL}/${adminId}`, adminData);
        return response.data;
    } catch (error) {
        console.error("Error updating admin:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Deletes an admin.
 * @param {number|string} adminId - The ID of the admin to delete.
 * @returns {Promise<object>} The API response.
 */
export const deleteAdmin = async (adminId) => {
    try {
        const response = await apiClient.delete(`${BASE_URL}/${adminId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting admin:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};