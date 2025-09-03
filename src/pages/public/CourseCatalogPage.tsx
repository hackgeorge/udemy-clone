import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Grid, List, SlidersHorizontal, BookOpen } from 'lucide-react';
import { useCourses } from '../../contexts/CourseContext';
import { useCategories } from '../../contexts/CategoryContext';
import CourseCard from '../../components/ui/CourseCard';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Loading from '../../components/ui/Loading';
import type { CourseSearchRequest, CourseLevel } from '../../types';

const CourseCatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<CourseSearchRequest>({
    keyword: searchParams.get('search') || '',
    categoryId: searchParams.get('category') || '',
    level: (searchParams.get('level') as CourseLevel) || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    sortBy: (searchParams.get('sortBy') as any) || 'createdAt',
    sortDirection: (searchParams.get('sortDirection') as 'asc' | 'desc') || 'desc',
    page: 0,
    size: 20,
  });

  const { searchResults, isLoading, searchCourses, enrollInCourse } = useCourses();
  const { parentCategories } = useCategories();

  useEffect(() => {
    performSearch();
  }, []);

  const performSearch = async () => {
    await searchCourses(filters);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newFilters = { ...filters, keyword: searchQuery };
    setFilters(newFilters);
    updateSearchParams(newFilters);
    searchCourses(newFilters);
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateSearchParams(newFilters);
    searchCourses(newFilters);
  };

  const updateSearchParams = (newFilters: CourseSearchRequest) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        params.set(key, String(value));
      }
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    const clearedFilters: CourseSearchRequest = {
      keyword: '',
      page: 0,
      size: 20,
      sortBy: 'createdAt',
      sortDirection: 'desc',
    };
    setFilters(clearedFilters);
    setSearchQuery('');
    setSearchParams({});
    searchCourses(clearedFilters);
  };

  const levelOptions = [
    { value: '', label: 'All Levels' },
    { value: 'BEGINNER', label: 'Beginner' },
    { value: 'INTERMEDIATE', label: 'Intermediate' },
    { value: 'ADVANCED', label: 'Advanced' },
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Newest' },
    { value: 'averageRating', label: 'Highest Rated' },
    { value: 'price', label: 'Price' },
    { value: 'title', label: 'Title' },
  ];

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...parentCategories.map(cat => ({ value: cat.id, label: cat.name }))
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Course Catalog</h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for courses..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Button type="submit" size="lg">
              Search
            </Button>
          </form>

          {/* Toolbar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                icon={SlidersHorizontal}
              >
                Filters
              </Button>
              
              <span className="text-gray-600">
                {searchResults.length} courses found
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
              
              <Select
                options={sortOptions}
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-40"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`w-80 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>

              <Select
                label="Category"
                options={categoryOptions}
                value={filters.categoryId || ''}
                onChange={(e) => handleFilterChange('categoryId', e.target.value)}
              />

              <Select
                label="Level"
                options={levelOptions}
                value={filters.level || ''}
                onChange={(e) => handleFilterChange('level', e.target.value)}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Min Price"
                  type="number"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="0"
                />
                <Input
                  label="Max Price"
                  type="number"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="1000"
                />
              </div>

              <Input
                label="Min Rating"
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={filters.minRating || ''}
                onChange={(e) => handleFilterChange('minRating', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="4.0"
              />

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.hasCertificate || false}
                    onChange={(e) => handleFilterChange('hasCertificate', e.target.checked ? true : undefined)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Has Certificate</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.hasLifetimeAccess || false}
                    onChange={(e) => handleFilterChange('hasLifetimeAccess', e.target.checked ? true : undefined)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Lifetime Access</span>
                </label>
              </div>
            </div>
          </div>

          {/* Course Results */}
          <div className="flex-1">
            {isLoading ? (
              <Loading text="Loading courses..." />
            ) : searchResults.length > 0 ? (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-6'
              }>
                {searchResults.map((course) => (
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or browse our featured courses.
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCatalogPage;