import api from './api';

export const getProfile = async (userId) => {
    const response = await api.get(`/students/profile/${userId}`);
    return response.data;
};

export const updateProfile = async (profileData) => {
    const params = new URLSearchParams(profileData);
    const response = await api.post(`/students/profile?${params.toString()}`);
    return response.data;
};

export const getAllStudents = async () => {
    const response = await api.get('/students/all');
    return response.data;
};

