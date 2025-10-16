import apiClient from './apiClient';

const BASE_URL = '/admin/roles';

/**
 * Fetches a list of all roles.
 * @returns {Promise<object>} The API response with the list of roles.
 */
export const getRoles = async () => {
    try {
        const response = await apiClient.get(BASE_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching roles:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Fetches the details of a single role.
 * @param {number|string} roleId - The ID of the role.
 * @returns {Promise<object>} The role data.
 */
export const getRoleDetails = async (roleId) => {
    try {
        const response = await apiClient.get(`${BASE_URL}/${roleId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching role details:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Creates a new role.
 * @param {object} roleData - The data for the new role (e.g., { name: 'new-role' }).
 * @returns {Promise<object>} The API response with the newly created role.
 */
export const createRole = async (roleData) => {
    try {
        const response = await apiClient.post(BASE_URL, roleData);
        return response.data;
    } catch (error) {
        console.error("Error creating role:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Updates an existing role.
 * @param {number|string} roleId - The ID of the role to update.
 * @param {object} roleData - The updated data for the role.
 * @returns {Promise<object>} The API response.
 */
export const updateRole = async (roleId, roleData) => {
    try {
        const response = await apiClient.put(`${BASE_URL}/${roleId}`, roleData);
        return response.data;
    } catch (error) {
        console.error("Error updating role:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Deletes a role.
 * @param {number|string} roleId - The ID of the role to delete.
 * @returns {Promise<object>} The API response.
 */
export const deleteRole = async (roleId) => {
    try {
        const response = await apiClient.delete(`${BASE_URL}/${roleId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting role:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};