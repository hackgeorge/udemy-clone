import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, BookOpen, Users, DollarSign, TrendingUp, Edit, Trash2, Eye } from 'lucide-react';
import { useCourses } from '../../contexts/CourseContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import CourseForm from '../../components/forms/CourseForm';
import Loading from '../../components/ui/Loading';
import type { CreateCourseRequest } from '../../types';

const InstructorDashboard: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const { myCourses, isLoading, loadMyCourses, createCourse, updateCourse, deleteCourse } = useCourses();
  const { user } = useAuth();

  useEffect(() => {
    loadMyCourses();
  }, []);

  const handleCreateCourse = async (data: CreateCourseRequest) => {
    try {
      await createCourse(data);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create course:', error);
    }
  };

  const handleUpdateCourse = async (data: CreateCourseRequest) => {
    if (!editingCourse) return;
    
    try {
      await updateCourse(editingCourse.id, data);
      setEditingCourse(null);
    } catch (error) {
      console.error('Failed to update course:', error);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      await deleteCourse(courseId);
    }
  };

  // Mock analytics data - in real app this would come from API
  const mockStats = {
    totalStudents: myCourses.reduce((sum, course) => sum + course.enrolledStudentsCount, 0),
    totalRevenue: myCourses.reduce((sum, course) => sum + (course.price * course.enrolledStudentsCount), 0),
    averageRating: myCourses.length > 0 
      ? myCourses.reduce((sum, course) => sum + course.averageRating, 0) / myCourses.length
      : 0,
    publishedCourses: myCourses.filter(course => course.isPublished).length,
  };

  if (isLoading) {
    return <Loading text="Loading instructor dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
            <p className="text-gray-600">Manage your courses and track performance</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} icon={Plus}>
            Create New Course
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 rounded-lg p-3">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{myCourses.length}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Total Courses</h3>
            <p className="text-sm text-gray-600">{mockStats.publishedCourses} published</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 rounded-lg p-3">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{mockStats.totalStudents.toLocaleString()}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Total Students</h3>
            <p className="text-sm text-gray-600">Across all courses</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 rounded-lg p-3">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">${mockStats.totalRevenue.toLocaleString()}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Total Revenue</h3>
            <p className="text-sm text-gray-600">Lifetime earnings</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 rounded-lg p-3">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{mockStats.averageRating.toFixed(1)}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Avg. Rating</h3>
            <p className="text-sm text-gray-600">Student feedback</p>
          </div>
        </div>

        {/* My Courses */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
            {myCourses.length > 0 && (
              <div className="flex items-center space-x-3">
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option>All Status</option>
                  <option>Published</option>
                  <option>Draft</option>
                </select>
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option>Sort by Date</option>
                  <option>Sort by Students</option>
                  <option>Sort by Revenue</option>
                </select>
              </div>
            )}
          </div>

          {myCourses.length > 0 ? (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Students
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {myCourses.map((course) => (
                      <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={course.thumbnailUrl || `https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg`}
                              alt={course.title}
                              className="w-16 h-12 object-cover rounded"
                            />
                            <div>
                              <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                                {course.title}
                              </h3>
                              <p className="text-sm text-gray-500">{course.categoryName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            course.isPublished 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {course.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {course.enrolledStudentsCount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {course.averageRating.toFixed(1)} ⭐
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          ${(course.price * course.enrolledStudentsCount).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Link to={`/courses/${course.id}`}>
                              <Button size="sm" variant="ghost" icon={Eye}>
                                <span className="sr-only">View</span>
                              </Button>
                            </Link>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              icon={Edit}
                              onClick={() => setEditingCourse(course)}
                            >
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              icon={Trash2}
                              onClick={() => handleDeleteCourse(course.id)}
                            >
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Create Your First Course</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Share your knowledge with the world. Start creating your first course and begin your teaching journey.
              </p>
              <Button onClick={() => setShowCreateModal(true)} size="lg" icon={Plus}>
                Create Course
              </Button>
            </div>
          )}
        </section>
      </div>

      {/* Create Course Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Course"
        size="lg"
      >
        <CourseForm
          onSubmit={handleCreateCourse}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Edit Course Modal */}
      <Modal
        isOpen={!!editingCourse}
        onClose={() => setEditingCourse(null)}
        title="Edit Course"
        size="lg"
      >
        {editingCourse && (
          <CourseForm
            initialData={editingCourse}
            onSubmit={handleUpdateCourse}
            onCancel={() => setEditingCourse(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default InstructorDashboard;