// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5091/api'; // Adjust this URL as per your .NET API's URL

// Create an Axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Attach the token to the Authorization header if it exists
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // or sessionStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
