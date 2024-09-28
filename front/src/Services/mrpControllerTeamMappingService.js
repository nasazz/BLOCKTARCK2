// src/Services/mrpControllerTeamMappingService.js
import api from './api'; // Assuming you have an Axios instance configured as `api`.

// Fetch all MRP Controller mappings
export const fetchMappings = async () => {
    try {
        const response = await api.get('/MRPControllerTeamMapping');
        return response.data; // Array of mappings
    } catch (error) {
        throw error; // Handle the error in the component
    }
};

// Fetch mapping by MRP Controller
export const fetchMappingByController = async (mrpController) => {
    try {
        const response = await api.get(`/MRPControllerTeamMapping/${mrpController}`);
        return response.data; // Mapping for the specified MRP Controller
    } catch (error) {
        throw error; // Handle the error in the component
    }
};

// Create new mapping
export const createMapping = async (mapping) => {
    try {
        const response = await api.post('/MRPControllerTeamMapping', mapping);
        return response.data; // Newly created mapping
    } catch (error) {
        throw error; // Handle the error in the component
    }
};

// Update existing mapping
export const updateMapping = async (id, mapping) => {
    try {
        const response = await api.put(`/MRPControllerTeamMapping/${id}`, mapping);
        return response.data; // Updated mapping
    } catch (error) {
        throw error; // Handle the error in the component
    }
};

// Delete a mapping
export const deleteMapping = async (id) => {
    try {
        await api.delete(`/MRPControllerTeamMapping/${id}`);
    } catch (error) {
        throw error; // Handle the error in the component
    }
};
