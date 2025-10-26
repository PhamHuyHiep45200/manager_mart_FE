import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import ProductFormPopup from "./ProductFormPopup";
import ProductDetailPopup from "./ProductDetailPopup";
import ConfirmPopup from "../UserManagement/ConfirmPopup";
import Pagination from "../../common/Pagination";
import { Product, ProductFormData } from "./types";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../../../hooks/useProducts';
import { Product as APIProduct } from '../../../services/productService';
import { useDebounce } from '../../../hooks/useDebounce';

export default function ProductTable() {
  // State management
  const [isFormPopupOpen, setIsFormPopupOpen] = useState(false);
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'delete';
    product: Product;
  } | null>(null);

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Debounce search term để tối ưu hiệu suất
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // React Query hooks
  const searchRequest = {
    page: currentPage - 1, // API sử dụng 0-based pagination
    size: itemsPerPage,
    sortField: [
      {
        fieldName: 'name',
        sort: 'ASC' as const
      }
    ],
    lsCondition: debouncedSearchTerm ? [
      {
        property: 'name',
        propertyType: 'string' as const,
        operator: 'LIKE' as const,
        value: debouncedSearchTerm
      }
    ] : []
  };

  const { data: productsData, isLoading, error, refetch } = useProducts(searchRequest);
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  // Convert API data to Product format
  const products: Product[] = useMemo(() => {
    if (!productsData?.data?.content) return [];
    
    return productsData.data.content.map((product: APIProduct) => ({
      product_id: product.id || 0,
      parent_category_id: product.categoryParentId || null,
      category_id: product.categoryId ? Number(product.categoryId) : 0,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      image_url: product.imageUrl || null,
      created_at: product.createdAt || new Date().toISOString(),
      category_name: product.categoryName || 'Unknown'
    }));
  }, [productsData]);

  // Pagination data
  const totalItems = productsData?.data?.totalElements || 0;
  const totalPages = productsData?.data?.totalPages || 0;

  // Function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Function to get stock badge color
  const getStockBadgeColor = (stock: number) => {
    if (stock === 0) return 'error';
    if (stock < 10) return 'warning';
    return 'success';
  };

  // Function to get stock display text
  const getStockDisplayText = (stock: number) => {
    if (stock === 0) return 'Hết hàng';
    if (stock < 10) return 'Sắp hết';
    return 'Còn hàng';
  };

  // Handle add product
  const handleAddProduct = () => {
    setFormMode('add');
    setSelectedProduct(null);
    setIsFormPopupOpen(true);
  };

  // Handle edit product
  const handleEditProduct = (product: Product) => {
    setFormMode('edit');
    setSelectedProduct(product);
    setIsFormPopupOpen(true);
  };

  // Handle view product detail
  const handleViewDetail = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailPopupOpen(true);
  };

  // Handle form submit
  const handleFormSubmit = async (productData: ProductFormData) => {
    try {
      if (formMode === 'add') {
        const apiProductData: APIProduct = {
          categoryId: +productData.category_id,
          name: productData.name,
          description: productData.description,
          price: +productData.price,
          stock: productData.stock,
          imageUrl: productData.image_url
        };
        await createProductMutation.mutateAsync(apiProductData);
      } else if (selectedProduct) {
        const apiProductData: Partial<APIProduct> & { id: number } = {
          id: selectedProduct.product_id,
          categoryId: +productData.category_id,
          name: productData.name,
          description: productData.description,
          price: +productData.price,
          stock: productData.stock,
          imageUrl: productData.image_url
        };
        await updateProductMutation.mutateAsync(apiProductData);
      }
      
      // Refetch products data sau khi tạo/cập nhật thành công
      await refetch();
      setIsFormPopupOpen(false);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  // Handle delete product
  const handleDeleteProduct = (product: Product) => {
    setConfirmAction({
      type: 'delete',
      product
    });
    setIsConfirmPopupOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (confirmAction) {
      try {
        await deleteProductMutation.mutateAsync(confirmAction.product.product_id);
        
        // Refetch products data sau khi xóa thành công
        await refetch();
        setIsConfirmPopupOpen(false);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Search handler - chỉ cập nhật state local, debounce sẽ xử lý API call
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-gray-600">Đang tải...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-2">Có lỗi xảy ra khi tải dữ liệu</div>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Header with Add Button and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary text-sm"
            placeholder="Tìm kiếm sản phẩm..."
          />
        </div>

        {/* Add Product Button */}
        <button
          onClick={handleAddProduct}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm sản phẩm
        </button>
      </div>

      {/* Search Results Info */}
      {searchTerm && (
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Tìm thấy {totalItems} sản phẩm cho từ khóa "{searchTerm}"
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  ID
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Sản phẩm
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Danh mục
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Giá bán
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Tồn kho
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {products.length > 0 ? (
                products.map((product) => (
                  <TableRow key={product.product_id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        #{product.product_id}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {product.name}
                          </span>
                          <span className="block text-gray-500 text-theme-xs dark:text-gray-400 truncate max-w-xs">
                            {product.description}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium">
                        {product.category_name}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <span className="font-medium text-gray-800 dark:text-white/90">
                        {formatCurrency(product.price)}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Badge
                          size="sm"
                          color={getStockBadgeColor(product.stock)}
                        >
                          {getStockDisplayText(product.stock)}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ({product.stock})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleViewDetail(product)}
                          className="text-blue-500 hover:text-blue-600 transition-colors"
                          title="Xem chi tiết"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleEditProduct(product)}
                          className="text-primary hover:text-primary/80 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product)}
                          className="text-red-500 hover:text-red-600 transition-colors"
                          title="Xóa sản phẩm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                    {searchTerm ? 'Không tìm thấy sản phẩm nào phù hợp' : 'Chưa có sản phẩm nào'}
                  </TableCell>
                  <TableCell>{''}</TableCell>
                  <TableCell>{''}</TableCell>
                  <TableCell>{''}</TableCell>
                  <TableCell>{''}</TableCell>
                  <TableCell>{''}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        {products.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            onItemsPerPageChange={handleItemsPerPageChange}
            showItemsPerPage={true}
          />
        )}
      </div>

      {/* Product Form Popup */}
      <ProductFormPopup
        isOpen={isFormPopupOpen}
        onClose={() => setIsFormPopupOpen(false)}
        onSubmit={handleFormSubmit}
        product={selectedProduct}
        mode={formMode}
      />

      {/* Product Detail Popup */}
      <ProductDetailPopup
        isOpen={isDetailPopupOpen}
        onClose={() => setIsDetailPopupOpen(false)}
        product={selectedProduct}
      />

      {/* Confirm Delete Popup */}
      <ConfirmPopup
        isOpen={isConfirmPopupOpen}
        onClose={() => setIsConfirmPopupOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xóa sản phẩm"
        message={`Bạn có chắc chắn muốn xóa sản phẩm "${confirmAction?.product.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa sản phẩm"
        type="danger"
      />
    </>
  );
}
