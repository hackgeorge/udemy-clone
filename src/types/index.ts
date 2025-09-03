// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
}

// User & Auth Types
export type UserRole = 'ADMIN' | 'INSTRUCTOR' | 'USER' | 'STUDENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bio?: string;
  profilePictureUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Category Types
export interface CategoryResponse {
  id: string;
  name: string;
  description?: string;
  parentCategoryId?: string;
  parentCategoryName?: string;
  hasSubCategories: boolean;
  subCategoriesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  parentCategoryId?: string;
}

// Course Types
export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface CreateCourseRequest {
  title: string;
  description: string;
  shortDescription: string;
  price: number;
  categoryId: string;
  level: CourseLevel;
  language: string;
  duration: number; // in minutes
  requirements?: string;
  whatYouWillLearn?: string;
  targetAudience?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  hasCertificate?: boolean;
  hasLifetimeAccess?: boolean;
  tags?: string[];
  thumbnailUrl?: string;
  previewVideoUrl?: string;
}

export interface CourseResponse {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  price: number;
  discountedPrice?: number;
  currency: string;
  categoryId: string;
  categoryName: string;
  instructorId: string;
  instructorName: string;
  level: CourseLevel;
  language: string;
  duration: number;
  totalLectures: number;
  enrolledStudentsCount: number;
  averageRating: number;
  totalReviews: number;
  thumbnailUrl?: string;
  previewVideoUrl?: string;
  requirements?: string;
  whatYouWillLearn?: string;
  targetAudience?: string;
  isPublished: boolean;
  isFeatured: boolean;
  hasCertificate: boolean;
  hasLifetimeAccess: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isEnrolled?: boolean;
}

export interface CourseSearchRequest {
  keyword?: string;
  categoryId?: string;
  level?: CourseLevel;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  language?: string;
  hasCertificate?: boolean;
  hasLifetimeAccess?: boolean;
  page?: number;
  size?: number;
  sortBy?: 'title' | 'price' | 'averageRating' | 'createdAt';
  sortDirection?: 'asc' | 'desc';
}

// Enrollment Types
export interface EnrollmentResponse {
  id: string;
  courseId: string;
  studentId: string;
  enrolledAt: string;
  progress: number; // 0-100
  completedAt?: string;
  certificateUrl?: string;
}

// Toast Types
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}