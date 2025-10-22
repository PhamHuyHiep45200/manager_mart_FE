import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { ProductFormData, Category } from "./types";
import {
  useRootCategories,
  useCategoryChildren,
} from "../../../hooks/useCategories";

interface ProductFormPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: ProductFormData) => void;
  product?: ProductFormData | null;
  mode: "add" | "edit";
}

export default function ProductFormPopup({
  isOpen,
  onClose,
  onSubmit,
  product,
  mode,
}: ProductFormPopupProps) {
  // State để quản lý category parent và child
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
  const [childCategories, setChildCategories] = useState<Category[]>([]);

  // Hooks để lấy dữ liệu categories
  const { data: rootCategories = [], isLoading: isLoadingRoots } =
    useRootCategories();
  const { data: fetchedChildCategories = [], isLoading: isLoadingChildren } =
    useCategoryChildren(selectedParentId || 0);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    defaultValues: {
      category_id: 0,
      name: "",
      description: "",
      price: 0,
      stock: 0,
      image_url: "",
    },
    mode: "onChange",
  });

  // Watch parent category để trigger fetch children
  const watchedParentId = watch("parent_category_id");

  // Effect để cập nhật child categories khi parent category thay đổi
  useEffect(() => {
    if (watchedParentId) {
      setSelectedParentId(watchedParentId);
      // Reset child category khi parent thay đổi
      setValue("category_id", 0);
    } else {
      setSelectedParentId(null);
      setChildCategories([]);
      setValue("category_id", 0);
    }
  }, [watchedParentId, setValue]);

  // Effect để cập nhật child categories từ API
  useEffect(() => {
    if (
      JSON.stringify(fetchedChildCategories) === JSON.stringify(childCategories)
    )
      return;
    if (fetchedChildCategories.length > 0) {
      setChildCategories(fetchedChildCategories);
    } else {
      setChildCategories([]);
    }
  }, [fetchedChildCategories]);

  // Reset form when popup opens/closes or product changes
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && product) {
        reset({
          product_id: product.product_id,
          parent_category_id: product.parent_category_id || 0,
          category_id: product.category_id,
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          image_url: product.image_url || "",
        });
      } else {
        reset({
          parent_category_id: 0,
          category_id: 0,
          name: "",
          description: "",
          price: 0,
          stock: 0,
          image_url: "",
        });
      }
    }
  }, [isOpen, product, mode, reset]);

  // Validation rules
  const validationRules = {
    parent_category_id: {
      required: "Danh mục cha không được để trống",
    },
    category_id: {
      required: "Danh mục con không được để trống",
    },
    name: {
      required: "Tên sản phẩm không được để trống",
      minLength: {
        value: 2,
        message: "Tên sản phẩm phải có ít nhất 2 ký tự",
      },
      maxLength: {
        value: 150,
        message: "Tên sản phẩm không được quá 150 ký tự",
      },
    },
    description: {
      required: "Mô tả không được để trống",
      minLength: {
        value: 10,
        message: "Mô tả phải có ít nhất 10 ký tự",
      },
    },
    price: {
      required: "Giá sản phẩm không được để trống",
      min: {
        value: 1,
        message: "Giá sản phẩm phải lớn hơn 0",
      },
    },
    stock: {
      required: "Số lượng tồn kho không được để trống",
      min: {
        value: 0,
        message: "Số lượng tồn kho không được âm",
      },
    },
    image_url: {
      pattern: {
        value: /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i,
        message: "URL hình ảnh không hợp lệ",
      },
    },
  };

  const onFormSubmit = (data: ProductFormData) => {
    onSubmit(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-400/50 flex items-center justify-center z-[99999]">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {mode === "add" ? "Thêm sản phẩm mới" : "Chỉnh sửa sản phẩm"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tên sản phẩm <span className="text-red-500">*</span>
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
                        ? "border-red-500 dark:border-red-400"
                        : "border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    }`}
                    placeholder="Nhập tên sản phẩm"
                  />
                )}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Parent Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Danh mục cha <span className="text-red-500">*</span>
              </label>
              <Controller
                name="parent_category_id"
                control={control}
                rules={validationRules.parent_category_id}
                render={({ field }) => (
                  <select
                    {...field}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.parent_category_id
                        ? "border-red-500 dark:border-red-400"
                        : "border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    }`}
                    disabled={isLoadingRoots}
                  >
                    <option value={0}>Chọn danh mục cha</option>
                    {rootCategories.map((category) => (
                      <option
                        key={category.categoryId}
                        value={category.categoryId}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.parent_category_id && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.parent_category_id.message}
                </p>
              )}
              {isLoadingRoots && (
                <p className="mt-1 text-sm text-gray-500">
                  Đang tải danh mục...
                </p>
              )}
            </div>

            {/* Child Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Danh mục con <span className="text-red-500">*</span>
              </label>
              <Controller
                name="category_id"
                control={control}
                rules={validationRules.category_id}
                render={({ field }) => (
                  <select
                    {...field}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.category_id
                        ? "border-red-500 dark:border-red-400"
                        : "border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    }`}
                    disabled={!selectedParentId || isLoadingChildren}
                  >
                    <option value={0}>Chọn danh mục con</option>
                    {childCategories.map((category) => (
                      <option
                        key={category.categoryId}
                        value={category.categoryId}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.category_id && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.category_id.message}
                </p>
              )}
              {isLoadingChildren && selectedParentId && (
                <p className="mt-1 text-sm text-gray-500">
                  Đang tải danh mục con...
                </p>
              )}
              {!selectedParentId && (
                <p className="mt-1 text-sm text-gray-500">
                  Vui lòng chọn danh mục cha trước
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Giá bán (VNĐ) <span className="text-red-500">*</span>
              </label>
              <Controller
                name="price"
                control={control}
                rules={validationRules.price}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    min="1"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.price
                        ? "border-red-500 dark:border-red-400"
                        : "border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    }`}
                    placeholder="Nhập giá sản phẩm"
                  />
                )}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Số lượng tồn kho <span className="text-red-500">*</span>
              </label>
              <Controller
                name="stock"
                control={control}
                rules={validationRules.stock}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    min="0"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.stock
                        ? "border-red-500 dark:border-red-400"
                        : "border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    }`}
                    placeholder="Nhập số lượng"
                  />
                )}
              />
              {errors.stock && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.stock.message}
                </p>
              )}
            </div>

            {/* Image URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                URL hình ảnh
              </label>
              <Controller
                name="image_url"
                control={control}
                rules={validationRules.image_url}
                render={({ field }) => (
                  <input
                    {...field}
                    type="url"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.image_url
                        ? "border-red-500 dark:border-red-400"
                        : "border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    }`}
                    placeholder="https://example.com/image.jpg"
                  />
                )}
              />
              {errors.image_url && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.image_url.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mô tả sản phẩm <span className="text-red-500">*</span>
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
                        ? "border-red-500 dark:border-red-400"
                        : "border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    }`}
                    placeholder="Nhập mô tả chi tiết về sản phẩm"
                  />
                )}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
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
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              )}
              {isSubmitting
                ? "Đang xử lý..."
                : mode === "add"
                ? "Thêm sản phẩm"
                : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
