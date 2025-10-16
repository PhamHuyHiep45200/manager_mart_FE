import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { CategoryFormData } from './types';

interface CategoryFormPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (category: CategoryFormData) => void;
  category?: CategoryFormData | null;
  mode: 'add' | 'edit';
  parentId?: number | null; // ID của category cha
}

export default function CategoryFormPopup({ 
  isOpen, 
  onClose, 
  onSubmit, 
  category, 
  mode,
  parentId 
}: CategoryFormPopupProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<CategoryFormData>({
    defaultValues: {
      name: '',
      description: '',
      parent_id: undefined
    },
    mode: 'onChange'
  });

  // Reset form when popup opens/closes or category changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && category) {
        reset({
          category_id: category.category_id,
          name: category.name,
          description: category.description,
          parent_id: category.parent_id
        });
      } else {
        reset({
          name: '',
          description: '',
          parent_id: parentId || undefined
        });
      }
    }
  }, [isOpen, category, mode, reset, parentId]);

  // Validation rules
  const validationRules = {
    name: {
      required: 'Tên danh mục không được để trống',
      minLength: {
        value: 2,
        message: 'Tên danh mục phải có ít nhất 2 ký tự'
      },
      maxLength: {
        value: 100,
        message: 'Tên danh mục không được quá 100 ký tự'
      }
    },
    description: {
      required: 'Mô tả không được để trống',
      minLength: {
        value: 10,
        message: 'Mô tả phải có ít nhất 10 ký tự'
      },
      maxLength: {
        value: 500,
        message: 'Mô tả không được quá 500 ký tự'
      }
    }
  };

  const onFormSubmit = (data: CategoryFormData) => {
    onSubmit(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {mode === 'add' ? 'Thêm danh mục mới' : 'Chỉnh sửa danh mục'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-4">
          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tên danh mục <span className="text-red-500">*</span>
            </label>
            <Controller
              name="name"
              control={control}
              rules={validationRules.name}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.name 
                      ? 'border-red-500 dark:border-red-400' 
                      : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  }`}
                  placeholder="Nhập tên danh mục"
                />
              )}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mô tả <span className="text-red-500">*</span>
            </label>
            <Controller
              name="description"
              control={control}
              rules={validationRules.description}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.description 
                      ? 'border-red-500 dark:border-red-400' 
                      : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  }`}
                  placeholder="Nhập mô tả danh mục"
                />
              )}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting && (
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              {isSubmitting 
                ? 'Đang xử lý...' 
                : mode === 'add' ? 'Thêm danh mục' : 'Cập nhật'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
