import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, BookOpen } from 'lucide-react';
import { useCourses } from '../../contexts/CourseContext';
import { useCategories } from '../../contexts/CategoryContext';
import CourseCard from '../../components/ui/CourseCard';
import Loading from '../../components/ui/Loading';
import type { CategoryResponse } from '../../types';

const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<CategoryResponse | null>(null);
  const [subcategories, setSubcategories] = useState<CategoryResponse[]>([]);
  const [categoryCourses, setCategoryCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { getCoursesByCategory, enrollInCourse } = useCourses();
  const { getCategoryById, loadSubCategories } = useCategories();

  useEffect(() => {
    if (id) {
      loadCategoryData(id);
    }
  }, [id]);

  const loadCategoryData = async (categoryId: string) => {
    try {
      setIsLoading(true);
      const [categoryData, coursesData, subCategoriesData] = await Promise.all([
        getCategoryById(categoryId),
        getCoursesByCategory(categoryId),
        loadSubCategories(categoryId)
      ]);
      
      setCategory(categoryData);
      setCategoryCourses(coursesData);
      setSubcategories(subCategoriesData);
    } catch (error) {
      console.error('Failed to load category data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading text="Loading category..." />;
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category not found</h1>
          <Link to="/courses" className="text-blue-600 hover:underline">
            Browse all courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link to="/courses" className="text-gray-500 hover:text-gray-700">Courses</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            {category.parentCategoryName && (
              <>
                <span className="text-gray-500">{category.parentCategoryName}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </>
            )}
            <span className="text-gray-900 font-medium">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* Category Header */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{category.name}</h1>
          {category.description && (
            <p className="text-xl text-gray-600 mb-8 max-w-3xl">
              {category.description}
            </p>
          )}
          
          <div className="flex items-center space-x-8 text-gray-600">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>{categoryCourses.length} courses</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Subcategories */}
        {subcategories.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Subcategories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {subcategories.map((subcat) => (
                <Link
                  key={subcat.id}
                  to={`/categories/${subcat.id}`}
                  className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all duration-300 group"
                >
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {subcat.name}
                  </h3>
                  {subcat.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {subcat.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Category Courses */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Courses in {category.name}
          </h2>
          
          {categoryCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categoryCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onEnroll={enrollInCourse}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses yet</h3>
              <p className="text-gray-600 mb-6">
                This category doesn't have any courses yet. Check back later!
              </p>
              <Link to="/courses">
                <Button variant="outline">Browse All Courses</Button>
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CategoryPage;