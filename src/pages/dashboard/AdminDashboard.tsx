import React, { useEffect, useState } from 'react';
import { Users, BookOpen, TrendingUp, DollarSign, Plus, Edit, Trash2 } from 'lucide-react';
import { useCourses } from '../../contexts/CourseContext';
import { useCategories } from '../../contexts/CategoryContext';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import CategoryForm from '../../components/forms/CategoryForm';
import Loading from '../../components/ui/Loading';
import type { CreateCategoryRequest } from '../../types';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'categories' | 'courses' | 'users'>('overview');
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  
  const { courses, isLoading: coursesLoading, loadCourses } = useCourses();
  const { 
    categories, 
    parentCategories,
    isLoading: categoriesLoading, 
    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory 
  } = useCategories();

  useEffect(() => {
    loadCourses();
    loadCategories();
  }, []);

  const handleCreateCategory = async (data: CreateCategoryRequest) => {
    try {
      await createCategory(data);
      setShowCreateCategoryModal(false);
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };

  const handleUpdateCategory = async (data: CreateCategoryRequest) => {
    if (!editingCategory) return;
    
    try {
      await updateCategory(editingCategory.id, data);
      setEditingCategory(null);
    } catch (error) {
      console.error('Failed to update category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      await deleteCategory(categoryId);
    }
  };

  // Mock statistics
  const stats = {
    totalUsers: 125847,
    totalCourses: courses.length,
    totalCategories: categories.length,
    totalRevenue: 2847592,
  };

  const isLoading = coursesLoading || categoriesLoading;

  if (isLoading) {
    return <Loading text="Loading admin dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage the platform and monitor performance</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'categories', label: 'Categories' },
              { id: 'courses', label: 'Courses' },
              { id: 'users', label: 'Users' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-100 rounded-lg p-3">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Total Users</h3>
                <p className="text-sm text-green-600">+12.5% from last month</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-100 rounded-lg p-3">
                    <BookOpen className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{stats.totalCourses}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Total Courses</h3>
                <p className="text-sm text-green-600">+8.2% from last month</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-purple-100 rounded-lg p-3">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{stats.totalCategories}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Categories</h3>
                <p className="text-sm text-blue-600">{parentCategories.length} main categories</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-yellow-100 rounded-lg p-3">
                    <DollarSign className="w-6 h-6 text-yellow-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Total Revenue</h3>
                <p className="text-sm text-green-600">+15.3% from last month</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(item => (
                  <div key={item} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">New user registered: user{item}@example.com</span>
                    </div>
                    <span className="text-xs text-gray-500">{item} hours ago</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <Button onClick={() => setShowCreateCategoryModal(true)} icon={Plus}>
                Add Category
              </Button>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Parent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subcategories
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map((category) => (
                      <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <h3 className="text-sm font-medium text-gray-900">{category.name}</h3>
                          {category.description && (
                            <p className="text-sm text-gray-500 line-clamp-1">{category.description}</p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            category.parentCategoryId 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {category.parentCategoryId ? 'Subcategory' : 'Main Category'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {category.parentCategoryName || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {category.subCategoriesCount}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              icon={Edit}
                              onClick={() => setEditingCategory(category)}
                            >
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              icon={Trash2}
                              onClick={() => handleDeleteCategory(category.id)}
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
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Instructor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Students
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {courses.map((course) => (
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
                              <p className="text-sm text-gray-500">${course.price}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {course.instructorName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {course.categoryName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {course.enrolledStudentsCount.toLocaleString()}
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
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="ghost">Edit</Button>
                            <Button size="sm" variant="ghost">Delete</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Management</h3>
            <div className="text-center py-8">
              <p className="text-gray-500">User management interface would be implemented here</p>
            </div>
          </div>
        )}
      </div>

      {/* Create Category Modal */}
      <Modal
        isOpen={showCreateCategoryModal}
        onClose={() => setShowCreateCategoryModal(false)}
        title="Create New Category"
      >
        <CategoryForm
          onSubmit={handleCreateCategory}
          onCancel={() => setShowCreateCategoryModal(false)}
        />
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        title="Edit Category"
      >
        {editingCategory && (
          <CategoryForm
            initialData={editingCategory}
            onSubmit={handleUpdateCategory}
            onCancel={() => setEditingCategory(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;