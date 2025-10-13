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
import { Product, ProductFormData, Category } from "./types";

// Mock data cho danh mục
const mockCategories: Category[] = [
  { category_id: 1, name: "Thực phẩm tươi sống" },
  { category_id: 2, name: "Đồ uống" },
  { category_id: 3, name: "Bánh kẹo" },
  { category_id: 4, name: "Sản phẩm từ sữa" },
  { category_id: 5, name: "Đồ gia dụng" },
  { category_id: 6, name: "Mỹ phẩm" },
  { category_id: 7, name: "Đồ chơi trẻ em" },
  { category_id: 8, name: "Văn phòng phẩm" },
  { category_id: 9, name: "Thực phẩm đóng hộp" },
  { category_id: 10, name: "Đồ điện tử" }
];

// Mock data cho sản phẩm
const initialProductData: Product[] = [
  {
    product_id: 1,
    category_id: 1,
    name: "Cà chua tươi",
    description: "Cà chua tươi ngon, được trồng theo phương pháp hữu cơ, giàu vitamin C và chất chống oxy hóa",
    price: 25000,
    stock: 50,
    image_url: "https://images.unsplash.com/photo-1546470427-227ae4b3b4b4?w=400",
    created_at: "2024-01-15T08:30:00Z",
    category_name: "Thực phẩm tươi sống"
  },
  {
    product_id: 2,
    category_id: 2,
    name: "Nước suối Lavie 500ml",
    description: "Nước suối tinh khiết, đóng chai theo tiêu chuẩn quốc tế, phù hợp cho mọi lứa tuổi",
    price: 8000,
    stock: 200,
    image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    created_at: "2024-01-20T09:15:00Z",
    category_name: "Đồ uống"
  },
  {
    product_id: 3,
    category_id: 3,
    name: "Kẹo dẻo Haribo",
    description: "Kẹo dẻo trái cây thơm ngon, không chứa chất bảo quản, phù hợp cho trẻ em",
    price: 35000,
    stock: 15,
    image_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
    created_at: "2024-02-01T10:00:00Z",
    category_name: "Bánh kẹo"
  },
  {
    product_id: 4,
    category_id: 4,
    name: "Sữa tươi Vinamilk 1L",
    description: "Sữa tươi nguyên chất, giàu canxi và vitamin D, tốt cho sự phát triển của trẻ em",
    price: 28000,
    stock: 0,
    image_url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400",
    created_at: "2024-02-10T11:30:00Z",
    category_name: "Sản phẩm từ sữa"
  },
  {
    product_id: 5,
    category_id: 5,
    name: "Khăn giấy Kleenex",
    description: "Khăn giấy mềm mại, thấm hút tốt, không gây kích ứng da, tiện lợi cho gia đình",
    price: 45000,
    stock: 8,
    image_url: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400",
    created_at: "2024-02-15T14:45:00Z",
    category_name: "Đồ gia dụng"
  },
  {
    product_id: 6,
    category_id: 6,
    name: "Kem dưỡng da Nivea",
    description: "Kem dưỡng da chuyên sâu, cung cấp độ ẩm cho da, phù hợp cho mọi loại da",
    price: 120000,
    stock: 25,
    image_url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
    created_at: "2024-03-01T16:20:00Z",
    category_name: "Mỹ phẩm"
  },
  {
    product_id: 7,
    category_id: 7,
    name: "Xe đồ chơi điều khiển",
    description: "Xe đồ chơi điều khiển từ xa, có đèn và âm thanh, phù hợp cho trẻ từ 3 tuổi trở lên",
    price: 250000,
    stock: 12,
    image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    created_at: "2024-03-10T09:30:00Z",
    category_name: "Đồ chơi trẻ em"
  },
  {
    product_id: 8,
    category_id: 8,
    name: "Bút bi Pilot",
    description: "Bút bi chất lượng cao, mực đen đậm, viết mượt mà, phù hợp cho học sinh và nhân viên văn phòng",
    price: 15000,
    stock: 100,
    image_url: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400",
    created_at: "2024-03-20T11:45:00Z",
    category_name: "Văn phòng phẩm"
  },
  {
    product_id: 9,
    category_id: 9,
    name: "Cá hộp Rio Mare",
    description: "Cá ngừ đóng hộp chất lượng cao, giàu protein và omega-3, tiện lợi cho bữa ăn",
    price: 65000,
    stock: 30,
    image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    created_at: "2024-04-01T14:15:00Z",
    category_name: "Thực phẩm đóng hộp"
  },
  {
    product_id: 10,
    category_id: 10,
    name: "Cáp sạc iPhone",
    description: "Cáp sạc Lightning chính hãng, tương thích với iPhone và iPad, sạc nhanh và an toàn",
    price: 180000,
    stock: 5,
    image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    created_at: "2024-04-10T08:00:00Z",
    category_name: "Đồ điện tử"
  },
  {
    product_id: 11,
    category_id: 1,
    name: "Rau xà lách",
    description: "Rau xà lách tươi ngon, giàu chất xơ và vitamin, phù hợp cho salad và các món ăn healthy",
    price: 18000,
    stock: 40,
    image_url: "https://images.unsplash.com/photo-1546470427-227ae4b3b4b4?w=400",
    created_at: "2024-04-20T10:30:00Z",
    category_name: "Thực phẩm tươi sống"
  },
  {
    product_id: 12,
    category_id: 2,
    name: "Coca Cola 330ml",
    description: "Nước ngọt có ga Coca Cola, hương vị đặc trưng, giải khát hiệu quả",
    price: 12000,
    stock: 150,
    image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    created_at: "2024-05-01T13:20:00Z",
    category_name: "Đồ uống"
  }
];

export default function ProductTable() {
  // State management
  const [products, setProducts] = useState<Product[]>(initialProductData);
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

  // Filtered products based on search
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.product_id.toString().includes(searchTerm)
    );
  }, [products, searchTerm]);

  // Calculate pagination for filtered data
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to first page when search changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
  const handleFormSubmit = (productData: ProductFormData) => {
    if (formMode === 'add') {
      // Generate new ID for new product
      const newId = Math.max(...products.map(p => p.product_id)) + 1;
      const category = mockCategories.find(c => c.category_id === productData.category_id);
      const newProduct: Product = {
        ...productData,
        product_id: newId,
        created_at: new Date().toISOString(),
        category_name: category?.name
      };
      setProducts(prev => [...prev, newProduct]);
    } else {
      // Update existing product
      const category = mockCategories.find(c => c.category_id === productData.category_id);
      setProducts(prev => prev.map(prod => 
        prod.product_id === selectedProduct?.product_id 
          ? { 
              ...prod, 
              ...productData, 
              updated_at: new Date().toISOString(),
              category_name: category?.name
            }
          : prod
      ));
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
  const handleConfirmDelete = () => {
    if (confirmAction) {
      setProducts(prev => prev.filter(prod => prod.product_id !== confirmAction.product.product_id));
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

  // Search handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

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
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
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
                  <TableCell colSpan={6} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                    {searchTerm ? 'Không tìm thấy sản phẩm nào phù hợp' : 'Chưa có sản phẩm nào'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        {totalItems > 0 && (
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
        categories={mockCategories}
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
