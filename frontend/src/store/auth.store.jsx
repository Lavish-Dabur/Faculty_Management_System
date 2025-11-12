import { create } from 'zustand';
import axios from '../utils/axios';

const useAuth = create((set) => ({
  user: null,
  isLoading: true,
  error: null,

  login: async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      const userData = {
        FacultyID: response.data.FacultyID,
        FirstName: response.data.FirstName,
        LastName: response.data.LastName,
        Email: response.data.Email,
        Role: response.data.Role,
        token: response.data.token
      };
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      set({ user: userData, error: null, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Login failed', isLoading: false });
      throw error;
    }
  },

  signup: async (userData) => {
    try {
      const response = await axios.post('/auth/signup', userData);
      const user = {
        FacultyID: response.data.FacultyID,
        FirstName: response.data.FirstName,
        LastName: response.data.LastName,
        Email: response.data.Email,
        Role: response.data.Role,
        token: response.data.token
      };
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      set({ user, error: null, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Signup failed', isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await axios.post('/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ user: null, error: null });
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ user: null, error: null });
    }
  },

  updateUser: (userData) => {
    set({ user: userData });
  },

  checkAuth: async () => {
    try {
      // Check if user data exists in localStorage
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (storedUser && token) {
        const userData = JSON.parse(storedUser);
        set({ user: userData, isLoading: false });
      } else {
        set({ user: null, isLoading: false });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      set({ user: null, isLoading: false });
    }
  },

  clearError: () => set({ error: null })
}));

// Initialize auth state on load
useAuth.getState().checkAuth();

export { useAuth };