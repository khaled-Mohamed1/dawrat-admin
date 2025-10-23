import apiClient from './apiClient';

const BASE_URL = '/admin/centers';

export const getAllCenters = async () => {
    try {
        const response = await apiClient.get(`admin/all-centers`);
        return response.data.data || [];
    } catch (error) { return []; }
};