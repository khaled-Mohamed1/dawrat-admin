// src/api/dashboardService.js
import apiClient from './apiClient';

export const getKpiStats = async () => {
    try {
        const response = await apiClient.get('/admin/dashboard/kpis');
        return response.data;
    } catch (error) {
        console.error("Error fetching KPI stats:", error.response?.data || error.message);
        throw error;
    }
};

// Function to get the course stats
export const getCourseStats = async () => {
    try {
        const response = await apiClient.get('/admin/dashboard/courses/stats');
        return response.data;
    } catch (error) {
        console.error("Error fetching course stats:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Fetches subscription data including chart and summary table.
 * @returns {Promise<object>} The subscription data object from the API.
 */
export const getSubscriptionData = async () => {
    try {
        const response = await apiClient.get('/admin/dashboard/subscriptions');
        return response.data;
    } catch (error) {
        console.error("Error fetching subscription data:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Fetches revenue data for a given period.
 * @param {string} period - The time period ('week' or 'month').
 * @returns {Promise<object>} The revenue data object from the API.
 */
export const getRevenueData = async (period = 'week') => {
    try {
        const response = await apiClient.get('/admin/dashboard/revenue', {
            params: { period }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching revenue data:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Fetches data for the dashboard tables (orders and payouts).
 * @param {string} period - The time period ('week' or 'month').
 * @returns {Promise<object>} The tables data object from the API.
 */
export const getDashboardTablesData = async (period = 'week') => {
    try {
        const response = await apiClient.get('/admin/dashboard/tables', {
            params: { period }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching dashboard tables data:", error.response?.data || error.message);
        throw error;
    }
};