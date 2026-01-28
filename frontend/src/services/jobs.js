import api from './api';

export const getJobs = async () => {
    const response = await api.get('/jobs');
    return response.data;
};

export const getJobById = async (jobId) => {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
};

export const applyToJob = async (jobId, userId) => {
    const response = await api.post(`/apply/${jobId}?user_id=${userId}`);
    return response.data;
};

export const createJob = async (jobData) => {
    const params = new URLSearchParams({
        company: jobData.company,
        title: jobData.title,
        min_cgpa: jobData.min_cgpa,
        required_skills: jobData.required_skills,
        description: jobData.description || '',
    });
    const response = await api.post(`/jobs?${params.toString()}`);
    return response.data;
};

export const getStudentApplications = async (userId) => {
    const response = await api.get(`/students/applications/${userId}`);
    return response.data;
};

export const getRecommendedJobs = async (userId) => {
    const response = await api.get(`/recommendations/${userId}`);
    return response.data;
};
