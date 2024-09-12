import api from './api';

// Function to handle file import
export const importBlockedStockData = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/BlockedStock/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error importing blocked stock data:', error);
    throw error; // Handle the error in the component
  }
};

// Function to get blocked stock data
export const getBlockedStockData = async () => {
  try {
    const response = await api.get('/BlockedStock');
    return response.data; // Array of blocked stock data
  } catch (error) {
    console.error('Error fetching blocked stock data:', error);
    throw error; // Handle the error in the component
  }
};

// Function to update blocked stock data
export const updateBlockedStock = async (id, updatedData) => {
  try {
    const response = await api.put(`/BlockedStock/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating blocked stock:', error);
    throw error;
  }
};

// Function to get the count of rows missing required fields
export const getMissingFieldsCount = async () => {
  try {
    const response = await api.get('/BlockedStock/missing-fields-count');
    return response.data; // Returns the count of rows missing required fields
  } catch (error) {
    console.error('Error fetching missing fields count:', error);
    throw error; // Handle the error in the component
  }
};

// Function to delete all blocked stock data
export const deleteAllBlockedStockData = async () => {
  try {
    const response = await api.delete('/BlockedStock/delete-all');
    return response.data; // Returns confirmation message of successful deletion
  } catch (error) {
    console.error('Error deleting all blocked stock data:', error);
    throw error; // Handle the error in the component
  }
};
