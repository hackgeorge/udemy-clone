import axios, { AxiosResponse, AxiosError } from 'axios';
import { API_BASE_URL } from '../config/api';
import { getToken, clearAuth } from '../utils/auth';
import type { ApiResponse } from '../types';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => response,
  (error: AxiosError<ApiResponse>) => {
    if (error.response?.status === 401) {
      clearAuth();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Generic API methods
export const apiRequest = {
  get: <T = any>(url: string): Promise<AxiosResponse<ApiResponse<T>>> =>
    api.get(url),
  
  post: <T = any>(url: string, data?: any): Promise<AxiosResponse<ApiResponse<T>>> =>
    api.post(url, data),
  
  put: <T = any>(url: string, data?: any): Promise<AxiosResponse<ApiResponse<T>>> =>
    api.put(url, data),
  
  delete: <T = any>(url: string): Promise<AxiosResponse<ApiResponse<T>>> =>
    api.delete(url),
};