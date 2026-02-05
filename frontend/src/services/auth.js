import api from './api';

export const login = async (email, password) => {
    const params = new URLSearchParams({ email, password });
    const response = await api.post(`/auth/login?${params.toString()}`);

    if (response.data.user_id) {
        // Store user info
        localStorage.setItem('user', JSON.stringify({
            id: response.data.user_id,
            role: response.data.role
        }));
        // Since backend doesn't provide a JWT yet, we'll use user_id as a dummy token
        localStorage.setItem('token', response.data.user_id);
    }
    return response.data;
};

export const signup = async (email, password, role = 'student') => {
    const params = new URLSearchParams({ email, password, role });
    const response = await api.post(`/auth/signup?${params.toString()}`);
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};
