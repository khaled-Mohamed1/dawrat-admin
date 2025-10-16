import apiClient from './apiClient';

const BASE_URL = '/admin/jobs';

/**
 * Fetches a paginated and filtered list of jobs.
 * @param {object} params - The query parameters (search, status, page).
 * @returns {Promise<object>} The API response.
 */
export const getJobs = async (params = {}) => {
    try {
        const response = await apiClient.get(BASE_URL, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching jobs:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Fetches the details of a single job.
 * @param {number|string} jobId - The ID of the job.
 * @returns {Promise<object>} The job data.
 */
export const getJobDetails = async (jobId) => {
    try {
        const response = await apiClient.get(`${BASE_URL}/${jobId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching job details:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Creates a new job.
 * @param {object} jobData - The data for the new job.
 * @returns {Promise<object>} The API response.
 */
export const createJob = async (jobData) => {
    try {
        const response = await apiClient.post(BASE_URL, jobData);
        return response.data;
    } catch (error) {
        console.error("Error creating job:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Updates an existing job.
 * @param {number|string} jobId - The ID of the job.
 * @param {object} jobData - The updated data.
 * @returns {Promise<object>} The API response.
 */
export const updateJob = async (jobId, jobData) => {
    try {
        const response = await apiClient.put(`${BASE_URL}/${jobId}`, jobData);
        return response.data;
    } catch (error) {
        console.error("Error updating job:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Deletes a job.
 * @param {number|string} jobId - The ID of the job.
 * @returns {Promise<object>} The API response.
 */
export const deleteJob = async (jobId) => {
    try {
        const response = await apiClient.delete(`${BASE_URL}/${jobId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting job:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Toggles the status of a job.
 * @param {number|string} jobId - The ID of the job.
 * @param {object} statusData - The new status (e.g., { status: 1 }).
 * @returns {Promise<object>} The API response.
 */
export const changeJobStatus = async (jobId, statusData) => {
    try {
        const response = await apiClient.patch(`/admin/jobs/${jobId}/status`, statusData);
        return response.data;
    } catch (error) {
        console.error("Error changing job status:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};