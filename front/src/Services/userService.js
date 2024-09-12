// src/services/userService.js
import api from './api';

// Service function to handle user login
export const loginUser = async (email, password) => {
    try {
        const response = await api.post('/User/login', { email, password });
        return response.data; // { Token }
    } catch (error) {
        throw error; // Handle the error in the component
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await api.post('/User/register', userData);
        return response.data; // { User, Token }
    } catch (error) {
        throw error; // Handle the error in the component
    }
};

// You can add more user-related functions here
export const getUsers = async () => {
    try {
        const response = await api.get('/User');
        return response.data; // Array of users
    } catch (error) {
        throw error; // Handle the error in the component
    }
};

export const getUserById = async (id) => {
    try {
        const response = await api.get(`/User/${id}`);
        return response.data; // User data
    } catch (error) {
        throw error; // Handle the error in the component
    }
};

// Service function to delete a user by ID
export const deleteUser = async (id) => {
    try {
        await api.delete(`/User/${id}`);
    } catch (error) {
        throw error; // Handle the error in the component
    }
};

// Update a user by ID
export const updateUser = async (id, userData) => {
    try {
        const response = await api.put(`/User/${id}`, userData);
        return response.data; // Updated user
    } catch (error) {
        throw error; // Handle the error in the component
    }
};