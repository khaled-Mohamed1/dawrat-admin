import apiClient from './apiClient';

/**
 * Fetches the top courses from the dashboard API.
 * @param {string} filterBy - The filter criteria ('latest', 'sales', 'enrollments', 'rating').
 * @returns {Promise<Array>} A promise that resolves to an array of course objects.
 */
export const getTopCourses = async (filterBy = 'latest') => {
    try {
        const response = await apiClient.get('/admin/dashboard/courses/top', {
            params: {
                filter_by: filterBy
            }
        });
        return response.data.data || [];
    } catch (error) {
        console.error("Error fetching top courses:", error.response?.data || error.message);
        return [];
    }
};