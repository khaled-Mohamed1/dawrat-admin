import apiClient from './apiClient';

const BASE_URL = '/admin/features';

// === Main Feature Resource (CRUD) ===

/**
 * Fetches a list of all available features.
 * @param {object} params - Optional parameters like search or status.
 * @returns {Promise<Array>} A promise that resolves to an array of feature objects.
 */
export const getFeatures = async (params = {}) => {
    try {
        const response = await apiClient.get(BASE_URL, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching features:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Fetches the details of a single feature.
 * @param {number|string} featureId - The ID of the feature.
 * @returns {Promise<object>} The feature data.
 */
export const getFeatureDetails = async (featureId) => {
    try {
        const response = await apiClient.get(`${BASE_URL}/${featureId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching feature details:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Creates a new feature.
 * @param {object} featureData - The data for the new feature.
 * @returns {Promise<object>} The API response with the newly created feature.
 */
export const createFeature = async (featureData) => {
    try {
        const response = await apiClient.post(BASE_URL, featureData);
        return response.data;
    } catch (error) {
        console.error("Error creating feature:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Updates an existing feature.
 * @param {number|string} featureId - The ID of the feature to update.
 * @param {object} featureData - The updated data for the feature.
 * @returns {Promise<object>} The API response.
 */
export const updateFeature = async (featureId, featureData) => {
    try {
        // Using PUT for a full resource update as per REST conventions
        const response = await apiClient.put(`${BASE_URL}/${featureId}`, featureData);
        return response.data;
    } catch (error) {
        console.error("Error updating feature:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Deletes a feature.
 * @param {number|string} featureId - The ID of the feature to delete.
 * @returns {Promise<object>} The API response.
 */
export const deleteFeature = async (featureId) => {
    try {
        const response = await apiClient.delete(`${BASE_URL}/${featureId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting feature:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};


// === Custom Feature Actions ===

/**
 * Toggles the status of a feature.
 * @param {number|string} featureId - The ID of the feature.
 * @returns {Promise<object>} The API response.
 */
export const changeFeatureStatus = async (featureId) => {
    try {
        const response = await apiClient.patch(`/admin/status-features/${featureId}`);
        return response.data;
    } catch (error) {
        console.error("Error changing feature status:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};