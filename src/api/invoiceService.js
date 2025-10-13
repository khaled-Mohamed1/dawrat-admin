import apiClient from './apiClient';

/**
 * Downloads a PDF invoice from the server.
 * @param {number|string} invoiceId - The ID of the invoice to download.
 * @param {string} invoiceNumber - The number of the invoice, used for the filename.
 * @returns {Promise<void>}
 */
export const downloadInvoice = async (invoiceId, invoiceNumber) => {
    try {
        const response = await apiClient.get(`/admin/invoices/${invoiceId}/download`, {
            responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));

        const link = document.createElement('a');
        link.href = url;

        link.setAttribute('download', `${invoiceNumber}.pdf`);

        document.body.appendChild(link);
        link.click();
        link.remove();

        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error("Error downloading invoice:", error);
        throw new Error('Failed to download invoice.');
    }
};