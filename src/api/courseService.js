import apiClient from './apiClient';

// Helper function to handle file downloads
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

// === Main Course Resource (CRUD) ===

/**
 * Fetches a paginated and filtered list of all courses.
 * @param {object} params - The query parameters for filtering and pagination.
 * @returns {Promise<object>} The API response with course data and pagination meta.
 */
export const getCourses = async (params = {}) => {
    try {
        const response = await apiClient.get('/admin/courses', { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching courses:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Fetches the detailed information for a single course.
 * @param {number|string} courseId - The ID of the course.
 * @returns {Promise<object>} The course data.
 */
export const getCourseDetails = async (courseId) => {
    try {
        const response = await apiClient.get(`/admin/courses/${courseId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching course details:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Deletes a specific course.
 * @param {number|string} courseId - The ID of the course to delete.
 * @returns {Promise<object>} The API response.
 */
export const deleteCourse = async (courseId) => {
    try {
        const response = await apiClient.delete(`/admin/courses/${courseId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting course:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};


// === Course-Specific Actions & Data ===

/**
 * Reviews a course (e.g., approve or reject).
 * @param {number|string} courseId - The ID of the course.
 * @param {object} data - The review data, including status and rejection_reason.
 * @param {string} data.status - The new status (e.g., 'Approved', 'Rejected').
 * @param {string} [data.rejection_reason] - The reason for rejection, if applicable.
 * @returns {Promise<object>} The API response.
 */
export const reviewCourse = async (courseId, { status, rejection_reason }) => {
    try {
        const payload = { status };
        if (rejection_reason) {
            payload.rejection_reason = rejection_reason;
        }
        const response = await apiClient.post(`/admin/courses/${courseId}/review`, payload);
        return response.data;
    } catch (error) {
        console.error("Error reviewing course:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Fetches sessions for a specific course.
 * @param {number|string} courseId - The ID of the course.
 * @param {object} params - Optional query parameters (e.g., { status: 'scheduled' }).
 * @returns {Promise<object>} The API response.
 */
export const getCourseSessions = async (courseId, params = {}) => {
    try {
        const response = await apiClient.get(`/admin/courses/${courseId}/sessions`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching course sessions:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Fetches enrollments for a specific course.
 * @param {number|string} courseId - The ID of the course.
 * @param {object} params - Optional query parameters for pagination.
 * @returns {Promise<object>} The API response.
 */
export const getCourseEnrollments = async (courseId, params = {}) => {
    try {
        const response = await apiClient.get(`/admin/courses/${courseId}/enrolments`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching course enrollments:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Fetches reviews for a specific course.
 * @param {number|string} courseId - The ID of the course.
 * @param {object} params - Optional query parameters (e.g., { rate: 5 }).
 * @returns {Promise<object>} The API response.
 */
export const getCourseReviews = async (courseId, params = {}) => {
    try {
        const response = await apiClient.get(`/admin/courses/${courseId}/reviews`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching course reviews:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};


// === Export ===

/**
 * Exports a list of courses to an Excel file based on the provided filters.
 * @param {object} params - The same filter parameters as getCourses.
 * @returns {Promise<void>}
 */
export const exportCourses = async (params = {}) => {
    try {
        const response = await apiClient.get('/admin/courses/export', {
            params,
            responseType: 'blob', // Important for file downloads
        });
        handleFileDownload(response, `courses-export-${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
        console.error("Error exporting courses:", error);
        throw new Error('Failed to export course data.');
    }
};