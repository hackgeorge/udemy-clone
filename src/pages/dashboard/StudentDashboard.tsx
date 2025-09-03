import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Award, TrendingUp, Play, CheckCircle } from 'lucide-react';
import { useCourses } from '../../contexts/CourseContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import CourseCard from '../../components/ui/CourseCard';
import Loading from '../../components/ui/Loading';

const StudentDashboard: React.FC = () => {
  const { enrolledCourses, isLoading, loadEnrolledCourses } = useCourses();
  const { user } = useAuth();

  useEffect(() => {
    loadEnrolledCourses();
  }, []);

  // Mock progress data - in real app this would come from API
  const mockProgress = {
    totalCourses: enrolledCourses.length,
    completedCourses: Math.floor(enrolledCourses.length * 0.3),
    hoursLearned: Math.floor(Math.random() * 50 + 20),
    certificates: Math.floor(enrolledCourses.length * 0.2),
  };

  if (isLoading) {
    return <Loading text="Loading your dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Continue your learning journey and achieve your goals
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 rounded-lg p-3">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{mockProgress.totalCourses}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Enrolled Courses</h3>
            <p className="text-sm text-gray-600">Active learning paths</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 rounded-lg p-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{mockProgress.completedCourses}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Completed</h3>
            <p className="text-sm text-gray-600">Courses finished</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 rounded-lg p-3">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{mockProgress.hoursLearned}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Hours Learned</h3>
            <p className="text-sm text-gray-600">Time invested</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 rounded-lg p-3">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{mockProgress.certificates}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Certificates</h3>
            <p className="text-sm text-gray-600">Achievements earned</p>
          </div>
        </div>

        {/* Continue Learning */}
        {enrolledCourses.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Continue Learning</h2>
              <Link to="/courses/enrolled">
                <Button variant="outline">View All</Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.slice(0, 3).map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                  <div className="aspect-w-16 aspect-h-9 relative">
                    <img
                      src={course.thumbnailUrl || `https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg`}
                      alt={course.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <Link to={`/courses/${course.id}/learn`}>
                        <Button className="bg-white text-gray-900 hover:bg-gray-100">
                          <Play className="w-5 h-5 mr-2" />
                          Continue
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{course.instructorName}</p>
                    
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-medium text-gray-900">
                          {Math.floor(Math.random() * 80 + 10)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.floor(Math.random() * 80 + 10)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/courses"
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all duration-300 group"
            >
              <div className="bg-blue-100 rounded-lg p-3 w-fit mb-4 group-hover:bg-blue-200 transition-colors">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Explore Courses</h3>
              <p className="text-gray-600">Find new courses to expand your skills</p>
            </Link>

            <Link
              to="/certificates"
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all duration-300 group"
            >
              <div className="bg-yellow-100 rounded-lg p-3 w-fit mb-4 group-hover:bg-yellow-200 transition-colors">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">My Certificates</h3>
              <p className="text-gray-600">View and download your achievements</p>
            </Link>

            <Link
              to="/profile"
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all duration-300 group"
            >
              <div className="bg-purple-100 rounded-lg p-3 w-fit mb-4 group-hover:bg-purple-200 transition-colors">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Learning Goals</h3>
              <p className="text-gray-600">Set and track your learning objectives</p>
            </Link>
          </div>
        </section>

        {/* Recently Enrolled */}
        {enrolledCourses.length === 0 && (
          <section>
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Start Your Learning Journey</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                You haven't enrolled in any courses yet. Explore our catalog to find the perfect course for you.
              </p>
              <Link to="/courses">
                <Button size="lg">
                  Browse Courses
                </Button>
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;