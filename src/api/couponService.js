import apiClient from './apiClient';

const BASE_URL = '/admin/coupons';

/**
 * Fetches a paginated and filtered list of coupons.
 * @param {object} params - The query parameters for filtering (status, owner_type, etc.).
 * @returns {Promise<object>}
 */
export const getCoupons = async (params = {}) => {
    try {
        const response = await apiClient.get(BASE_URL, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching coupons:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Fetches the details of a single coupon.
 * @param {number|string} couponId - The ID of the coupon.
 * @returns {Promise<object>}
 */
export const getCouponDetails = async (couponId) => {
    try {
        const response = await apiClient.get(`${BASE_URL}/${couponId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching coupon details:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Deletes a coupon.
 * @param {number|string} couponId - The ID of the coupon to delete.
 * @returns {Promise<object>}
 */
export const deleteCoupon = async (couponId) => {
    try {
        const response = await apiClient.delete(`${BASE_URL}/${couponId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting coupon:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Toggles the active/inactive status of a coupon.
 * @param {number|string} couponId - The ID of the coupon.
 * @param {object} statusData - e.g., { status: 'active' }
 * @returns {Promise<object>}
 */
export const changeCouponStatus = async (couponId, statusData) => {
    try {
        const response = await apiClient.post(`${BASE_URL}/${couponId}/status`, statusData);
        return response.data;
    } catch (error) {
        console.error("Error changing coupon status:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};