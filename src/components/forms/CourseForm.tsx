import React from 'react';
import { useForm } from 'react-hook-form';
import { useCategories } from '../../contexts/CategoryContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import type { CreateCourseRequest, CourseLevel } from '../../types';

interface CourseFormProps {
  initialData?: Partial<CreateCourseRequest>;
  onSubmit: (data: CreateCourseRequest) => Promise<void>;
  onCancel: () => void;
}

const CourseForm: React.FC<CourseFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const { parentCategories } = useCategories();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateCourseRequest>({
    defaultValues: {
      level: 'BEGINNER',
      language: 'en',
      isPublished: false,
      isFeatured: false,
      hasCertificate: true,
      hasLifetimeAccess: true,
      ...initialData,
    },
  });

  const levelOptions = [
    { value: 'BEGINNER', label: 'Beginner' },
    { value: 'INTERMEDIATE', label: 'Intermediate' },
    { value: 'ADVANCED', label: 'Advanced' },
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'az', label: 'Azərbaycan' },
    { value: 'tr', label: 'Türkçe' },
    { value: 'ru', label: 'Русский' },
  ];

  const categoryOptions = parentCategories.map(cat => ({
    value: cat.id,
    label: cat.name,
  }));

  const handleFormSubmit = async (data: CreateCourseRequest) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Input
            label="Course Title"
            {...register('title', {
              required: 'Course title is required',
              minLength: { value: 5, message: 'Title must be at least 5 characters' },
              maxLength: { value: 200, message: 'Title cannot exceed 200 characters' }
            })}
            error={errors.title?.message}
            placeholder="Enter course title"
          />
        </div>

        <Input
          label="Short Description"
          {...register('shortDescription', {
            required: 'Short description is required',
            minLength: { value: 20, message: 'Description must be at least 20 characters' },
            maxLength: { value: 160, message: 'Description cannot exceed 160 characters' }
          })}
          error={errors.shortDescription?.message}
          placeholder="Brief course description"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Price ($)"
            type="number"
            step="0.01"
            min="0"
            {...register('price', {
              required: 'Price is required',
              min: { value: 0, message: 'Price must be positive' }
            })}
            error={errors.price?.message}
            placeholder="0.00"
          />
          
          <Input
            label="Duration (minutes)"
            type="number"
            min="1"
            {...register('duration', {
              required: 'Duration is required',
              min: { value: 1, message: 'Duration must be at least 1 minute' }
            })}
            error={errors.duration?.message}
            placeholder="60"
          />
        </div>

        <Select
          label="Category"
          options={categoryOptions}
          {...register('categoryId', { required: 'Category is required' })}
          error={errors.categoryId?.message}
          placeholder="Select a category"
        />

        <Select
          label="Level"
          options={levelOptions}
          {...register('level', { required: 'Level is required' })}
          error={errors.level?.message}
        />

        <Select
          label="Language"
          options={languageOptions}
          {...register('language', { required: 'Language is required' })}
          error={errors.language?.message}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Course Description
        </label>
        <textarea
          {...register('description', {
            required: 'Description is required',
            minLength: { value: 50, message: 'Description must be at least 50 characters' }
          })}
          rows={6}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Provide a detailed description of your course..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What You'll Learn
          </label>
          <textarea
            {...register('whatYouWillLearn')}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="List the key learning outcomes..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Requirements
          </label>
          <textarea
            {...register('requirements')}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="List any prerequisites..."
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Target Audience
        </label>
        <textarea
          {...register('targetAudience')}
          rows={3}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Who is this course for?"
        />
      </div>

      {/* Course Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Course Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              {...register('isPublished')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">Publish course immediately</span>
          </label>
          
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              {...register('isFeatured')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">Mark as featured</span>
          </label>
          
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              {...register('hasCertificate')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">Provide certificate</span>
          </label>
          
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              {...register('hasLifetimeAccess')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">Lifetime access</span>
          </label>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button variant="outline" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? 'Update Course' : 'Create Course'}
        </Button>
      </div>
    </form>
  );
};

export default CourseForm;