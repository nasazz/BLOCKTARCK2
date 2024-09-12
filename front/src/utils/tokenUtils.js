// src/utils/tokenUtils.js
import { jwtDecode } from 'jwt-decode'; // Use named import

// Function to decode JWT token and extract the User ID
export const getUserIdFromToken = (token) => {
  if (!token) return null; // Return null if no token is provided
  try {
    const decoded = jwtDecode(token); // Decode the token using named import
    return decoded.sub; // Return the User ID from the 'sub' claim
  } catch (error) {
    console.error('Error decoding token:', error);
    return null; // Return null if there's an error decoding the token
  }
};
