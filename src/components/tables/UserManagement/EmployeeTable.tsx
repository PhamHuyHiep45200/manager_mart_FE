import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import EmployeeFormPopup from "./EmployeeFormPopup";
import ConfirmPopup from "./ConfirmPopup";
import Pagination from "../../common/Pagination";
import { Employee, EmployeeFormData } from "./types";
import { useUsersByRole, useCreateUser, useUpdateUser, useDeleteUser } from '../../../hooks/useUsers';
import { User } from '../../../services/userService';
import { showToast } from '../../../utils/toast';
import { useDebounce } from '../../../hooks/useDebounce';

export default function EmployeeTable() {
  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormPopupOpen, setIsFormPopupOpen] = useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'delete';
    employee: Employee;
  } | null>(null);

  // Debounce search term để tối ưu hiệu suất
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // React Query hooks
  const searchRequest = {
    page: currentPage,
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
        operator: 'CONTAINS' as const,
        value: debouncedSearchTerm
      }
    ] : []
  };

  const { data: employeesData, isLoading, error, refetch } = useUsersByRole('STAFF', searchRequest);
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  // Convert API data to Employee format
  const employees: Employee[] = employeesData?.data?.content?.map((user: User) => ({
    user_id: user.id || 0,
    full_name: user.fullName,
    email: user.email,
    phone: user.phone,
    address: user.address || '',
    role: user.role as 'EMPLOYEE' | 'CUSTOMER',
    created_at: new Date().toISOString(), // API không trả về created_at, sử dụng thời gian hiện tại
    is_locked: false // API không có field này, mặc định false
  })) || [];

  // Pagination data
  const totalItems = employeesData?.data?.totalElements || 0;
  const totalPages = employeesData?.data?.totalPages || 0;

  // Function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Function to get role badge color
  const getRoleBadgeColor = (role: string) => {
    return role === 'EMPLOYEE' ? 'error' : 'success';
  };

  // Function to get role display text
  const getRoleDisplayText = (role: string) => {
    return role === 'EMPLOYEE' ? 'Nhân viên' : 'Khách hàng';
  };

  // Handle add employee
  const handleAddEmployee = () => {
    setFormMode('add');
    setSelectedEmployee(null);
    setIsFormPopupOpen(true);
  };

  // Handle edit employee
  const handleEditEmployee = (employee: Employee) => {
    setFormMode('edit');
    setSelectedEmployee(employee);
    setIsFormPopupOpen(true);
  };

  // Handle form submit
  const handleFormSubmit = async (employeeData: EmployeeFormData) => {
    try {
      if (formMode === 'add') {
        const userData: User = {
          fullName: employeeData.full_name,
          email: employeeData.email,
          phone: employeeData.phone,
          address: employeeData.address,
          role: employeeData.role as 'EMPLOYEE' | 'CUSTOMER',
          password: employeeData.password || 'defaultPassword123'
        };
        await createUserMutation.mutateAsync(userData);
        showToast.success('Thêm nhân viên thành công!');
      } else if (selectedEmployee) {
        const userData: Partial<User> & { id: number } = {
          id: selectedEmployee.user_id,
          fullName: employeeData.full_name,
          email: employeeData.email,
          phone: employeeData.phone,
          address: employeeData.address,
          role: employeeData.role as 'EMPLOYEE' | 'CUSTOMER',
        };
        await updateUserMutation.mutateAsync(userData);
        showToast.success('Cập nhật thông tin nhân viên thành công!');
      }
      setIsFormPopupOpen(false);
    } catch (error) {
      console.error('Error saving employee:', error);
      showToast.error('Có lỗi xảy ra khi lưu thông tin nhân viên!');
    }
  };

  // Handle delete employee
  const handleDeleteEmployee = (employee: Employee) => {
    setConfirmAction({
      type: 'delete',
      employee
    });
    setIsConfirmPopupOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (confirmAction?.employee) {
      try {
        await deleteUserMutation.mutateAsync(confirmAction.employee.user_id);
        showToast.success('Xóa nhân viên thành công!');
      } catch (error) {
        console.error('Error deleting employee:', error);
        showToast.error('Có lỗi xảy ra khi xóa nhân viên!');
      }
    }
    setIsConfirmPopupOpen(false);
  };

  // Handle search - chỉ cập nhật state local, debounce sẽ xử lý API call
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
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
      {/* Search and Add Employee */}
      <div className="mb-4 flex justify-between items-center">
        {/* Search Input */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm nhân viên..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Add Employee Button */}
        <button
          onClick={handleAddEmployee}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm nhân viên
        </button>
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
                Họ và tên
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Email
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Số điện thoại
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Vai trò
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
            {employees.map((employee) => (
              <TableRow key={employee.user_id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    #{employee.user_id}
                  </span>
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 overflow-hidden rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold text-sm">
                        {employee.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {employee.full_name}
                      </span>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {employee.address}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {employee.email}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {employee.phone}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={getRoleBadgeColor(employee.role)}
                  >
                    {getRoleDisplayText(employee.role)}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {formatDate(employee.created_at)}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEditEmployee(employee)}
                      className="text-primary hover:text-primary/80 transition-colors"
                      title="Chỉnh sửa"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDeleteEmployee(employee)}
                      className="text-red-500 hover:text-red-600 transition-colors"
                      title="Xóa nhân viên"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
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

    {/* Employee Form Popup */}
    <EmployeeFormPopup
      isOpen={isFormPopupOpen}
      onClose={() => setIsFormPopupOpen(false)}
      onSubmit={handleFormSubmit}
      employee={selectedEmployee}
      mode={formMode}
    />

    {/* Confirm Popup */}
    <ConfirmPopup
      isOpen={isConfirmPopupOpen}
      onClose={() => setIsConfirmPopupOpen(false)}
      onConfirm={handleConfirmDelete}
      title="Xóa nhân viên"
      message={`Bạn có chắc chắn muốn xóa nhân viên "${confirmAction?.employee.full_name}"? Hành động này không thể hoàn tác.`}
      confirmText="Xóa nhân viên"
      type="danger"
    />
  </>
  );
}
