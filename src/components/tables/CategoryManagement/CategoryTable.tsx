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
import { Category, CategoryFormData, CategoryWithUI } from "./types";
import { useCategoryTree, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../../../hooks/useCategories';
import { Category as APICategory } from '../../../services/categoryService';

export default function CategoryTable() {
  // State management
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
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

  // React Query hooks
  const { data: categoryTreeData, isLoading, error, refetch } = useCategoryTree();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  // Convert API data to Category format with UI state
  const categoriesWithUI: CategoryWithUI[] = useMemo(() => {
    if (!categoryTreeData) return [];
    
    const convertCategory = (cat: APICategory, level: number = 0): CategoryWithUI => ({
      categoryId: cat.categoryId,
      name: cat.name,
      description: cat.description,
      parentId: cat.parentId,
      parentName: cat.parentName,
      children: cat.children?.map(child => convertCategory(child, level + 1)),
      level,
      isExpanded: expandedCategories.has(cat.categoryId),
      isSelected: selectedParentId === cat.categoryId
    });

    return categoryTreeData.map(cat => convertCategory(cat));
  }, [categoryTreeData, expandedCategories, selectedParentId]);

  // Flatten categories for display (parent và children)
  const flattenedCategories = useMemo(() => {
    const flatten = (categories: CategoryWithUI[]): CategoryWithUI[] => {
      let result: CategoryWithUI[] = [];
      
      categories.forEach(category => {
        result.push(category);
        if (category.isExpanded && category.children) {
          result = result.concat(flatten(category.children));
        }
      });
      
      return result;
    };

    return flatten(categoriesWithUI);
  }, [categoriesWithUI]);

  // Filtered categories based on search
  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return flattenedCategories;
    
    return flattenedCategories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [flattenedCategories, searchTerm]);


  // Handle expand/collapse category
  const handleToggleExpand = (categoryId: number) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // Handle add root category
  const handleAddRootCategory = () => {
    setFormMode('add');
    setSelectedCategory(null);
    setSelectedParentId(null);
    setIsFormPopupOpen(true);
  };

  // Handle add child category
  const handleAddChildCategory = (parentId: number) => {
    setFormMode('add');
    setSelectedCategory(null);
    setSelectedParentId(parentId);
    setIsFormPopupOpen(true);
  };

  // Handle edit category
  const handleEditCategory = (category: Category) => {
    setFormMode('edit');
    setSelectedCategory(category);
    setIsFormPopupOpen(true);
  };

  // Handle form submit
  const handleFormSubmit = async (categoryData: CategoryFormData) => {
    try {
      if (formMode === 'add') {
        const apiCategoryData: Omit<APICategory, 'categoryId'> = {
          name: categoryData.name,
          description: categoryData.description,
          parentId: selectedParentId || undefined
        };
        await createCategoryMutation.mutateAsync(apiCategoryData);
      } else if (selectedCategory) {
        const apiCategoryData: Partial<APICategory> & { categoryId: number } = {
          categoryId: selectedCategory.categoryId,
          name: categoryData.name,
          description: categoryData.description,
          parentId: categoryData.parentId
        };
        await updateCategoryMutation.mutateAsync(apiCategoryData);
      }
      
      // Refetch category tree data sau khi tạo/cập nhật thành công
      await refetch();
      setIsFormPopupOpen(false);
    } catch (error) {
      console.error('Error saving category:', error);
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
  const handleConfirmDelete = async () => {
    if (confirmAction) {
      try {
        await deleteCategoryMutation.mutateAsync(confirmAction.category.categoryId);
        
        // Refetch category tree data sau khi xóa thành công
        await refetch();
        setIsConfirmPopupOpen(false);
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  // Search handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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
            placeholder="Tìm kiếm danh mục..."
          />
        </div>

        {/* Add Root Category Button */}
        <button
          onClick={handleAddRootCategory}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm danh mục gốc
        </button>
      </div>

      {/* Search Results Info */}
      {searchTerm && (
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Tìm thấy {filteredCategories.length} danh mục cho từ khóa "{searchTerm}"
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
                  Cấp độ
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
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <TableRow key={category.categoryId} className={category.level && category.level > 0 ? 'bg-gray-50 dark:bg-gray-800/30' : ''}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        #{category.categoryId}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        {/* Indentation cho child categories */}
                        {category.level && category.level > 0 && (
                          <div className="flex items-center gap-1" style={{ marginLeft: `${category.level * 20}px` }}>
                            <div className="w-4 h-4 border-l-2 border-b-2 border-gray-300 dark:border-gray-600"></div>
                          </div>
                        )}
                        
                        {/* Expand/Collapse button cho parent categories */}
                        {category.children && category.children.length > 0 && (
                          <button
                            onClick={() => handleToggleExpand(category.categoryId)}
                            className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <svg 
                              className={`w-4 h-4 transition-transform ${category.isExpanded ? 'rotate-90' : ''}`} 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        )}
                        
                        {/* Category icon */}
                        <div className="w-10 h-10 overflow-hidden rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                            {category.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {category.name}
                          </span>
                          {category.parentId && (
                            <span className="block text-xs text-gray-500 dark:text-gray-400">
                              Danh mục con của {category.parentName || 'Unknown'}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <Badge
                        size="sm"
                        color={category.level === 0 ? 'success' : 'info'}
                      >
                        {category.level === 0 ? 'Gốc' : `Cấp ${category.level}`}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="max-w-xs">
                        <p className="truncate" title={category.description}>
                          {category.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        {/* Add child button cho parent categories */}
                        {category.level === 0 && (
                          <button 
                            onClick={() => handleAddChildCategory(category.categoryId)}
                            className="text-green-500 hover:text-green-600 transition-colors"
                            title="Thêm danh mục con"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                        )}
                        
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
                  <TableCell className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                    {searchTerm ? 'Không tìm thấy danh mục nào phù hợp' : 'Chưa có danh mục nào'}
                  </TableCell>
                  <TableCell>{''}</TableCell>
                  <TableCell>{''}</TableCell>
                  <TableCell>{''}</TableCell>
                  <TableCell>{''}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Category Form Popup */}
      <CategoryFormPopup
        isOpen={isFormPopupOpen}
        onClose={() => setIsFormPopupOpen(false)}
        onSubmit={handleFormSubmit}
        category={selectedCategory}
        mode={formMode}
        parentId={selectedParentId}
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
