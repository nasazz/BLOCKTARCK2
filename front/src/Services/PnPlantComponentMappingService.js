// src/Services/pnPlantComponentMappingService.js
import api from './api'; // Assuming you have an Axios instance configured as `api`.

// Fetch all PnPlantComponent mappings
export const fetchMappingsFromPnPlant = async () => {
    try {
        const response = await api.get('/PnPlantComponentMapping'); // Adjust the endpoint as necessary
        return response.data; // Array of mappings
    } catch (error) {
        throw error; // Handle the error in the component
    }
};

// Fetch mapping by PnPlant
export const fetchMappingByPnPlant = async (pnPlant) => {
    try {
        const response = await api.get(`/PnPlantComponentMapping/${pnPlant}`); // Adjust the endpoint as necessary
        return response.data; // Mapping for the specified PnPlant
    } catch (error) {
        throw error; // Handle the error in the component
    }
};

// Create new mapping
export const createMappingFromPnPlant = async (mapping) => {
    try {
        const response = await api.post('/PnPlantComponentMapping', mapping); // Adjust the endpoint as necessary
        return response.data; // Newly created mapping
    } catch (error) {
        throw error; // Handle the error in the component
    }
};

// Update existing mapping
export const updateMappingFromPnPlant = async (id, mapping) => {
    try {
        const response = await api.put(`/PnPlantComponentMapping/${id}`, mapping); // Adjust the endpoint as necessary
        return response.data; // Updated mapping
    } catch (error) {
        throw error; // Handle the error in the component
    }
};

// Delete a mapping
export const deleteMappingFromPnPlant = async (id) => {
    try {
        await api.delete(`/PnPlantComponentMapping/${id}`); // Adjust the endpoint as necessary
    } catch (error) {
        throw error; // Handle the error in the component
    }
};
