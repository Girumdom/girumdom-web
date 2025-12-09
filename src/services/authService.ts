import axios from 'axios';
import { BACKEND_URL } from '../constant';

// 1. Define your backend URL (Make sure this matches your server)
// If you are running locally, it is usually http://localhost:3000
const API_URL = `${BACKEND_URL}`; 

// 2. The function that talks to the backend
export const loginUser = async (email: string, pass: string) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email: email,
      password: pass,
    });
    
    // Returns { token: "...", user: { ... } }
    return response.data; 
  } catch (error) {
    // Throw error so the Login page can handle it (show red text)
    throw error;
  }
};