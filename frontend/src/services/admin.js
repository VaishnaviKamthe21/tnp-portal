import api from './api';

export const getDepartmentSummary = async () => {
    const response = await api.get('/analytics/department-summary');
    return response.data;
};

export const getPlacementRate = async () => {
    const response = await api.get('/analytics/placement-rate');
    return response.data;
};

export const getJobCount = async () => {
    const response = await api.get('/analytics/job-count');
    return response.data;
};

export const getAllApplications = async () => {
    const response = await api.get('/admin/applications');
    return response.data;
};

export const markPlaced = async (userId) => {
    const response = await api.post(`/admin/mark-placed/${userId}`);
    return response.data;
};
