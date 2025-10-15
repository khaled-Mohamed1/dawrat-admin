import apiClient from './apiClient';

const BASE_URL = '/admin/subscription-plans';

/**
 * Fetches a list of all subscription plans.
 * @returns {Promise<object>} The API response with the list of plans.
 */
export const getSubscriptionPlans = async (params = {}) => {
    try {
        const response = await apiClient.get(BASE_URL, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching subscription plans:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};
/**
 * Fetches the details of a single subscription plan.
 * @param {number|string} planId - The ID of the subscription plan.
 * @returns {Promise<object>} The subscription plan data.
 */
export const getSubscriptionPlanDetails = async (planId) => {
    try {
        const response = await apiClient.get(`${BASE_URL}/${planId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching subscription plan details:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Creates a new subscription plan.
 * @param {object} planData - The data for the new plan.
 * @returns {Promise<object>} The API response with the newly created plan.
 */
export const createSubscriptionPlan = async (planData) => {
    try {
        const response = await apiClient.post(BASE_URL, planData);
        return response.data;
    } catch (error) {
        console.error("Error creating subscription plan:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Updates an existing subscription plan.
 * @param {number|string} planId - The ID of the plan to update.
 * @param {object} planData - The updated data for the plan.
 * @returns {Promise<object>} The API response.
 */
export const updateSubscriptionPlan = async (planId, planData) => {
    try {
        const response = await apiClient.put(`${BASE_URL}/${planId}`, planData);
        return response.data;
    } catch (error) {
        console.error("Error updating subscription plan:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Deletes a subscription plan.
 * @param {number|string} planId - The ID of the plan to delete.
 * @returns {Promise<object>} The API response.
 */
export const deleteSubscriptionPlan = async (planId) => {
    try {
        const response = await apiClient.delete(`${BASE_URL}/${planId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting subscription plan:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};