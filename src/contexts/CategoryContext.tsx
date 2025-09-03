import React, { createContext, useContext, useState, useEffect } from 'react';
import { categoryService } from '../services/categoryService';
import { useToast } from './ToastContext';
import type { CategoryResponse, CreateCategoryRequest } from '../types';

interface CategoryContextType {
  categories: CategoryResponse[];
  parentCategories: CategoryResponse[];
  isLoading: boolean;
  loadCategories: () => Promise<void>;
  loadParentCategories: () => Promise<void>;
  loadSubCategories: (parentId: string) => Promise<CategoryResponse[]>;
  getCategoryById: (id: string) => Promise<CategoryResponse>;
  createCategory: (data: CreateCategoryRequest) => Promise<CategoryResponse>;
  updateCategory: (id: string, data: CreateCategoryRequest) => Promise<CategoryResponse>;
  deleteCategory: (id: string) => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

interface CategoryProviderProps {
  children: React.ReactNode;
}

export const CategoryProvider: React.FC<CategoryProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [parentCategories, setParentCategories] = useState<CategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    loadParentCategories();
  }, []);

  const loadCategories = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadParentCategories = async (): Promise<void> => {
    try {
      const data = await categoryService.getParentCategories();
      setParentCategories(data);
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.message,
      });
    }
  };

  const loadSubCategories = async (parentId: string): Promise<CategoryResponse[]> => {
    try {
      return await categoryService.getSubCategories(parentId);
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.message,
      });
      return [];
    }
  };

  const getCategoryById = async (id: string): Promise<CategoryResponse> => {
    try {
      return await categoryService.getCategoryById(id);
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.message,
      });
      throw error;
    }
  };

  const createCategory = async (data: CreateCategoryRequest): Promise<CategoryResponse> => {
    try {
      const category = await categoryService.createCategory(data);
      setCategories(prev => [...prev, category]);
      addToast({
        type: 'success',
        message: 'Category created successfully!',
      });
      return category;
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.message,
      });
      throw error;
    }
  };

  const updateCategory = async (id: string, data: CreateCategoryRequest): Promise<CategoryResponse> => {
    try {
      const updatedCategory = await categoryService.updateCategory(id, data);
      setCategories(prev => 
        prev.map(cat => cat.id === id ? updatedCategory : cat)
      );
      addToast({
        type: 'success',
        message: 'Category updated successfully!',
      });
      return updatedCategory;
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.message,
      });
      throw error;
    }
  };

  const deleteCategory = async (id: string): Promise<void> => {
    try {
      await categoryService.deleteCategory(id);
      setCategories(prev => prev.filter(cat => cat.id !== id));
      addToast({
        type: 'success',
        message: 'Category deleted successfully!',
      });
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.message,
      });
    }
  };

  const value: CategoryContextType = {
    categories,
    parentCategories,
    isLoading,
    loadCategories,
    loadParentCategories,
    loadSubCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = (): CategoryContextType => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};