import { API_ENDPOINTS } from '../config/api';
import { setToken, setUser, clearAuth, getUser } from '../utils/auth';
import { apiRequest } from './api';
import type { LoginRequest, RegisterRequest, AuthResponse, User } from '../types';

class AuthService {
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiRequest.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
      
      if (response.data.success && response.data.data) {
        const authData = response.data.data;
        setToken(authData.token);
        setUser(authData.user);
        return authData;
      }
      
      throw new Error(response.data.message || 'Login failed');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiRequest.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
      
      if (response.data.success && response.data.data) {
        const authData = response.data.data;
        setToken(authData.token);
        setUser(authData.user);
        return authData;
      }
      
      throw new Error(response.data.message || 'Registration failed');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  async validateToken(): Promise<boolean> {
    try {
      const response = await apiRequest.post(API_ENDPOINTS.AUTH.VALIDATE);
      return response.data.success;
    } catch {
      clearAuth();
      return false;
    }
  }

  logout(): void {
    clearAuth();
    window.location.href = '/';
  }

  getCurrentUser(): User | null {
    return getUser();
  }

  isAuthenticated(): boolean {
    const user = getUser();
    return !!user;
  }

  hasRole(role: string): boolean {
    const user = getUser();
    return user?.role === role;
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  isInstructor(): boolean {
    return this.hasRole('INSTRUCTOR');
  }

  isStudent(): boolean {
    return this.hasRole('USER') || this.hasRole('STUDENT');
  }
}

export const authService = new AuthService();