import { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { PromotionFormData } from './types';
import PromotionProductSelector from './PromotionProductSelector';

interface PromotionFormPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (promotion: PromotionFormData) => void;
  promotion?: PromotionFormData | null;
  mode: 'add' | 'edit';
}

export default function PromotionFormPopup({ 
  isOpen, 
  onClose, 
  onSubmit, 
  promotion, 
  mode 
}: PromotionFormPopupProps) {
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const startDatePickerRef = useRef<flatpickr.Instance | null>(null);
  const endDatePickerRef = useRef<flatpickr.Instance | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<PromotionFormData>({
    defaultValues: {
      code: '',
      discount_percent: 0,
      start_date: '',
      end_date: '',
      status: 'ACTIVE',
      selected_product_id: null
    },
    mode: 'onChange'
  });

  // Watch start_date để validate end_date
  const startDate = watch('start_date');

  // Initialize flatpickr calendars
  useEffect(() => {
    if (isOpen && startDateRef.current && endDateRef.current) {
      // Initialize start date picker
      if (startDatePickerRef.current) {
        startDatePickerRef.current.destroy();
      }
      startDatePickerRef.current = flatpickr(startDateRef.current, {
        dateFormat: 'Y-m-d',
        onChange: (selectedDates) => {
          if (selectedDates.length > 0) {
            setValue('start_date', selectedDates[0].toISOString().split('T')[0]);
            // Update end date picker min date
            if (endDatePickerRef.current) {
              endDatePickerRef.current.set('minDate', selectedDates[0]);
            }
          }
        }
      });

      // Initialize end date picker
      if (endDatePickerRef.current) {
        endDatePickerRef.current.destroy();
      }
      endDatePickerRef.current = flatpickr(endDateRef.current, {
        dateFormat: 'Y-m-d',
        minDate: startDate || 'today',
        onChange: (selectedDates) => {
          if (selectedDates.length > 0) {
            setValue('end_date', selectedDates[0].toISOString().split('T')[0]);
          }
        }
      });
    }

    // Cleanup on unmount
    return () => {
      if (startDatePickerRef.current) {
        startDatePickerRef.current.destroy();
      }
      if (endDatePickerRef.current) {
        endDatePickerRef.current.destroy();
      }
    };
  }, [isOpen, startDate, setValue]);

  // Reset form when popup opens/closes or promotion changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && promotion) {
        const productId = promotion.selected_product_id || null;
        reset({
          promo_id: promotion.promo_id,
          code: promotion.code,
          discount_percent: promotion.discount_percent,
          start_date: promotion.start_date,
          end_date: promotion.end_date,
          status: promotion.status,
          selected_product_id: productId
        });
        setSelectedProductId(productId);
      } else {
        reset({
          code: '',
          discount_percent: 0,
          start_date: '',
          end_date: '',
          status: 'ACTIVE',
          selected_product_id: null
        });
        setSelectedProductId(null);
      }
    }
  }, [isOpen, promotion, mode, reset]);

  // Validation rules
  const validationRules = {
    code: {
      required: 'Mã giảm giá không được để trống',
      minLength: {
        value: 3,
        message: 'Mã giảm giá phải có ít nhất 3 ký tự'
      },
      maxLength: {
        value: 20,
        message: 'Mã giảm giá không được quá 20 ký tự'
      },
      pattern: {
        value: /^[A-Z0-9]+$/,
        message: 'Mã giảm giá chỉ được chứa chữ hoa và số'
      }
    },
    discount_percent: {
      required: 'Phần trăm giảm giá không được để trống',
      min: {
        value: 1,
        message: 'Phần trăm giảm giá phải lớn hơn 0'
      },
      max: {
        value: 100,
        message: 'Phần trăm giảm giá không được quá 100'
      }
    },
    start_date: {
      required: 'Ngày bắt đầu không được để trống'
    },
    end_date: {
      required: 'Ngày kết thúc không được để trống',
      validate: (value: string) => {
        if (startDate && value && new Date(value) <= new Date(startDate)) {
          return 'Ngày kết thúc phải sau ngày bắt đầu';
        }
        return true;
      }
    }
  };

  // Handler khi selection thay đổi từ component con
  const handleSelectionChange = (productId: number | null) => {
    setSelectedProductId(productId);
    setValue('selected_product_id', productId);
  };

  const onFormSubmit = (data: PromotionFormData) => {
    // Thêm selected_product_id vào data
    const submitData = {
      ...data,
      selected_product_id: selectedProductId
    };
    onSubmit(submitData);
    // Popup sẽ được đóng trong handleFormSubmit sau khi mutation hoàn thành
    // onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-400/50 flex items-center justify-center z-[200]">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {mode === 'add' ? 'Thêm mã giảm giá mới' : 'Chỉnh sửa mã giảm giá'}
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
          {/* Promotion Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mã giảm giá <span className="text-red-500">*</span>
            </label>
            <Controller
              name="code"
              control={control}
              rules={validationRules.code}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.code 
                      ? 'border-red-500 dark:border-red-400' 
                      : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  }`}
                  placeholder="Nhập mã giảm giá (VD: SALE20)"
                  style={{ textTransform: 'uppercase' }}
                />
              )}
            />
            {errors.code && (
              <p className="mt-1 text-sm text-red-500">{errors.code.message}</p>
            )}
          </div>

          {/* Discount Percent */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phần trăm giảm giá (%) <span className="text-red-500">*</span>
            </label>
            <Controller
              name="discount_percent"
              control={control}
              rules={validationRules.discount_percent}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  min="1"
                  max="100"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.discount_percent 
                      ? 'border-red-500 dark:border-red-400' 
                      : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  }`}
                  placeholder="Nhập phần trăm giảm giá"
                />
              )}
            />
            {errors.discount_percent && (
              <p className="mt-1 text-sm text-red-500">{errors.discount_percent.message}</p>
            )}
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ngày bắt đầu <span className="text-red-500">*</span>
            </label>
            <Controller
              name="start_date"
              control={control}
              rules={validationRules.start_date}
              render={({ field }) => (
                <div className="relative">
                  <input
                    {...field}
                    ref={startDateRef}
                    type="text"
                    readOnly
                    className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer ${
                      errors.start_date 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                    }`}
                    placeholder="Chọn ngày bắt đầu"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              )}
            />
            {errors.start_date && (
              <p className="mt-1 text-sm text-red-500">{errors.start_date.message}</p>
            )}
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ngày kết thúc <span className="text-red-500">*</span>
            </label>
            <Controller
              name="end_date"
              control={control}
              rules={validationRules.end_date}
              render={({ field }) => (
                <div className="relative">
                  <input
                    {...field}
                    ref={endDateRef}
                    type="text"
                    readOnly
                    className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer ${
                      errors.end_date 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                    }`}
                    placeholder="Chọn ngày kết thúc"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              )}
            />
            {errors.end_date && (
              <p className="mt-1 text-sm text-red-500">{errors.end_date.message}</p>
            )}
          </div>

          {/* Products Selection */}
          <PromotionProductSelector
            selectedProductId={selectedProductId}
            onSelectionChange={handleSelectionChange}
          />

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Trạng thái <span className="text-red-500">*</span>
            </label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-gray-700 dark:text-white"
                >
                  <option value="ACTIVE">Hoạt động</option>
                  <option value="EXPIRED">Hết hạn</option>
                </select>
              )}
            />
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
                : mode === 'add' ? 'Thêm mã giảm giá' : 'Cập nhật'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
