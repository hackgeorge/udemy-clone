import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CourseProvider } from './contexts/CourseContext';
import { CategoryProvider } from './contexts/CategoryContext';
import { ToastProvider } from './contexts/ToastContext';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Public Pages
import HomePage from './pages/public/HomePage';
import CourseCatalogPage from './pages/public/CourseCatalogPage';
import CourseDetailsPage from './pages/public/CourseDetailsPage';
import CategoryPage from './pages/public/CategoryPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Protected Pages
import StudentDashboard from './pages/dashboard/StudentDashboard';
import InstructorDashboard from './pages/dashboard/InstructorDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import ProfilePage from './pages/profile/ProfilePage';
import SettingsPage from './pages/settings/SettingsPage';

// Route Protection
import ProtectedRoute from './components/common/ProtectedRoute';
import { Toaster } from './components/ui/Toaster';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CourseProvider>
          <CategoryProvider>
            <Router>
              <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header />
                
                <main className="flex-1">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/courses" element={<CourseCatalogPage />} />
                    <Route path="/courses/:id" element={<CourseDetailsPage />} />
                    <Route path="/categories/:id" element={<CategoryPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    
                    {/* Protected Routes */}
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <StudentDashboard />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/instructor" element={
                      <ProtectedRoute requiredRole="INSTRUCTOR">
                        <InstructorDashboard />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/admin" element={
                      <ProtectedRoute requiredRole="ADMIN">
                        <AdminDashboard />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/settings" element={
                      <ProtectedRoute>
                        <SettingsPage />
                      </ProtectedRoute>
                    } />
                    
                    {/* Catch all - redirect to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
                
                <Footer />
                <Toaster />
              </div>
            </Router>
          </CategoryProvider>
        </CourseProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;