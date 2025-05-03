import axios from 'axios';

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true, // Important for cookies/auth
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
