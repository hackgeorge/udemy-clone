import React from 'react';
import { useForm } from 'react-hook-form';
import { useCategories } from '../../contexts/CategoryContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import type { CreateCategoryRequest } from '../../types';

interface CategoryFormProps {
  initialData?: Partial<CreateCategoryRequest>;
  onSubmit: (data: CreateCategoryRequest) => Promise<void>;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const { parentCategories } = useCategories();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategoryRequest>({
    defaultValues: initialData,
  });

  const parentCategoryOptions = [
    { value: '', label: 'None (Main Category)' },
    ...parentCategories.map(cat => ({
      value: cat.id,
      label: cat.name,
    })),
  ];

  const handleFormSubmit = async (data: CreateCategoryRequest) => {
    try {
      // Clean up empty values
      const cleanData = {
        ...data,
        parentCategoryId: data.parentCategoryId || undefined,
        description: data.description?.trim() || undefined,
      };
      await onSubmit(cleanData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Input
        label="Category Name"
        {...register('name', {
          required: 'Category name is required',
          minLength: { value: 2, message: 'Name must be at least 2 characters' },
          maxLength: { value: 100, message: 'Name cannot exceed 100 characters' }
        })}
        error={errors.name?.message}
        placeholder="Enter category name"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          {...register('description', {
            maxLength: { value: 500, message: 'Description cannot exceed 500 characters' }
          })}
          rows={4}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Optional description for the category"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <Select
        label="Parent Category"
        options={parentCategoryOptions}
        {...register('parentCategoryId')}
        error={errors.parentCategoryId?.message}
      />

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button variant="outline" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? 'Update Category' : 'Create Category'}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;