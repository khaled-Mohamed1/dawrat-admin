import apiClient from './apiClient';

const BASE_URL = '/admin/ads';

// === Main Ad Resource (CRUD) ===

/**
 * Fetches a paginated and filtered list of ads.
 * @param {object} params - The query parameters for filtering.
 * @returns {Promise<object>}
 */
export const getAds = async (params = {}) => {
    try {
        const response = await apiClient.get(BASE_URL, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching ads:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Fetches the details of a single ad.
 * @param {number|string} adId - The ID of the ad.
 * @returns {Promise<object>}
 */
export const getAdDetails = async (adId) => {
    try {
        const response = await apiClient.get(`${BASE_URL}/${adId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching ad details:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Creates a new ad with FormData for image upload.
 * @param {FormData} adData - The ad data as FormData.
 * @returns {Promise<object>}
 */
export const createAd = async (adData) => {
    try {
        const response = await apiClient.post(BASE_URL, adData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating ad:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Updates an existing ad with FormData for image upload.
 * @param {number|string} adId - The ID of the ad.
 * @param {FormData} adData - The ad data as FormData.
 * @returns {Promise<object>}
 */
export const updateAd = async (adId, adData) => {
    try {
        // Use POST and append _method for multipart/form-data updates
        adData.append('_method', 'PUT');
        const response = await apiClient.post(`${BASE_URL}/${adId}`, adData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating ad:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Deletes an ad.
 * @param {number|string} adId - The ID of the ad to delete.
 * @returns {Promise<object>}
 */
export const deleteAd = async (adId) => {
    try {
        const response = await apiClient.delete(`${BASE_URL}/${adId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting ad:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};


// === Custom Ad Actions ===

/**
 * Toggles the active/inactive status of an ad.
 * @param {number|string} adId - The ID of the ad.
 * @param {object} statusData - e.g., { status: 1 } or { status: 0 }
 * @returns {Promise<object>}
 */
export const changeAdStatus = async (adId, statusData) => {
    try {
        const response = await apiClient.post(`${BASE_URL}/${adId}/status`, statusData);
        return response.data;
    } catch (error) {
        console.error("Error changing ad status:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Approves a pending ad.
 * @param {number|string} adId - The ID of the ad to approve.
 * @returns {Promise<object>}
 */
export const approveAd = async (adId) => {
    try {
        const response = await apiClient.post(`${BASE_URL}/${adId}/approve`);
        return response.data;
    } catch (error) {
        console.error("Error approving ad:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Rejects a pending ad.
 * @param {number|string} adId - The ID of the ad to reject.
 * @param {object} data - The rejection data.
 * @param {string} data.rejection_reason - The reason for rejection.
 * @returns {Promise<object>}
 */
export const rejectAd = async (adId, { rejection_reason }) => {
    try {
        const response = await apiClient.post(`${BASE_URL}/${adId}/reject`, { rejection_reason });
        return response.data;
    } catch (error) {
        console.error("Error rejecting ad:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};
