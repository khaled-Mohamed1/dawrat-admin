import apiClient from './apiClient';

const BASE_URL = '/admin/settings';

/**
 * Fetches a list of all settings.
 * @returns {Promise<object>} The API response with the list of settings.
 */
export const getSettings = async () => {
    try {
        const response = await apiClient.get(BASE_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching settings:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Fetches the details of a single setting.
 * @param {number|string} settingId - The ID of the setting.
 * @returns {Promise<object>} The setting data.
 */
export const getSettingDetails = async (settingId) => {
    try {
        const response = await apiClient.get(`${BASE_URL}/${settingId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching setting details:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Updates an existing setting.
 * @param {number|string} settingId - The ID of the setting to update.
 * @param {object} settingData - The updated data for the setting.
 * @returns {Promise<object>} The API response.
 */
export const updateSetting = async (settingId, settingData) => {
    try {
        // Using PUT to replace the setting data as per the backend logic.
        const response = await apiClient.put(`${BASE_URL}/${settingId}`, settingData);
        return response.data;
    } catch (error) {
        console.error("Error updating setting:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};