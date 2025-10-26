import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import PromotionFormPopup from "./PromotionFormPopup";
import ConfirmPopup from "../UserManagement/ConfirmPopup";
import Pagination from "../../common/Pagination";
import { Promotion, PromotionFormData } from "./types";
import { usePromotions, useCreatePromotion, useUpdatePromotion, useDeletePromotion } from '../../../hooks/usePromotions';
import { Promotion as APIPromotion } from '../../../services/promotionService';
import { showToast } from '../../../utils/toast';
import { useDebounce } from '../../../hooks/useDebounce';

export default function PromotionTable() {
  // State management
  const [isFormPopupOpen, setIsFormPopupOpen] = useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'delete';
    promotion: Promotion;
  } | null>(null);

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // React Query hooks
  const searchRequest = {
    page: currentPage, // API sử dụng 0-based pagination
    size: itemsPerPage,
    sortField: [
      {
        fieldName: 'createdDate',
        sort: 'DESC' as const
      }
    ],
    lsCondition: debouncedSearchTerm ? [
      {
        property: 'code',
        propertyType: 'string' as const,
        operator: 'CONTAINS' as const,
        value: debouncedSearchTerm
      }
    ] : []
  };

  const { data: promotionsData, isLoading, error, refetch } = usePromotions(searchRequest);
  const createPromotionMutation = useCreatePromotion();
  const updatePromotionMutation = useUpdatePromotion();
  const deletePromotionMutation = useDeletePromotion();

  // Convert API data to Promotion format
  const promotions: Promotion[] = useMemo(() => {
    if (!promotionsData?.data?.content) return [];
    
    return promotionsData.data.content.map((promo: APIPromotion) => ({
      promo_id: promo.id || 0,
      code: promo.code,
      discount_percent: promo.discountPercent,
      start_date: promo.startDate,
      end_date: promo.endDate,
      status: promo.status as 'ACTIVE' | 'INACTIVE' | 'EXPIRED',
      selected_product_id: promo.productId || null, // Map selected product ID
      created_at: new Date().toISOString(), // API không trả về created_at
    }));
  }, [promotionsData]);

  // Pagination data
  const totalItems = promotionsData?.data?.totalElements || 0;
  const totalPages = promotionsData?.data?.totalPages || 0;

  // Function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Function to get status badge color
  const getStatusBadgeColor = (status: string) => {
    return status === 'ACTIVE' ? 'success' : 'error';
  };

  // Function to get status display text
  const getStatusDisplayText = (status: string) => {
    return status === 'ACTIVE' ? 'Hoạt động' : 'Hết hạn';
  };

  // Handle add promotion
  const handleAddPromotion = () => {
    setFormMode('add');
    setSelectedPromotion(null);
    setIsFormPopupOpen(true);
  };

  // Handle edit promotion
  const handleEditPromotion = (promotion: Promotion) => {
    setFormMode('edit');
    setSelectedPromotion(promotion);
    setIsFormPopupOpen(true);
  };

  // Handle form submit
  const handleFormSubmit = async (promotionData: PromotionFormData) => {
    try {
      if (formMode === 'add') {
        const apiPromotionData: APIPromotion = {
          code: promotionData.code,
          discountPercent: +promotionData.discount_percent,
          startDate: promotionData.start_date,
          endDate: promotionData.end_date,
          status: promotionData.status,
          productId: promotionData.selected_product_id || undefined
        };
        
        await createPromotionMutation.mutateAsync(apiPromotionData);
        
        // Refetch promotions data sau khi tạo thành công
        await refetch();
        showToast.success('Thêm mã giảm giá thành công!');
      } else if (formMode === 'edit' && selectedPromotion) {
        const apiPromotionData: Partial<APIPromotion> & { id: number } = {
          id: selectedPromotion.promo_id,
          code: promotionData.code,
          discountPercent: +promotionData.discount_percent,
          startDate: promotionData.start_date,
          endDate: promotionData.end_date,
          status: promotionData.status,
          productId: promotionData.selected_product_id || undefined
        };
        
        await updatePromotionMutation.mutateAsync(apiPromotionData);
        
        // Refetch promotions data sau khi cập nhật thành công
        await refetch();
        showToast.success('Cập nhật mã giảm giá thành công!');
      }
      
      // Đóng popup sau khi submit thành công
      setIsFormPopupOpen(false);
    } catch (error) {
      console.error('Error saving promotion:', error);
      showToast.error('Có lỗi xảy ra khi lưu mã giảm giá!');
    }
  };

  // Handle delete promotion
  const handleDeletePromotion = (promotion: Promotion) => {
    setConfirmAction({
      type: 'delete',
      promotion
    });
    setIsConfirmPopupOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (confirmAction?.promotion) {
      try {
        await deletePromotionMutation.mutateAsync(confirmAction.promotion.promo_id);
        showToast.success('Xóa mã giảm giá thành công!');
        setIsConfirmPopupOpen(false);
        // Refetch promotions data sau khi xóa thành công
        await refetch();
      } catch (error) {
        console.error('Error deleting promotion:', error);
        showToast.error('Có lỗi xảy ra khi xóa mã giảm giá!');
        setIsConfirmPopupOpen(false);
      }
    }
  };

  // Search handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset về trang đầu khi search
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
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
            placeholder="Tìm kiếm mã giảm giá..."
          />
        </div>

        {/* Add Promotion Button */}
        <button
          onClick={handleAddPromotion}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm mã giảm giá
        </button>
      </div>

      {/* Search Results Info */}
      {debouncedSearchTerm && (
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Tìm thấy {totalItems} mã giảm giá cho từ khóa "{debouncedSearchTerm}"
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
                  Mã giảm giá
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Phần trăm giảm
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Thời gian áp dụng
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Trạng thái
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
              {promotions.length > 0 ? (
                promotions.map((promotion) => (
                  <TableRow key={promotion.promo_id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        #{promotion.promo_id}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          <span className="text-purple-600 dark:text-purple-400 font-semibold text-sm">
                            {promotion.code.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {promotion.code}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <span className="font-medium text-gray-800 dark:text-white/90">
                        {promotion.discount_percent}%
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="space-y-1">
                        <div className="text-xs">
                          <span className="font-medium">Từ:</span> {formatDate(promotion.start_date)}
                        </div>
                        <div className="text-xs">
                          <span className="font-medium">Đến:</span> {formatDate(promotion.end_date)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <Badge
                        size="sm"
                        color={getStatusBadgeColor(promotion.status)}
                      >
                        {getStatusDisplayText(promotion.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEditPromotion(promotion)}
                          className="text-primary hover:text-primary/80 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDeletePromotion(promotion)}
                          className="text-red-500 hover:text-red-600 transition-colors"
                          title="Xóa mã giảm giá"
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
                    {debouncedSearchTerm ? 'Không tìm thấy mã giảm giá nào phù hợp' : 'Chưa có mã giảm giá nào'}
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
        {promotions.length > 0 && (
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

      {/* Promotion Form Popup */}
      <PromotionFormPopup
        isOpen={isFormPopupOpen}
        onClose={() => setIsFormPopupOpen(false)}
        onSubmit={handleFormSubmit}
        promotion={selectedPromotion}
        mode={formMode}
      />

      {/* Confirm Delete Popup */}
      <ConfirmPopup
        isOpen={isConfirmPopupOpen}
        onClose={() => setIsConfirmPopupOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xóa mã giảm giá"
        message={`Bạn có chắc chắn muốn xóa mã giảm giá "${confirmAction?.promotion.code}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa mã giảm giá"
        type="danger"
      />
    </>
  );
}
