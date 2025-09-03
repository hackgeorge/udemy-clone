import React, { createContext, useContext, useState } from 'react';
import { courseService } from '../services/courseService';
import { useToast } from './ToastContext';
import type { CourseResponse, CreateCourseRequest, CourseSearchRequest } from '../types';

interface CourseContextType {
  courses: CourseResponse[];
  currentCourse: CourseResponse | null;
  featuredCourses: CourseResponse[];
  myCourses: CourseResponse[];
  enrolledCourses: CourseResponse[];
  searchResults: CourseResponse[];
  isLoading: boolean;
  loadCourses: () => Promise<void>;
  loadCourseById: (id: string) => Promise<void>;
  loadFeaturedCourses: () => Promise<void>;
  loadMyCourses: () => Promise<void>;
  loadEnrolledCourses: () => Promise<void>;
  searchCourses: (criteria: CourseSearchRequest) => Promise<void>;
  createCourse: (data: CreateCourseRequest) => Promise<CourseResponse>;
  updateCourse: (id: string, data: CreateCourseRequest) => Promise<CourseResponse>;
  deleteCourse: (id: string) => Promise<void>;
  enrollInCourse: (courseId: string) => Promise<void>;
  getCoursesByCategory: (categoryId: string) => Promise<CourseResponse[]>;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

interface CourseProviderProps {
  children: React.ReactNode;
}

export const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [currentCourse, setCurrentCourse] = useState<CourseResponse | null>(null);
  const [featuredCourses, setFeaturedCourses] = useState<CourseResponse[]>([]);
  const [myCourses, setMyCourses] = useState<CourseResponse[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<CourseResponse[]>([]);
  const [searchResults, setSearchResults] = useState<CourseResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const loadCourses = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const data = await courseService.getAllCourses();
      setCourses(data);
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadCourseById = async (id: string): Promise<void> => {
    try {
      setIsLoading(true);
      const course = await courseService.getCourseById(id);
      setCurrentCourse(course);
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadFeaturedCourses = async (): Promise<void> => {
    try {
      const data = await courseService.getFeaturedCourses();
      setFeaturedCourses(data);
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.message,
      });
    }
  };

  const loadMyCourses = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const data = await courseService.getMyCourses();
      setMyCourses(data);
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadEnrolledCourses = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const data = await courseService.getEnrolledCourses();
      setEnrolledCourses(data);
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const searchCourses = async (criteria: CourseSearchRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const data = await courseService.searchCourses(criteria);
      setSearchResults(data);
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createCourse = async (data: CreateCourseRequest): Promise<CourseResponse> => {
    try {
      const course = await courseService.createCourse(data);
      setMyCourses(prev => [...prev, course]);
      addToast({
        type: 'success',
        message: 'Course created successfully!',
      });
      return course;
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.message,
      });
      throw error;
    }
  };

  const updateCourse = async (id: string, data: CreateCourseRequest): Promise<CourseResponse> => {
    try {
      const updatedCourse = await courseService.updateCourse(id, data);
      setMyCourses(prev => 
        prev.map(course => course.id === id ? updatedCourse : course)
      );
      addToast({
        type: 'success',
        message: 'Course updated successfully!',
      });
      return updatedCourse;
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.message,
      });
      throw error;
    }
  };

  const deleteCourse = async (id: string): Promise<void> => {
    try {
      await courseService.deleteCourse(id);
      setMyCourses(prev => prev.filter(course => course.id !== id));
      addToast({
        type: 'success',
        message: 'Course deleted successfully!',
      });
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.message,
      });
    }
  };

  const enrollInCourse = async (courseId: string): Promise<void> => {
    try {
      await courseService.enrollInCourse(courseId);
      addToast({
        type: 'success',
        message: 'Successfully enrolled in course!',
      });
      // Refresh enrolled courses
      loadEnrolledCourses();
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.message,
      });
    }
  };

  const getCoursesByCategory = async (categoryId: string): Promise<CourseResponse[]> => {
    try {
      return await courseService.getCoursesByCategory(categoryId);
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.message,
      });
      return [];
    }
  };

  const value: CourseContextType = {
    courses,
    currentCourse,
    featuredCourses,
    myCourses,
    enrolledCourses,
    searchResults,
    isLoading,
    loadCourses,
    loadCourseById,
    loadFeaturedCourses,
    loadMyCourses,
    loadEnrolledCourses,
    searchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    enrollInCourse,
    getCoursesByCategory,
  };

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = (): CourseContextType => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};