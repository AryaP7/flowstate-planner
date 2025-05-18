import axios from 'axios';

// NEW (Vite way)
const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

// Auth endpoints
export const auth = {
  signin: (email: string, password: string) => 
    api.post('/auth/signin', { email, password }),
  signup: (name: string, email: string, password: string) => 
    api.post('/auth/signup', { name, email, password }),
};

// Task endpoints
export const tasks = {
  getAll: (params?: { projectId?: string; completed?: boolean; priority?: string; dueDate?: string }) => 
    api.get('/tasks', { params }),
  create: (data: any) => 
    api.post('/tasks', data),
  update: (id: string, data: any) => 
    api.put(`/tasks/${id}`, data),
  delete: (id: string) => 
    api.delete(`/tasks/${id}`),
  complete: (id: string) => 
    api.patch(`/tasks/${id}/complete`),
};

// Project endpoints
export const projects = {
  getAll: () => 
    api.get('/projects'),
  create: (data: any) => 
    api.post('/projects', data),
  update: (id: string, data: any) => 
    api.put(`/projects/${id}`, data),
  delete: (id: string) => 
    api.delete(`/projects/${id}`),
};

// Tag endpoints
export const tags = {
  getAll: () => 
    api.get('/tags'),
  create: (data: any) => 
    api.post('/tags', data),
  update: (id: string, data: any) => 
    api.put(`/tags/${id}`, data),
  delete: (id: string) => 
    api.delete(`/tags/${id}`),
};

// Analytics endpoints
export const analytics = {
  getProjectStats: () => 
    api.get('/analytics/projects'),
};

export default api; 