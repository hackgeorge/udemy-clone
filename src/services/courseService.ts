import { API_ENDPOINTS } from '../config/api';
import { apiRequest } from './api';
import type { CourseResponse, CreateCourseRequest, CourseSearchRequest } from '../types';

class CourseService {
  async getAllCourses(): Promise<CourseResponse[]> {
    try {
      const response = await apiRequest.get<CourseResponse[]>(API_ENDPOINTS.COURSES.BASE);
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to load courses');
    }
  }

  async getCourseById(id: string): Promise<CourseResponse> {
    try {
      const response = await apiRequest.get<CourseResponse>(`${API_ENDPOINTS.COURSES.BASE}/${id}`);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Course not found');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to load course');
    }
  }

  async createCourse(data: CreateCourseRequest): Promise<CourseResponse> {
    try {
      const response = await apiRequest.post<CourseResponse>(API_ENDPOINTS.COURSES.BASE, data);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to create course');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create course');
    }
  }

  async updateCourse(id: string, data: CreateCourseRequest): Promise<CourseResponse> {
    try {
      const response = await apiRequest.put<CourseResponse>(`${API_ENDPOINTS.COURSES.BASE}/${id}`, data);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to update course');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update course');
    }
  }

  async deleteCourse(id: string): Promise<void> {
    try {
      const response = await apiRequest.delete(`${API_ENDPOINTS.COURSES.BASE}/${id}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete course');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete course');
    }
  }

  async searchCourses(criteria: CourseSearchRequest): Promise<CourseResponse[]> {
    try {
      const response = await apiRequest.post<CourseResponse[]>(API_ENDPOINTS.COURSES.SEARCH, criteria);
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to search courses');
    }
  }

  async enrollInCourse(courseId: string): Promise<void> {
    try {
      const response = await apiRequest.post(API_ENDPOINTS.COURSES.ENROLL(courseId));
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to enroll in course');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to enroll in course');
    }
  }

  async getEnrolledCourses(): Promise<CourseResponse[]> {
    try {
      const response = await apiRequest.get<CourseResponse[]>(API_ENDPOINTS.COURSES.ENROLLED);
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to load enrolled courses');
    }
  }

  async getMyCourses(): Promise<CourseResponse[]> {
    try {
      const response = await apiRequest.get<CourseResponse[]>(API_ENDPOINTS.COURSES.MY_COURSES);
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to load my courses');
    }
  }

  async getFeaturedCourses(): Promise<CourseResponse[]> {
    try {
      const response = await apiRequest.get<CourseResponse[]>(API_ENDPOINTS.COURSES.FEATURED);
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to load featured courses');
    }
  }

  async getCoursesByCategory(categoryId: string): Promise<CourseResponse[]> {
    try {
      const response = await apiRequest.get<CourseResponse[]>(API_ENDPOINTS.COURSES.BY_CATEGORY(categoryId));
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to load category courses');
    }
  }
}

export const courseService = new CourseService();