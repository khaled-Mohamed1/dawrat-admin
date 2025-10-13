import apiClient from './apiClient';

/**
 * Fetches a paginated and filtered list of users.
 * @param {object} params - The query parameters.
 * @param {number} params.page - The page number for pagination.
 * @param {string} params.status - The user status to filter by ('1' or '0').
 * @param {string} params.role - The user role to filter by.
 * @param {string} params.search - The search query.
 * @returns {Promise<object>} The full API response including data, links, and meta.
 */
export const getUsers = async ({ page = 1, status = '', role = '', search = '' }) => {
    try {
        const params = { page };
        if (status) params.status = status;
        if (role) params.role = role;
        if (search) params.search = search;

        const response = await apiClient.get('/admin/users', { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Resets a user's password.
 * @param {number} userId - The ID of the user.
 * @param {string} password - The new password.
 * @returns {Promise<object>} The API response.
 */
export const resetUserPassword = async (userId, password) => {
    try {
        const response = await apiClient.post(`/admin/reset-password/${userId}`, { password });
        return response.data;
    } catch (error) {
        console.error("Error resetting password:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Toggles a user's status between Active and Inactive.
 * @param {number} userId - The ID of the user.
 * @param {boolean} force - If true, forces the status change despite warnings.
 * @returns {Promise<object>} The API response.
 */
export const toggleUserStatus = async (userId, force = false) => {
    try {
        const response = await apiClient.post(`/admin/status-users/${userId}`, {
            _method: 'put',
            force: force,
        });
        return response.data;
    } catch (error) {
        console.error("Error toggling user status:", error.response?.data || error.message);
        throw error.response;
    }
};

/**
 * Deletes a user (soft delete).
 * @param {number} userId - The ID of the user to delete.
 * @returns {Promise<object>} The API response.
 */
export const deleteUser = async (userId) => {
    try {
        const response = await apiClient.delete(`/admin/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting user:", error.response?.data || error.message);
        throw error.response;
    }
}