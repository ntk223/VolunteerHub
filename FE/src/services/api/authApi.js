import {apiClient} from './apiClient.js';

const login = async (email, password, role) => {
    try {
        const response = await apiClient.post('/auth/login', { email, password, role });
        return response.data;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
}

const register = async (userData) => {
    try {
        const response = await apiClient.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        console.error('Registration failed:', error);
        throw error;
    }
}

export const authApi = {
    login,
    register,
}