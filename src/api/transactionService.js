import apiClient from './apiClient';

const BASE_URL = '/admin/transactions';

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
 * Fetches a paginated and filtered list of transactions.
 * @param {object} params - The query parameters for filtering.
 * @returns {Promise<object>}
 */
export const getTransactions = async (params = {}) => {
    try {
        const response = await apiClient.get(BASE_URL, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching transactions:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Fetches the details of a single transaction.
 * @param {number|string} transactionId - The ID of the transaction.
 * @returns {Promise<object>}
 */
export const getTransactionDetails = async (transactionId) => {
    try {
        const response = await apiClient.get(`${BASE_URL}/${transactionId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching transaction details:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Exports a list of transactions to an Excel file.
 * @param {object} params - The filter parameters.
 * @returns {Promise<void>}
 */
export const exportTransactions = async (params = {}) => {
    try {
        const response = await apiClient.get(`${BASE_URL}/export`, {
            params,
            responseType: 'blob',
        });
        handleFileDownload(response, `transactions-export-${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
        console.error("Error exporting transactions:", error);
        throw new Error('Failed to export transaction data.');
    }
};