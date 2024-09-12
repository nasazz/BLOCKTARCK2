// src/Services/configurationService.js
import api from './api';

// Function to fetch all teams
export const fetchTeams = async () => {
    try {
        const response = await api.get('/Configuration/teams');
        return response.data; // Array of teams
    } catch (error) {
        throw error; // Handle the error in the component
    }
};

// Function to add a team
export const addTeam = async (team) => {
    try {
        const response = await api.post('/Configuration/teams', team);
        return response.data; // Newly created team
    } catch (error) {
        throw error; // Handle the error in the component
    }
};

// Function to delete a team by ID
export const deleteTeam = async (id) => {
    try {
        await api.delete(`/Configuration/teams/${id}`);
    } catch (error) {
        throw error; // Handle the error in the component
    }
};

// Function to update a team
export const updateTeam = async (id, team) => {
    try {
        const response = await api.put(`/Configuration/teams/${id}`, team);
        return response.data; // Updated team
    } catch (error) {
        throw error; // Handle the error in the component
    }
};

// Similar functions for roles
export const fetchRoles = async () => {
    try {
        const response = await api.get('/Role');
        return response.data; // Array of roles
    } catch (error) {
        throw error; // Handle the error in the component
    }
};
export const addRole = async (roleName) => {
    try {
        // Send the role name as a plain string
        const response = await api.post('/Role', roleName, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data; // Newly created role
    } catch (error) {
        throw error; // Handle the error in the component
    }
};

// Update deleteRole to use ID rather than name
export const deleteRole = async (id) => {
    try {
        // Use ID in the API endpoint similar to deletePlant
        await api.delete(`/Role/${id}`);
    } catch (error) {
        console.error(`Failed to delete role: ${id}`, error.response || error);
        throw error; // Handle the error in the component
    }
};

export const updateRole = async (id, newRoleName) => {
    try {
        // Send the role name as a string, not as an object
        const response = await api.put(`/Role/${id}`, newRoleName, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data; // Updated role
    } catch (error) {
        throw error; // Handle the error in the component
    }
};


// Similar functions for plants
export const fetchPlants = async () => {
    try {
        const response = await api.get('/Configuration/plants');
        return response.data; // Array of plants
    } catch (error) {
        throw error; // Handle the error in the component
    }
};

export const addPlant = async (plant) => {
    try {
        const response = await api.post('/Configuration/plants', plant);
        return response.data; // Newly created plant
    } catch (error) {
        throw error; // Handle the error in the component
    }
};

export const deletePlant = async (id) => {
    try {
        await api.delete(`/Configuration/plants/${id}`);
    } catch (error) {
        throw error; // Handle the error in the component
    }
};

export const updatePlant = async (id, plant) => {
    try {
        const response = await api.put(`/Configuration/plants/${id}`, plant);
        return response.data; // Updated plant
    } catch (error) {
        throw error; // Handle the error in the component
    }
};

export const fetchDepartments = async () => {
    try {
        const response = await api.get('/Configuration/departments');
        return response.data; // Array of departments
    } catch (error) {
        throw error; // Handle the error in the component
    }
};

export const addDepartment = async (department) => {
    try {
        const response = await api.post('/Configuration/departments', department);
        return response.data; // Newly created department
    } catch (error) {
        throw error; // Handle the error in the component
    }
};

export const deleteDepartment = async (id) => {
    try {
        await api.delete(`/Configuration/departments/${id}`);
    } catch (error) {
        throw error; // Handle the error in the component
    }
};

export const updateDepartment = async (id, department) => {
    try {
        const response = await api.put(`/Configuration/departments/${id}`, department);
        return response.data; // Updated department
    } catch (error) {
        throw error; // Handle the error in the component
    }
};
