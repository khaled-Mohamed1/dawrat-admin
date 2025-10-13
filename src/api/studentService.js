import apiClient from './apiClient';

/**
 * Fetches a paginated and searchable list of students.
 * @param {object} params - The query parameters.
 * @param {number} params.page - The page number for pagination.
 * @param {string} params.search - The search query.
 * @returns {Promise<object>} The full API response including data, links, and meta.
 */
export const getStudents = async ({ page = 1, search = '' }) => {
    try {
        const params = { page };
        if (search) {
            params.search = search;
        }
        const response = await apiClient.get('/admin/students', { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching students:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Fetches the detailed profile of a single student.
 * @param {number|string} studentId - The ID of the student.
 * @returns {Promise<object>} The student data object from the API.
 */
export const getStudentDetails = async (studentId) => {
    try {
        const response = await apiClient.get(`/admin/students/${studentId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching student details:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Updates a student's profile information.
 * @param {number|string} studentId - The ID of the student.
 * @param {object} studentData - The updated student data.
 * @returns {Promise<object>} The API response.
 */
export const updateStudentDetails = async (studentId, studentData) => {
    try {
        const response = await apiClient.post(`/admin/students/${studentId}`, {
            ...studentData,
            _method: 'put',
        });
        return response.data;
    } catch (error) {
        console.error("Error updating student details:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Fetches a paginated list of a student's course enrollments.
 * @param {number|string} studentId - The ID of the student.
 * @param {number} page - The page number for pagination.
 * @returns {Promise<object>} The full API response including data, links, and meta.
 */
export const getStudentEnrollments = async (studentId, page = 1) => {
    try {
        const response = await apiClient.get(`/admin/students/${studentId}/enrolments`, {
            params: { page }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching student enrollments:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Fetches a paginated list of a student's favorite courses.
 * @param {number|string} studentId - The ID of the student.
 * @param {number} page - The page number for pagination.
 * @returns {Promise<object>} The full API response including data, links, and meta.
 */
export const getStudentFavorites = async (studentId, page = 1) => {
    try {
        const response = await apiClient.get(`/admin/students/${studentId}/favorites`, {
            params: { page }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching student favorites:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Fetches a paginated list of a student's course demands.
 * @param {number|string} studentId - The ID of the student.
 * @param {number} page - The page number for pagination.
 * @returns {Promise<object>} The full API response.
 */
export const getStudentCourseDemands = async (studentId, page = 1) => {
    try {
        const response = await apiClient.get(`/admin/students/${studentId}/course-demands`, {
            params: { page }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching student course demands:", error.response?.data || error.message);
        throw error;
    }
};