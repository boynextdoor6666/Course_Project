import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication APIs
export const loginUser = async (email, password) => {
  const response = await api.post('/users/login', { email, password });
  return response.data;
};

export const registerUser = async (username, email, password) => {
  const response = await api.post('/users', { username, email, password });
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

// Image APIs
export const generateImage = async (prompt) => {
  const response = await api.post('/images/generate', { prompt });
  return response.data;
};

export const getAllImages = async () => {
  const response = await api.get('/images');
  return response.data;
};

export const getUserImages = async () => {
  const response = await api.get('/images/myimages');
  return response.data;
};

export const getImageById = async (id) => {
  const response = await api.get(`/images/${id}`);
  return response.data;
};

export const likeImage = async (id) => {
  const response = await api.put(`/images/${id}/like`);
  return response.data;
};

export const deleteImage = async (id) => {
  const response = await api.delete(`/images/${id}`);
  return response.data;
};

export default api; 