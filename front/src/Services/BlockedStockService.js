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
    
    // Log response status and headers for debugging
    console.log("API Response Status:", response.status);
    console.log("API Response Data:", response.data);

    // Check if data exists and is valid
    if (response.status === 200 && Array.isArray(response.data)) {
      return response.data;  // Return the data if everything is correct
    } else {
      console.error('Unexpected API response format:', response);
      return [];  // Return an empty array as fallback
    }

  } catch (error) {
    // Log detailed error for better debugging
    if (error.response) {
      console.error('Error Status:', error.response.status);
      console.error('Error Data:', error.response.data);
    } else {
      console.error('Error Message:', error.message);
    }
    throw error;  // Propagate the error to be handled by the component
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

// Function to get missing fields count by plant and team
export const getMissingFieldsCountByPlantAndTeam = async () => {
  try {
    const response = await api.get('/BlockedStock/missing-fields-count-by-plant-and-team'); // Updated endpoint
    return response.data; // Returns array of missing fields count by plant and team
  } catch (error) {
    console.error('Error fetching missing fields count by plant and team:', error);
    throw error;
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


// export const getBlockedStockByProductType1 = async () => {
//   try {
//       const response = await api.get('/BlockedStock/product-type1');
//       return response.data;
//   } catch (error) {
//       console.error('Error fetching blocked stock by product type 1:', error);
//       throw error;
//   }
// };

// // Function to get blocked stock by product type 2
// export const getBlockedStockByProductType2 = async () => {
//   try {
//       const response = await api.get('/BlockedStock/product-type2');
//       return response.data;
//   } catch (error) {
//       console.error('Error fetching blocked stock by product type 2:', error);
//       throw error;
//   }
// };

// // Function to get blocked stock by processing time
// export const getBlockedStockByProcessingTime = async () => {
//   try {
//       const response = await api.get('/BlockedStock/processing-time');
//       return response.data;
//   } catch (error) {
//       console.error('Error fetching blocked stock by processing time:', error);
//       throw error;
//   }
// };