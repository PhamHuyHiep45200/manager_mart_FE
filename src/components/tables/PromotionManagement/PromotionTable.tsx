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

// Mock data cho mã giảm giá
const initialPromotionData: Promotion[] = [
  {
    promo_id: 1,
    code: "SALE20",
    discount_percent: 20,
    start_date: "2024-01-01",
    end_date: "2024-12-31",
    status: "ACTIVE",
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    promo_id: 2,
    code: "WELCOME10",
    discount_percent: 10,
    start_date: "2024-01-15",
    end_date: "2024-06-15",
    status: "ACTIVE",
    created_at: "2024-01-15T08:30:00Z"
  },
  {
    promo_id: 3,
    code: "SUMMER30",
    discount_percent: 30,
    start_date: "2024-06-01",
    end_date: "2024-08-31",
    status: "EXPIRED",
    created_at: "2024-06-01T09:15:00Z"
  },
  {
    promo_id: 4,
    code: "NEWYEAR50",
    discount_percent: 50,
    start_date: "2024-01-01",
    end_date: "2024-01-07",
    status: "EXPIRED",
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    promo_id: 5,
    code: "VIP15",
    discount_percent: 15,
    start_date: "2024-03-01",
    end_date: "2024-12-31",
    status: "ACTIVE",
    created_at: "2024-03-01T10:00:00Z"
  },
  {
    promo_id: 6,
    code: "FLASH25",
    discount_percent: 25,
    start_date: "2024-11-01",
    end_date: "2024-11-30",
    status: "ACTIVE",
    created_at: "2024-11-01T11:30:00Z"
  },
  {
    promo_id: 7,
    code: "BLACKFRIDAY40",
    discount_percent: 40,
    start_date: "2024-11-24",
    end_date: "2024-11-26",
    status: "EXPIRED",
    created_at: "2024-11-24T00:00:00Z"
  },
  {
    promo_id: 8,
    code: "STUDENT12",
    discount_percent: 12,
    start_date: "2024-09-01",
    end_date: "2024-12-31",
    status: "ACTIVE",
    created_at: "2024-09-01T14:45:00Z"
  },
  {
    promo_id: 9,
    code: "BIRTHDAY20",
    discount_percent: 20,
    start_date: "2024-01-01",
    end_date: "2024-12-31",
    status: "ACTIVE",
    created_at: "2024-01-01T16:20:00Z"
  },
  {
    promo_id: 10,
    code: "FIRSTTIME15",
    discount_percent: 15,
    start_date: "2024-02-01",
    end_date: "2024-12-31",
    status: "ACTIVE",
    created_at: "2024-02-01T09:30:00Z"
  },
  {
    promo_id: 11,
    code: "LOYALTY10",
    discount_percent: 10,
    start_date: "2024-04-01",
    end_date: "2024-12-31",
    status: "ACTIVE",
    created_at: "2024-04-01T11:45:00Z"
  },
  {
    promo_id: 12,
    code: "HOLIDAY35",
    discount_percent: 35,
    start_date: "2024-12-20",
    end_date: "2024-12-31",
    status: "ACTIVE",
    created_at: "2024-12-20T14:15:00Z"
  }
];

export default function PromotionTable() {
  // State management
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotionData);
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Filtered promotions based on search
  const filteredPromotions = useMemo(() => {
    if (!searchTerm.trim()) return promotions;
    
    return promotions.filter(promotion =>
      promotion.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promotion.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [promotions, searchTerm]);

  // Calculate pagination for filtered data
  const totalItems = filteredPromotions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPromotions = filteredPromotions.slice(startIndex, endIndex);

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
  const handleFormSubmit = (promotionData: PromotionFormData) => {
    if (formMode === 'add') {
      // Generate new ID for new promotion
      const newId = Math.max(...promotions.map(p => p.promo_id)) + 1;
      const newPromotion: Promotion = {
        ...promotionData,
        promo_id: newId,
        created_at: new Date().toISOString()
      };
      setPromotions(prev => [...prev, newPromotion]);
    } else {
      // Update existing promotion
      setPromotions(prev => prev.map(promo => 
        promo.promo_id === selectedPromotion?.promo_id 
          ? { ...promo, ...promotionData, updated_at: new Date().toISOString() }
          : promo
      ));
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
  const handleConfirmDelete = () => {
    if (confirmAction) {
      setPromotions(prev => prev.filter(promo => promo.promo_id !== confirmAction.promotion.promo_id));
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
      {searchTerm && (
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Tìm thấy {totalItems} mã giảm giá cho từ khóa "{searchTerm}"
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
              {currentPromotions.length > 0 ? (
                currentPromotions.map((promotion) => (
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
                  <TableCell colSpan={6} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                    {searchTerm ? 'Không tìm thấy mã giảm giá nào phù hợp' : 'Chưa có mã giảm giá nào'}
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
