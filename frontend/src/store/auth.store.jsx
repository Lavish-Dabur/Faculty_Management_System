import { create } from 'zustand';
import axios from '../utils/axios';

const useAuth = create((set) => ({
  user: null,
  isLoading: true,
  error: null,

  login: async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      set({ user: response.data.user, error: null });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Login failed' });
      throw error;
    }
  },

  signup: async (userData) => {
    try {
      const response = await axios.post('/api/auth/signup', userData);
      set({ user: response.data.user, error: null });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Signup failed' });
      throw error;
    }
  },

  logout: async () => {
    try {
      await axios.post('/api/auth/logout');
      set({ user: null, error: null });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  updateUser: (userData) => {
    set({ user: userData });
  },

  checkAuth: async () => {
    try {
      const response = await axios.get('/api/auth/check');
      set({ user: response.data.user, isLoading: false });
    } catch (error) {
      set({ user: null, isLoading: false });
    }
  },

  clearError: () => set({ error: null })
}));

export { useAuth };