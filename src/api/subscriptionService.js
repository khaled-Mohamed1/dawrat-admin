import apiClient from './apiClient';

const BASE_URL = '/admin/subscriptions';

// === Main Subscription ===

/**
 * Fetches a paginated and filtered list of subscriptions.
 * @param {object} params - The query parameters for filtering and pagination.
 * @returns {Promise<object>} The API response with subscription data.
 */
export const getSubscriptions = async (params = {}) => {
    try {
        const response = await apiClient.get(BASE_URL, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching subscriptions:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Fetches the details of a single subscription.
 * @param {number|string} subscriptionId - The ID of the subscription.
 * @returns {Promise<object>} The subscription data.
 */
export const getSubscriptionDetails = async (subscriptionId) => {
    try {
        const response = await apiClient.get(`${BASE_URL}/${subscriptionId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching subscription details:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

// === Custom Subscription Actions ===

/**
 * Toggles the paused status of a subscription.
 * @param {number|string} subscriptionId - The ID of the subscription.
 * @returns {Promise<object>} The API response.
 */
export const togglePauseSubscription = async (subscriptionId) => {
    try {
        const response = await apiClient.post(`${BASE_URL}/${subscriptionId}/toggle-pause`);
        return response.data;
    } catch (error) {
        console.error("Error toggling subscription pause state:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Adds an addon to a subscription.
 * @param {number|string} subscriptionId - The ID of the subscription.
 * @param {object} addonData - The data for the addon being added.
 * @returns {Promise<object>} The API response.
 */
export const addAddonToSubscription = async (subscriptionId, addonData) => {
    try {
        const response = await apiClient.post(`${BASE_URL}/${subscriptionId}/addons`, addonData);
        return response.data;
    } catch (error) {
        console.error("Error adding addon to subscription:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};