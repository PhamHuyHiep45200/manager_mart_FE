import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { SupplierFormData } from './types';

interface SupplierFormPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (supplier: SupplierFormData) => void;
  supplier?: SupplierFormData | null;
  mode: 'add' | 'edit';
}

export default function SupplierFormPopup({ 
  isOpen, 
  onClose, 
  onSubmit, 
  supplier, 
  mode 
}: SupplierFormPopupProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<SupplierFormData>({
    defaultValues: {
      name: '',
      contact_person: '',
      email: '',
      phone: '',
      address: ''
    },
    mode: 'onChange'
  });

  // Reset form when popup opens/closes or supplier changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && supplier) {
        reset({
          supplier_id: supplier.supplier_id,
          name: supplier.name,
          contact_person: supplier.contact_person,
          email: supplier.email,
          phone: supplier.phone,
          address: supplier.address
        });
      } else {
        reset({
          name: '',
          contact_person: '',
          email: '',
          phone: '',
          address: ''
        });
      }
    }
  }, [isOpen, supplier, mode, reset]);

  // Validation rules
  const validationRules = {
    name: {
      required: 'Tên nhà cung cấp không được để trống',
      minLength: {
        value: 2,
        message: 'Tên nhà cung cấp phải có ít nhất 2 ký tự'
      },
      maxLength: {
        value: 100,
        message: 'Tên nhà cung cấp không được quá 100 ký tự'
      }
    },
    contact_person: {
      required: 'Tên người liên hệ không được để trống',
      minLength: {
        value: 2,
        message: 'Tên người liên hệ phải có ít nhất 2 ký tự'
      }
    },
    email: {
      required: 'Email không được để trống',
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Email không hợp lệ'
      }
    },
    phone: {
      required: 'Số điện thoại không được để trống',
      pattern: {
        value: /^[0-9]{10,11}$/,
        message: 'Số điện thoại phải có 10-11 chữ số'
      }
    },
    address: {
      required: 'Địa chỉ không được để trống',
      minLength: {
        value: 10,
        message: 'Địa chỉ phải có ít nhất 10 ký tự'
      }
    }
  };

  const onFormSubmit = (data: SupplierFormData) => {
    onSubmit(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-400/50 flex items-center justify-center z-[200]">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {mode === 'add' ? 'Thêm nhà cung cấp mới' : 'Chỉnh sửa nhà cung cấp'}
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
          {/* Supplier Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tên nhà cung cấp <span className="text-red-500">*</span>
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
                  placeholder="Nhập tên nhà cung cấp"
                />
              )}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Contact Person */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Người liên hệ <span className="text-red-500">*</span>
            </label>
            <Controller
              name="contact_person"
              control={control}
              rules={validationRules.contact_person}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.contact_person 
                      ? 'border-red-500 dark:border-red-400' 
                      : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  }`}
                  placeholder="Nhập tên người liên hệ"
                />
              )}
            />
            {errors.contact_person && (
              <p className="mt-1 text-sm text-red-500">{errors.contact_person.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <Controller
              name="email"
              control={control}
              rules={validationRules.email}
              render={({ field }) => (
                <input
                  {...field}
                  type="email"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.email 
                      ? 'border-red-500 dark:border-red-400' 
                      : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  }`}
                  placeholder="Nhập email"
                />
              )}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <Controller
              name="phone"
              control={control}
              rules={validationRules.phone}
              render={({ field }) => (
                <input
                  {...field}
                  type="tel"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.phone 
                      ? 'border-red-500 dark:border-red-400' 
                      : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  }`}
                  placeholder="Nhập số điện thoại"
                />
              )}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Địa chỉ <span className="text-red-500">*</span>
            </label>
            <Controller
              name="address"
              control={control}
              rules={validationRules.address}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.address 
                      ? 'border-red-500 dark:border-red-400' 
                      : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  }`}
                  placeholder="Nhập địa chỉ"
                />
              )}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>
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
                : mode === 'add' ? 'Thêm nhà cung cấp' : 'Cập nhật'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
