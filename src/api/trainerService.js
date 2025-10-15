import apiClient from './apiClient';

// A helper function to handle file downloads
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


// === Main Trainer Resource (CRUD) ===

/**
 * Fetches a paginated and filtered list of trainers.
 * @param {object} params - The query parameters for filtering and pagination.
 * @returns {Promise<object>} The API response with trainer data and pagination meta.
 */
export const getTrainers = async (params = {}) => {
    try {
        const response = await apiClient.get('/admin/trainers', { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching trainers:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Fetches the detailed profile of a single trainer.
 * @param {number|string} trainerId - The ID of the trainer.
 * @returns {Promise<object>} The trainer data.
 */
export const getTrainerDetails = async (trainerId) => {
    try {
        const response = await apiClient.get(`/admin/trainers/${trainerId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching trainer details:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Updates a trainer's profile.
 * @param {number|string} trainerId - The ID of the trainer.
 * @param {object} trainerData - The data to update.
 * @returns {Promise<object>} The API response.
 */
export const updateTrainer = async (trainerId, trainerData) => {
    try {
        // Using POST with _method: 'patch' or 'put' if your backend requires it for form-data
        const response = await apiClient.patch(`/admin/trainers/${trainerId}`, trainerData);
        return response.data;
    } catch (error) {
        console.error("Error updating trainer:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Deletes a specific trainer.
 * @param {number|string} trainerId - The ID of the trainer to delete.
 * @returns {Promise<object>} The API response.
 */
export const deleteTrainer = async (trainerId) => {
    try {
        const response = await apiClient.delete(`/admin/trainers/${trainerId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting trainer:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

// === Specific Trainer Actions ===

/**
 * Sends a reminder to a specific trainer.
 * @param {number|string} trainerId - The ID of the trainer.
 * @returns {Promise<object>} The API response.
 */
export const sendTrainerReminder = async (trainerId) => {
    try {
        const response = await apiClient.post(`/admin/trainers/${trainerId}/send-reminder`);
        return response.data;
    } catch (error) {
        console.error("Error sending reminder:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Changes the status of a trainer.
 * @param {number|string} trainerId - The ID of the trainer.
 * @param {object} statusData - The status data (e.g., { status: 'active' }).
 * @returns {Promise<object>} The API response.
 */
export const changeTrainerStatus = async (trainerId, statusData) => {
    try {
        const response = await apiClient.patch(`/admin/trainers/${trainerId}/status`, statusData);
        return response.data;
    } catch (error) {
        console.error("Error changing trainer status:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

// === Trainer-Related Data ===

/**
 * Fetches a trainer's courses with filtering.
 * @param {number|string} trainerId - The ID of the trainer.
 * @param {object} params - The query parameters for filtering.
 * @returns {Promise<object>} The API response with course data.
 */
export const getTrainerCourses = async (trainerId, params = {}) => {
    try {
        const response = await apiClient.get(`/admin/trainers/${trainerId}/courses`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching trainer courses:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Fetches enrollments for a specific course by a trainer.
 * @param {number|string} trainerId - The ID of the trainer.
 * @param {number|string} courseId - The ID of the course.
 * @returns {Promise<object>} The API response with enrollment data.
 */
export const getTrainerCourseEnrollments = async (trainerId, courseId) => {
    try {
        const response = await apiClient.get(`/admin/trainers/${trainerId}/courses/${courseId}/enrolments`);
        return response.data;
    } catch (error) {
        console.error("Error fetching course enrollments:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Fetches centers associated with a trainer.
 * @param {number|string} trainerId - The ID of the trainer.
 * @param {object} params - Optional query parameters for pagination.
 * @returns {Promise<object>} The API response.
 */
export const getTrainerCenters = async (trainerId, params = {}) => {
    try {
        const response = await apiClient.get(`/admin/trainers/${trainerId}/centers`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching trainer centers:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Fetches subscriptions for a trainer.
 * @param {number|string} trainerId - The ID of the trainer.
 * @param {object} params - Optional query parameters for pagination.
 * @returns {Promise<object>} The API response.
 */
export const getTrainerSubscriptions = async (trainerId, params = {}) => {
    try {
        const response = await apiClient.get(`/admin/trainers/${trainerId}/subscriptions`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching trainer subscriptions:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Fetches invoices for a trainer.
 * @param {number|string} trainerId - The ID of the trainer.
 * @param {object} params - Optional query parameters for pagination.
 * @returns {Promise<object>} The API response.
 */
export const getTrainerInvoices = async (trainerId, params = {}) => {
    try {
        const response = await apiClient.get(`/admin/trainers/${trainerId}/invoices`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching trainer invoices:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Fetches payouts for a trainer.
 * @param {number|string} trainerId - The ID of the trainer.
 * @param {object} params - Optional query parameters for pagination.
 * @returns {Promise<object>} The API response.
 */
export const getTrainerPayouts = async (trainerId, params = {}) => {
    try {
        const response = await apiClient.get(`/admin/trainers/${trainerId}/payouts`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching trainer payouts:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Fetches reviews for a trainer.
 * @param {number|string} trainerId - The ID of the trainer.
 * @param {object} params - The query parameters (e.g., for rating).
 * @returns {Promise<object>} The API response with review data.
 */
export const getTrainerReviews = async (trainerId, params = {}) => {
    try {
        const response = await apiClient.get(`/admin/trainers/${trainerId}/reviews`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching trainer reviews:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Deletes a specific review for a trainer.
 * @param {number|string} trainerId - The ID of the trainer.
 * @param {number|string} reviewId - The ID of the review to delete.
 * @returns {Promise<object>} The API response.
 */
export const deleteTrainerReview = async (trainerId, reviewId) => {
    try {
        const response = await apiClient.delete(`/admin/trainers/${trainerId}/reviews/${reviewId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting review:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

// Add other functions for centers, subscriptions, invoices, payouts following the same pattern.

// === Export and Downloads ===

/**
 * Exports a list of trainers based on filters.
 * @param {object} params - The same filter parameters as getTrainers.
 * @returns {Promise<void>}
 */
export const exportTrainers = async (params = {}) => {
    try {
        const response = await apiClient.get('/admin/trainers/export', {
            params,
            responseType: 'blob',
        });
        handleFileDownload(response, `trainers-export-${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
        console.error("Error exporting trainers:", error);
        throw new Error('Failed to export trainer data.');
    }
};

/**
 * Fetches a simple list of all trainers for filtering.
 * @returns {Promise<Array>} A promise that resolves to an array of trainer objects.
 */
export const getAllTrainers = async () => {
    try {
        const response = await apiClient.get('/admin/trainers/all-trainers');
        return response.data.data || [];
    } catch (error) {
        console.error("Error fetching all trainers:", error.response?.data || error.message);
        return [];
    }
};

/**
 * Downloads a subscription invoice for a trainer.
 * @param {number|string} trainerId - The ID of the trainer.
 * @param {number|string} subscriptionId - The ID of the subscription.
 * @returns {Promise<void>}
 */
export const downloadTrainerSubscriptionInvoice = async (trainerId, subscriptionId) => {
    try {
        const response = await apiClient.get(`/admin/trainers/${trainerId}/subscriptions/${subscriptionId}/download`, {
            responseType: 'blob',
        });
        handleFileDownload(response, `invoice-sub-${subscriptionId}.pdf`);
    } catch (error) {
        console.error("Error downloading subscription invoice:", error);
        throw new Error('Failed to download invoice.');
    }
};