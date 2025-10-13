import apiClient from './apiClient';

/**
 * Fetches all notifications for the authenticated user.
 * @returns {Promise<object>} The API response containing the notifications.
 */
export const getNotifications = async () => {
    try {
        const response = await apiClient.get('/auth/notifications');
        return response.data;
    } catch (error) {
        console.error("Error fetching notifications:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Marks a single notification as read.
 * @param {string} notificationId - The ID of the notification to mark as read.
 * @returns {Promise<object>} The API response.
 */
export const markNotificationAsRead = async (notificationId) => {
    try {
        const response = await apiClient.post('/auth/notifications/read', { id: notificationId });
        return response.data;
    } catch (error) {
        console.error("Error marking notification as read:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Marks all notifications as read for the authenticated user.
 * @returns {Promise<object>} The API response.
 */
export const markAllNotificationsAsRead = async () => {
    try {
        const response = await apiClient.post('/auth/notifications/mark-all-read');
        return response.data;
    } catch (error) {
        console.error("Error marking all notifications as read:", error.response?.data || error.message);
        throw error;
    }
};