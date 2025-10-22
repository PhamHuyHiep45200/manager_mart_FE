import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { EmployeeFormData } from './types';

interface EmployeeFormPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (employee: EmployeeFormData) => void;
  employee?: EmployeeFormData | null;
  mode: 'add' | 'edit';
}

export default function EmployeeFormPopup({ 
  isOpen, 
  onClose, 
  onSubmit, 
  employee, 
  mode 
}: EmployeeFormPopupProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<EmployeeFormData>({
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      address: '',
      role: 'EMPLOYEE',
      password: ''
    },
    mode: 'onChange'
  });

  // Reset form when popup opens/closes or employee changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && employee) {
        reset({
          user_id: employee.user_id,
          full_name: employee.full_name,
          email: employee.email,
          phone: employee.phone,
          address: employee.address,
          role: "EMPLOYEE",
          password: ''
        });
      } else {
        reset({
          full_name: '',
          email: '',
          phone: '',
          address: '',
          role: 'EMPLOYEE',
          password: ''
        });
      }
    }
  }, [isOpen, employee, mode, reset]);

  // Validation rules
  const validationRules = {
    full_name: {
      required: 'Họ và tên không được để trống',
      minLength: {
        value: 2,
        message: 'Họ và tên phải có ít nhất 2 ký tự'
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
    },
    password: {
      required: mode === 'add' ? 'Mật khẩu không được để trống' : false,
      minLength: {
        value: 6,
        message: 'Mật khẩu phải có ít nhất 6 ký tự'
      }
    }
  };

  const onFormSubmit = (data: EmployeeFormData) => {
    onSubmit({
      ...data,
      role: 'EMPLOYEE'
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-400/50 flex items-center justify-center z-[99999]">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {mode === 'add' ? 'Thêm nhân viên mới' : 'Chỉnh sửa nhân viên'}
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
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <Controller
              name="full_name"
              control={control}
              rules={validationRules.full_name}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.full_name 
                      ? 'border-red-500 dark:border-red-400' 
                      : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  }`}
                  placeholder="Nhập họ và tên"
                />
              )}
            />
            {errors.full_name && (
              <p className="mt-1 text-sm text-red-500">{errors.full_name.message}</p>
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

          {/* Password - Only show for add mode */}
          {mode === 'add' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <Controller
                name="password"
                control={control}
                rules={validationRules.password}
                render={({ field }) => (
                  <input
                    {...field}
                    type="password"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.password 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                    }`}
                    placeholder="Nhập mật khẩu"
                  />
                )}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
          )}

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
                : mode === 'add' ? 'Thêm nhân viên' : 'Cập nhật'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
