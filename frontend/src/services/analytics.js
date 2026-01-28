import api from './api';

export const getPlacementRate = async () => {
    const response = await api.get('/analytics/placement-rate');
    return response.data;
};

export const getDepartmentSummary = async () => {
    const response = await api.get('/analytics/department-summary');
    return response.data;
};

export const getJobCount = async () => {
    const response = await api.get('/analytics/job-count');
    return response.data;
};

export const getStudentCount = async () => {
    const response = await api.get('/analytics/student-count');
    return response.data;
};

export const getAdminApplications = async () => {
    const response = await api.get('/admin/applications');
    return response.data;
};
