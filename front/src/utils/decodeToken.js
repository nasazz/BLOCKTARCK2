// utils/decodeToken.js
import { jwtDecode } from 'jwt-decode';

export const getUserIdFromToken = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.sub; // or decodedToken.userId based on your claim
    } catch (error) {
      console.error('Invalid token');
      return null;
    }
  };
