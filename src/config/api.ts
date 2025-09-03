export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
export const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:8080/graphql';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    VALIDATE: '/api/auth/validate',
  },
  ADMIN: {
    BOOTSTRAP: '/api/bootstrap/admin',
    BASE: '/api/admin',
  },
  CATEGORIES: {
    BASE: '/api/categories',
    PARENTS: '/api/categories/parents',
    SUBCATEGORIES: (id: string) => `/api/categories/${id}/subcategories`,
  },
  COURSES: {
    BASE: '/api/courses',
    MY_COURSES: '/api/courses/my-courses',
    FEATURED: '/api/courses/featured',
    SEARCH: '/api/courses/search',
    ENROLL: (id: string) => `/api/courses/${id}/enroll`,
    ENROLLED: '/api/courses/enrolled',
    BY_CATEGORY: (categoryId: string) => `/api/courses/category/${categoryId}`,
  },
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;