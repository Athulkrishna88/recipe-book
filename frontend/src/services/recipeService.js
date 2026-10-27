import axios from 'axios';

// Use environment variable or fall back to relative /api (handled by Vite proxy)
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Response interceptor to handle errors systematically
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message:
        error.response?.data?.message ||
        error.message ||
        'An unexpected server error occurred',
      status: error.response?.status || 500
    };
    return Promise.reject(customError);
  }
);

export const recipeService = {
  // Fetch all recipes (supports optional query filters)
  getAll: async (params = {}) => {
    const response = await api.get('/recipes', { params });
    return response.data;
  },

  // Fetch single recipe by ID
  getById: async (id) => {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  },

  // Create new recipe
  create: async (recipeData) => {
    const response = await api.post('/recipes', recipeData);
    return response.data;
  },

  // Update existing recipe by ID
  update: async (id, recipeData) => {
    const response = await api.put(`/recipes/${id}`, recipeData);
    return response.data;
  },

  // Delete recipe by ID
  delete: async (id) => {
    const response = await api.delete(`/recipes/${id}`);
    return response.data;
  }
};

export default recipeService;
