import apiClient from './apiClient';

const BASE_URL = '/admin/invoices';

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
 * Fetches a paginated and filtered list of invoices.
 * @param {object} params - The query parameters for filtering.
 * @returns {Promise<object>}
 */
export const getInvoices = async (params = {}) => {
    try {
        const response = await apiClient.get(BASE_URL, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching invoices:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Fetches the total invoice count and revenue.
 * @returns {Promise<object>}
 */
export const getInvoiceTotals = async () => {
    try {
        const response = await apiClient.get(`${BASE_URL}/totals`);
        return response.data;
    } catch (error) {
        console.error("Error fetching invoice totals:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Fetches the details of a single invoice.
 * @param {number|string} invoiceId - The ID of the invoice.
 * @returns {Promise<object>}
 */
export const getInvoiceDetails = async (invoiceId) => {
    try {
        const response = await apiClient.get(`${BASE_URL}/${invoiceId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching invoice details:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Exports a list of invoices to an Excel file.
 * @param {object} params - The filter parameters.
 * @returns {Promise<void>}
 */
export const exportInvoices = async (params = {}) => {
    try {
        const response = await apiClient.get(`${BASE_URL}/export`, {
            params,
            responseType: 'blob',
        });
        handleFileDownload(response, `invoices-export-${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
        console.error("Error exporting invoices:", error);
        throw new Error('Failed to export invoice data.');
    }
};

/**
 * Downloads a PDF for a specific invoice.
 * @param {number|string} invoiceId - The ID of the invoice.
 * @returns {Promise<void>}
 */
export const downloadInvoice = async (invoiceId) => {
    try {
        const response = await apiClient.get(`${BASE_URL}/${invoiceId}/download`, {
            responseType: 'blob',
        });
        handleFileDownload(response, `invoice-${invoiceId}.pdf`);
    } catch (error) {
        console.error("Error downloading invoice:", error);
        throw new Error('Failed to download invoice.');
    }
};

/**
 * Resends the invoice email to the user.
 * @param {number|string} invoiceId - The ID of the invoice.
 * @returns {Promise<object>}
 */
export const resendInvoice = async (invoiceId) => {
    try {
        const response = await apiClient.post(`${BASE_URL}/${invoiceId}/resend`);
        return response.data;
    } catch (error) {
        console.error("Error resending invoice:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};