import apiClient from './apiClient';

const BASE_URL = '/admin/revenue';

// Helper for file downloads
const handleFileDownload = (response, filename) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
};

/**
 * Fetches a paginated and filtered list of revenue entries.
 * @param {object} params - The query parameters (start_date, end_date, page).
 * @returns {Promise<object>}
 */
export const getRevenue = async (params = {}) => {
    try {
        const response = await apiClient.get(BASE_URL, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching revenue:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Fetches the total revenue KPIs.
 * @returns {Promise<object>}
 */
export const getRevenueTotals = async () => {
    try {
        const response = await apiClient.get(`${BASE_URL}/totals`);
        return response.data;
    } catch (error) {
        console.error("Error fetching revenue totals:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Fetches the revenue details for a single order.
 * @param {number|string} orderId - The ID of the order.
 * @returns {Promise<object>}
 */
export const getRevenueDetails = async (orderId) => {
    try {
        const response = await apiClient.get(`${BASE_URL}/${orderId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching revenue details:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Exports a list of revenue entries to an Excel file.
 * @param {object} params - The filter parameters.
 * @returns {Promise<void>}
 */
export const exportRevenue = async (params = {}) => {
    try {
        const response = await apiClient.get(`${BASE_URL}/export`, {
            params,
            responseType: 'blob',
        });
        handleFileDownload(response, `revenue-export-${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
        console.error("Error exporting revenue:", error);
        throw new Error('Failed to export revenue data.');
    }
};