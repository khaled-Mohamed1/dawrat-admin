import apiClient from './apiClient';

const BASE_URL = '/admin/orders';

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
 * Fetches the total order count and revenue.
 * @returns {Promise<object>}
 */
export const getOrderTotals = async () => {
    try {
        const response = await apiClient.get(`${BASE_URL}/totals`);
        return response.data;
    } catch (error) {
        console.error("Error fetching order totals:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Fetches a paginated and filtered list of orders.
 * @param {object} params - The query parameters for filtering and pagination.
 * @returns {Promise<object>} The API response.
 */
export const getOrders = async (params = {}) => {
    try {
        const response = await apiClient.get(BASE_URL, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching orders:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Fetches the details of a single order.
 * @param {number|string} orderId - The ID of the order.
 * @returns {Promise<object>}
 */
export const getOrderDetails = async (orderId) => {
    try {
        const response = await apiClient.get(`${BASE_URL}/${orderId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching order details:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Deletes a specific order.
 * @param {number|string} orderId - The ID of the order.
 * @returns {Promise<object>} The API response.
 */
export const deleteOrder = async (orderId) => {
    try {
        const response = await apiClient.delete(`${BASE_URL}/${orderId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting order:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

// --- Filter Data Functions ---

/**
 * Fetches a simple list of all courses for filtering.
 * @returns {Promise<Array>}
 */
export const getAllCourses = async () => {
    try {
        const response = await apiClient.get('/admin/courses/all-courses');
        return response.data.data || [];
    } catch (error) {
        console.error("Error fetching all courses:", error.response?.data || error.message);
        return [];
    }
};

/**
 * Fetches a simple list of all transactions for filtering.
 * @returns {Promise<Array>}
 */
export const getAllTransactions = async () => {
    try {
        const response = await apiClient.get('/admin/transactions/all-transactions');
        return response.data.data || [];
    } catch (error) {
        console.error("Error fetching all transactions:", error.response?.data || error.message);
        return [];
    }
};

/**
 * Exports a list of orders to an Excel file.
 * @param {object} params - The same filter parameters as getOrders.
 * @returns {Promise<void>}
 */
export const exportOrders = async (params = {}) => {
    try {
        const response = await apiClient.get(`${BASE_URL}/export`, {
            params,
            responseType: 'blob',
        });
        handleFileDownload(response, `orders-export-${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
        console.error("Error exporting orders:", error);
        throw new Error('Failed to export order data.');
    }
};

/**
 * Downloads the invoice for a specific order.
 * @param {number|string} orderId - The ID of the order.
 * @returns {Promise<void>}
 */
export const downloadOrderInvoice = async (orderId) => {
    try {
        const response = await apiClient.get(`${BASE_URL}/${orderId}/download`, {
            responseType: 'blob',
        });
        handleFileDownload(response, `order-${orderId}-invoice.pdf`);
    } catch (error) {
        console.error("Error downloading order invoice:", error);
        throw new Error('Failed to download invoice.');
    }
};