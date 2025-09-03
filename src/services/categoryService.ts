import { API_ENDPOINTS } from '../config/api';
import { apiRequest } from './api';
import type { CategoryResponse, CreateCategoryRequest } from '../types';

class CategoryService {
  async getAllCategories(): Promise<CategoryResponse[]> {
    try {
      const response = await apiRequest.get<CategoryResponse[]>(API_ENDPOINTS.CATEGORIES.BASE);
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to load categories');
    }
  }

  async getParentCategories(): Promise<CategoryResponse[]> {
    try {
      const response = await apiRequest.get<CategoryResponse[]>(API_ENDPOINTS.CATEGORIES.PARENTS);
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to load parent categories');
    }
  }

  async getSubCategories(parentId: string): Promise<CategoryResponse[]> {
    try {
      const response = await apiRequest.get<CategoryResponse[]>(API_ENDPOINTS.CATEGORIES.SUBCATEGORIES(parentId));
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to load subcategories');
    }
  }

  async getCategoryById(id: string): Promise<CategoryResponse> {
    try {
      const response = await apiRequest.get<CategoryResponse>(`${API_ENDPOINTS.CATEGORIES.BASE}/${id}`);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Category not found');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to load category');
    }
  }

  async createCategory(data: CreateCategoryRequest): Promise<CategoryResponse> {
    try {
      const response = await apiRequest.post<CategoryResponse>(API_ENDPOINTS.CATEGORIES.BASE, data);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to create category');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create category');
    }
  }

  async updateCategory(id: string, data: CreateCategoryRequest): Promise<CategoryResponse> {
    try {
      const response = await apiRequest.put<CategoryResponse>(`${API_ENDPOINTS.CATEGORIES.BASE}/${id}`, data);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to update category');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update category');
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      const response = await apiRequest.delete(`${API_ENDPOINTS.CATEGORIES.BASE}/${id}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete category');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete category');
    }
  }
}

export const categoryService = new CategoryService();