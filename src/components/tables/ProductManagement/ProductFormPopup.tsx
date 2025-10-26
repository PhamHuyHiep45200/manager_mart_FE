import { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { ProductFormData, Product } from "./types";
import { Category } from "../../../services/categoryService";
import {
  useRootCategories,
  useCategoryChildren,
} from "../../../hooks/useCategories";
import UploadComponent from "../../common/UploadComponent";
import { FileInfo } from "../../../services/uploadService";

interface ProductFormPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: ProductFormData) => void;
  product?: Product | null;
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
  
  // State để quản lý uploaded image
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");

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

  // Track previous parent ID để phát hiện khi user thay đổi
  const prevParentIdRef = useRef<number | null>(null);
  
  // Effect để cập nhật child categories khi parent category thay đổi
  useEffect(() => {
    const isParentChanged = prevParentIdRef.current !== watchedParentId && prevParentIdRef.current !== null;
    
    if (watchedParentId) {
      setSelectedParentId(watchedParentId);
      // Chỉ reset child category khi user thay đổi parent (không phải lần đầu load)
      if (isParentChanged) {
        setValue("category_id", 0);
      }
    } else {
      setSelectedParentId(null);
      setChildCategories([]);
      // Chỉ reset category_id khi user thay đổi parent
      if (isParentChanged) {
        setValue("category_id", 0);
      }
    }
    
    // Update prev parent ID
    prevParentIdRef.current = watchedParentId || null;
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
  }, [fetchedChildCategories, childCategories]);

  // Reset form when popup opens/closes or product changes
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && product) {
        const parentId = product.parent_category_id || 0;
        reset({
          product_id: product.product_id,
          parent_category_id: parentId,
          category_id: product.category_id,
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          image_url: product.image_url || "",
        });
        // Set parent ID để trigger fetch children
        setSelectedParentId(parentId > 0 ? parentId : null);
        // Set prev parent ID để tránh reset category_id khi load form
        prevParentIdRef.current = parentId > 0 ? parentId : null;
        // Set uploaded image state nếu có image_url
        if (product.image_url) {
          setUploadedImageUrl(product.image_url);
        } else {
          setUploadedImageUrl("");
        }
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
        // Reset parent ID
        setSelectedParentId(null);
        // Reset prev parent ID
        prevParentIdRef.current = null;
        // Reset uploaded image state
        setUploadedImageUrl("");
      }
    }
  }, [isOpen, product, mode, reset]);

  // Validation rules
  const validationRules = {
    category_id: {
      required: "Danh mục sản phẩm không được để trống",
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
      validate: (value: string | undefined | null) => {
        // Cho phép empty string hoặc URL hợp lệ
        if (!value || value === "") return true;
        const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i;
        return urlPattern.test(value) || "URL hình ảnh không hợp lệ";
      },
    },
  };

  const onFormSubmit = (data: ProductFormData) => {
    onSubmit(data);
    onClose();
  };

  // Handler cho upload image success
  const handleImageUploadSuccess = (fileInfo: FileInfo) => {
    setUploadedImageUrl(fileInfo.url);
    setValue("image_url", fileInfo.url);
  };

  // Handler cho upload image error
  const handleImageUploadError = (error: string) => {
    console.error("Upload image error:", error);
    setUploadedImageUrl("");
    setValue("image_url", "");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-400/50 flex items-center justify-center z-[200]">
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

            {/* Parent Category - Optional */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Danh mục cha (nếu có)
              </label>
              <Controller
                name="parent_category_id"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    value={field.value || 0}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-gray-700 dark:text-white"
                    disabled={isLoadingRoots}
                  >
                    <option value={0}>Không có danh mục cha</option>
                    {rootCategories.map((category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                )}
              />
              {isLoadingRoots && (
                <p className="mt-1 text-sm text-gray-500">
                  Đang tải danh mục...
                </p>
              )}
            </div>

            {/* Category - Shows as child or root based on parent selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {selectedParentId ? 'Danh mục con' : 'Danh mục gốc'} <span className="text-red-500">*</span>
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
                    disabled={!!selectedParentId && (isLoadingChildren || childCategories.length === 0)}
                  >
                    <option value={0}>Chọn danh mục</option>
                    {selectedParentId ? (
                      childCategories.map((category) => (
                        <option
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </option>
                      ))
                    ) : (
                      rootCategories.map((category) => (
                        <option
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </option>
                      ))
                    )}
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
              {selectedParentId && childCategories.length === 0 && !isLoadingChildren && (
                <p className="mt-1 text-sm text-gray-500">
                  Không có danh mục con
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

            {/* Image Upload */}
            <div className="md:col-span-2">

              {/* Upload Component */}
              <UploadComponent
                category="images"
                onUploadSuccess={handleImageUploadSuccess}
                onUploadError={handleImageUploadError}
                maxFileSize={5} // 5MB cho hình ảnh sản phẩm
                acceptedTypes="image/*"
                existingImageUrl={mode === 'edit' && uploadedImageUrl ? uploadedImageUrl : undefined}
              />
              
              {/* Hidden input để lưu URL vào form */}
              <Controller
                name="image_url"
                control={control}
                rules={validationRules.image_url}
                render={({ field }) => (
                  <input
                    {...field}
                    type="hidden"
                    value={uploadedImageUrl}
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
