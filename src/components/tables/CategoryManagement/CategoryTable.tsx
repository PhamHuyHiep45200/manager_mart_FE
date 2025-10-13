import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import CategoryFormPopup from "./CategoryFormPopup";
import ConfirmPopup from "../UserManagement/ConfirmPopup";
import Pagination from "../../common/Pagination";
import { Category, CategoryFormData } from "./types";

// Mock data cho danh mục
const initialCategoryData: Category[] = [
  {
    category_id: 1,
    name: "Thực phẩm tươi sống",
    description: "Các loại thực phẩm tươi sống như rau củ, thịt cá, trái cây",
    created_at: "2024-01-15T08:30:00Z"
  },
  {
    category_id: 2,
    name: "Đồ uống",
    description: "Các loại đồ uống bao gồm nước ngọt, nước suối, trà, cà phê",
    created_at: "2024-01-20T09:15:00Z"
  },
  {
    category_id: 3,
    name: "Bánh kẹo",
    description: "Các loại bánh kẹo, snack, đồ ngọt và món tráng miệng",
    created_at: "2024-02-01T10:00:00Z"
  },
  {
    category_id: 4,
    name: "Sản phẩm từ sữa",
    description: "Sữa tươi, sữa chua, phô mai và các sản phẩm từ sữa khác",
    created_at: "2024-02-10T11:30:00Z"
  },
  {
    category_id: 5,
    name: "Đồ gia dụng",
    description: "Các sản phẩm gia dụng như dụng cụ nhà bếp, đồ dùng cá nhân",
    created_at: "2024-02-15T14:45:00Z"
  },
  {
    category_id: 6,
    name: "Mỹ phẩm",
    description: "Các sản phẩm chăm sóc da, tóc và mỹ phẩm trang điểm",
    created_at: "2024-03-01T16:20:00Z"
  },
  {
    category_id: 7,
    name: "Đồ chơi trẻ em",
    description: "Các loại đồ chơi an toàn và phù hợp cho trẻ em",
    created_at: "2024-03-10T09:30:00Z"
  },
  {
    category_id: 8,
    name: "Văn phòng phẩm",
    description: "Bút, giấy, sổ tay và các dụng cụ văn phòng khác",
    created_at: "2024-03-20T11:45:00Z"
  },
  {
    category_id: 9,
    name: "Thực phẩm đóng hộp",
    description: "Các loại thực phẩm đã được đóng hộp và bảo quản",
    created_at: "2024-04-01T14:15:00Z"
  },
  {
    category_id: 10,
    name: "Đồ điện tử",
    description: "Các thiết bị điện tử nhỏ như sạc pin, tai nghe, cáp",
    created_at: "2024-04-10T08:00:00Z"
  },
  {
    category_id: 11,
    name: "Thể thao",
    description: "Dụng cụ thể thao, quần áo thể thao và phụ kiện",
    created_at: "2024-04-20T10:30:00Z"
  },
  {
    category_id: 12,
    name: "Sách báo",
    description: "Sách, tạp chí, báo và các ấn phẩm in khác",
    created_at: "2024-05-01T13:20:00Z"
  }
];

export default function CategoryTable() {
  // State management
  const [categories, setCategories] = useState<Category[]>(initialCategoryData);
  const [isFormPopupOpen, setIsFormPopupOpen] = useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'delete';
    category: Category;
  } | null>(null);

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Filtered categories based on search
  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return categories;
    
    return categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  // Calculate pagination for filtered data
  const totalItems = filteredCategories.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = filteredCategories.slice(startIndex, endIndex);

  // Reset to first page when search changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Handle add category
  const handleAddCategory = () => {
    setFormMode('add');
    setSelectedCategory(null);
    setIsFormPopupOpen(true);
  };

  // Handle edit category
  const handleEditCategory = (category: Category) => {
    setFormMode('edit');
    setSelectedCategory(category);
    setIsFormPopupOpen(true);
  };

  // Handle form submit
  const handleFormSubmit = (categoryData: CategoryFormData) => {
    if (formMode === 'add') {
      // Generate new ID for new category
      const newId = Math.max(...categories.map(c => c.category_id)) + 1;
      const newCategory: Category = {
        ...categoryData,
        category_id: newId,
        created_at: new Date().toISOString()
      };
      setCategories(prev => [...prev, newCategory]);
    } else {
      // Update existing category
      setCategories(prev => prev.map(cat => 
        cat.category_id === selectedCategory?.category_id 
          ? { ...cat, ...categoryData, updated_at: new Date().toISOString() }
          : cat
      ));
    }
  };

  // Handle delete category
  const handleDeleteCategory = (category: Category) => {
    setConfirmAction({
      type: 'delete',
      category
    });
    setIsConfirmPopupOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = () => {
    if (confirmAction) {
      setCategories(prev => prev.filter(cat => cat.category_id !== confirmAction.category.category_id));
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
            placeholder="Tìm kiếm danh mục..."
          />
        </div>

        {/* Add Category Button */}
        <button
          onClick={handleAddCategory}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm danh mục
        </button>
      </div>

      {/* Search Results Info */}
      {searchTerm && (
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Tìm thấy {totalItems} danh mục cho từ khóa "{searchTerm}"
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
                  Tên danh mục
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Mô tả
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Ngày tạo
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
              {currentCategories.length > 0 ? (
                currentCategories.map((category) => (
                  <TableRow key={category.category_id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        #{category.category_id}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                            {category.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {category.name}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="max-w-xs">
                        <p className="truncate" title={category.description}>
                          {category.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {formatDate(category.created_at || '')}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEditCategory(category)}
                          className="text-primary hover:text-primary/80 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteCategory(category)}
                          className="text-red-500 hover:text-red-600 transition-colors"
                          title="Xóa danh mục"
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
                  <TableCell colSpan={5} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                    {searchTerm ? 'Không tìm thấy danh mục nào phù hợp' : 'Chưa có danh mục nào'}
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

      {/* Category Form Popup */}
      <CategoryFormPopup
        isOpen={isFormPopupOpen}
        onClose={() => setIsFormPopupOpen(false)}
        onSubmit={handleFormSubmit}
        category={selectedCategory}
        mode={formMode}
      />

      {/* Confirm Delete Popup */}
      <ConfirmPopup
        isOpen={isConfirmPopupOpen}
        onClose={() => setIsConfirmPopupOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xóa danh mục"
        message={`Bạn có chắc chắn muốn xóa danh mục "${confirmAction?.category.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa danh mục"
        type="danger"
      />
    </>
  );
}
