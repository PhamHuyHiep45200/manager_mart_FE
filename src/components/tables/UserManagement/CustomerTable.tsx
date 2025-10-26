import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import Pagination from "../../common/Pagination";
import ConfirmPopup from "./ConfirmPopup";
import { useState } from 'react';
import { useUsersByRole, useDeleteUser } from '../../../hooks/useUsers';
import { useDebounce } from '../../../hooks/useDebounce';
import { showToast } from '../../../utils/toast';
import { useAuthStore } from '../../../stores/authStore';

// Interface cho API response từ backend
interface UserApiResponse {
  id?: number;
  fullName: string;
  email: string;
  phone: string;
  address?: string | null;
  role: 'CUSTOMER' | 'EMPLOYEE';
  points?: number;
  createdDate?: number;
}

// Interface cho khách hàng dựa trên database schema
interface Customer {
  user_id: number;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  role: 'CUSTOMER';
  created_at: string;
  points: number;
  total_orders?: number;
  total_spent?: number;
}

export default function CustomerTable() {
  // Get current user from auth store
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'ADMIN';

  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'delete';
    customer: Customer;
  } | null>(null);

  // Debounce search term để tối ưu hiệu suất
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // React Query hooks
  const searchRequest = {
    page: currentPage - 1, // API sử dụng 0-based pagination
    size: itemsPerPage,
    sortField: [
      {
        fieldName: 'createdDate',
        sort: 'DESC' as const
      }
    ],
    lsCondition: debouncedSearchTerm ? [
      {
        property: 'fullName',
        propertyType: 'string' as const,
        operator: 'EQUAL' as const,
        value: debouncedSearchTerm
      }
    ] : []
  };

  const { data: customersData, isLoading, error, refetch } = useUsersByRole('CUSTOMER', searchRequest);
  const deleteUserMutation = useDeleteUser();

  // Convert API data to Customer format
  const customers: Customer[] = customersData?.data?.content?.map((user: UserApiResponse) => ({
    user_id: user.id || 0,
    full_name: user.fullName,
    email: user.email,
    phone: user.phone,
    address: user.address || '',
    role: 'CUSTOMER' as const,
    created_at: user.createdDate ? new Date(user.createdDate).toISOString() : new Date().toISOString(),
    points: user.points || 0,
    total_orders: Math.floor(Math.random() * 30) + 1, // Mock data cho demo
    total_spent: Math.floor(Math.random() * 5000000) + 100000 // Mock data cho demo
  })) || [];

  // Pagination data
  const totalItems = customersData?.data?.totalElements || 0;
  const totalPages = customersData?.data?.totalPages || 0;

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Handle search - chỉ cập nhật state local, debounce sẽ xử lý API call
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle delete customer
  const handleDeleteCustomer = (customer: Customer) => {
    if (!isAdmin) {
      showToast.error('Bạn không có quyền xóa khách hàng!');
      return;
    }
    setConfirmAction({
      type: 'delete',
      customer
    });
    setIsConfirmPopupOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (confirmAction?.customer) {
      try {
        await deleteUserMutation.mutateAsync(confirmAction.customer.user_id);
        showToast.success('Xóa khách hàng thành công!');
      } catch (error) {
        console.error('Error deleting customer:', error);
        showToast.error('Có lỗi xảy ra khi xóa khách hàng!');
      }
    }
    setIsConfirmPopupOpen(false);
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

  // Function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Function to get customer level badge
  const getCustomerLevelBadge = (totalSpent: number) => {
    if (totalSpent >= 3000000) {
      return { color: 'success' as const, text: 'VIP' };
    } else if (totalSpent >= 1500000) {
      return { color: 'warning' as const, text: 'Thường xuyên' };
    } else {
      return { color: 'info' as const, text: 'Mới' };
    }
  };

  return (
    <>
      {/* Search Input */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Tìm kiếm khách hàng..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
          <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

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
                Khách hàng
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Liên hệ
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Đơn hàng
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Tổng chi tiêu
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Điểm tích lũy
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Loại khách
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Ngày đăng ký
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
            {customers.map((customer) => {
              const customerLevel = getCustomerLevelBadge(customer.total_spent || 0);
              
              return (
                <TableRow key={customer.user_id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      #{customer.user_id}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {customer.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {customer.full_name}
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          {customer.address}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="space-y-1">
                      <div className="text-xs">{customer.email}</div>
                      <div className="text-xs font-medium">{customer.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <span className="font-medium text-gray-800 dark:text-white/90">
                      {customer.total_orders} đơn
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <span className="font-medium text-gray-800 dark:text-white/90">
                      {formatCurrency(customer.total_spent || 0)}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <span className="font-medium text-gray-800 dark:text-white/90">
                      {customer.points.toLocaleString('vi-VN')} điểm
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={customerLevel.color}
                    >
                      {customerLevel.text}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {formatDate(customer.created_at)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {isAdmin ? (
                      <div className="flex items-center gap-2">
                        {/* <button className="text-primary hover:text-primary/80 transition-colors" title="Xem chi tiết">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button className="text-blue-500 hover:text-blue-600 transition-colors" title="Lịch sử mua hàng">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </button> */}
                        <button 
                          onClick={() => handleDeleteCustomer(customer)}
                          className="text-red-500 hover:text-red-600 transition-colors" 
                          title="Xóa khách hàng"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">Không có quyền</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        onItemsPerPageChange={handleItemsPerPageChange}
        showItemsPerPage={true}
      />
      </div>

      {/* Confirm Popup */}
      <ConfirmPopup
        isOpen={isConfirmPopupOpen}
        onClose={() => setIsConfirmPopupOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xóa khách hàng"
        message={`Bạn có chắc chắn muốn xóa khách hàng "${confirmAction?.customer.full_name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa khách hàng"
        type="danger"
      />
    </>
  );
}
