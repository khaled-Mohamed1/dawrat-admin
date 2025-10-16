import apiClient from './apiClient';

const BASE_URL = '/admin/categories';

/**
 * Fetches a paginated and filtered list of categories.
 * @param {object} params - The query parameters (search, status, page).
 * @returns {Promise<object>} The API response.
 */
export const getCategories = async (params = {}) => {
    try {
        const response = await apiClient.get(BASE_URL, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Fetches a list of all categories for dropdowns (no pagination).
 * @returns {Promise<Array>} An array of category objects.
 */
export const getAllCategories = async () => {
    try {
        const response = await apiClient.get(`${BASE_URL}/all-categories`);
        return response.data.data || [];
    } catch (error) {
        console.error("Error fetching all categories:", error.response?.data || error.message);
        return [];
    }
};

/**
 * Fetches the details of a single category.
 * @param {number|string} categoryId - The ID of the category.
 * @returns {Promise<object>} The category data.
 */
export const getCategoryDetails = async (categoryId) => {
    try {
        const response = await apiClient.get(`${BASE_URL}/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching category details:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Creates a new category.
 * @param {object} categoryData - The data for the new category.
 * @returns {Promise<object>} The API response.
 */
export const createCategory = async (categoryData) => {
    try {
        const response = await apiClient.post(BASE_URL, categoryData);
        return response.data;
    } catch (error) {
        console.error("Error creating category:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Updates an existing category.
 * @param {number|string} categoryId - The ID of the category.
 * @param {object} categoryData - The updated data.
 * @returns {Promise<object>} The API response.
 */
export const updateCategory = async (categoryId, categoryData) => {
    try {
        const response = await apiClient.put(`${BASE_URL}/${categoryId}`, categoryData);
        return response.data;
    } catch (error) {
        console.error("Error updating category:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Deletes a category.
 * @param {number|string} categoryId - The ID of the category.
 * @returns {Promise<object>} The API response.
 */
export const deleteCategory = async (categoryId) => {
    try {
        const response = await apiClient.delete(`${BASE_URL}/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting category:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Toggles the status of a category.
 * @param {number|string} categoryId - The ID of the category.
 * @param {object} statusData - The new status (e.g., { status: 1 }).
 * @returns {Promise<object>} The API response.
 */
export const changeCategoryStatus = async (categoryId, statusData) => {
    try {
        const response = await apiClient.patch(`${BASE_URL}/${categoryId}/status`, statusData);
        return response.data;
    } catch (error) {
        console.error("Error changing category status:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};