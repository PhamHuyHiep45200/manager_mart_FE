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
import { useUsersByRole, useCreateUser, useUpdateUser } from '../../../hooks/useUsers';
import { User } from '../../../services/userService';

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
    type: 'lock' | 'unlock';
    employee: Employee;
  } | null>(null);

  // React Query hooks
  const searchRequest = {
    page: currentPage - 1, // API sử dụng 0-based pagination
    size: itemsPerPage,
    sorts: [],
    filters: searchTerm ? [{ field: 'fullName', operator: 'contains', value: searchTerm }] : []
  };

  const { data: employeesData, isLoading, error, refetch } = useUsersByRole('STAFF', searchRequest);
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  // Convert API data to Employee format
  const employees: Employee[] = employeesData?.content?.map((user: User) => ({
    user_id: user.id || 0,
    full_name: user.fullName,
    email: user.email,
    phone: user.phone,
    address: user.address,
          role: user.role === 'STAFF' ? 'EMPLOYEE' : 'ADMIN',
    created_at: new Date().toISOString(), // API không trả về created_at, sử dụng thời gian hiện tại
    is_locked: false // API không có field này, mặc định false
  })) || [];

  // Pagination data
  const totalItems = employeesData?.totalElements || 0;
  const totalPages = employeesData?.totalPages || 0;

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
    return role === 'ADMIN' ? 'error' : 'success';
  };

  // Function to get role display text
  const getRoleDisplayText = (role: string) => {
    return role === 'ADMIN' ? 'Quản trị viên' : 'Nhân viên';
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
          role: employeeData.role === 'EMPLOYEE' ? 'STAFF' : 'ADMIN',
          password: employeeData.password || 'defaultPassword123'
        };
        await createUserMutation.mutateAsync(userData);
      } else if (selectedEmployee) {
        const userData: Partial<User> & { id: number } = {
          id: selectedEmployee.user_id,
          fullName: employeeData.full_name,
          email: employeeData.email,
          phone: employeeData.phone,
          address: employeeData.address,
          role: employeeData.role === 'EMPLOYEE' ? 'STAFF' : 'ADMIN'
        };
        await updateUserMutation.mutateAsync(userData);
      }
      setIsFormPopupOpen(false);
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  // Handle lock/unlock employee
  const handleLockToggle = (employee: Employee) => {
    setConfirmAction({
      type: employee.is_locked ? 'unlock' : 'lock',
      employee
    });
    setIsConfirmPopupOpen(true);
  };

  // Handle confirm lock/unlock (tạm thời disable vì API không hỗ trợ)
  const handleConfirmLockToggle = () => {
    // TODO: Implement lock/unlock API when available
    console.log('Lock/unlock functionality not implemented yet');
    setIsConfirmPopupOpen(false);
  };

  // Handle search
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
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
              <TableRow key={employee.user_id} className={employee.is_locked ? 'opacity-60 bg-gray-50 dark:bg-gray-800/50' : ''}>
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
                        {employee.is_locked && (
                          <span className="ml-2 text-xs text-red-500">(Đã khóa)</span>
                        )}
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
                      onClick={() => handleLockToggle(employee)}
                      className={`transition-colors ${
                        employee.is_locked 
                          ? 'text-green-500 hover:text-green-600' 
                          : 'text-red-500 hover:text-red-600'
                      }`}
                      title={employee.is_locked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                    >
                      {employee.is_locked ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      )}
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
      onConfirm={handleConfirmLockToggle}
      title={confirmAction?.type === 'lock' ? 'Khóa tài khoản nhân viên' : 'Mở khóa tài khoản nhân viên'}
      message={
        confirmAction?.type === 'lock'
          ? `Bạn có chắc chắn muốn khóa tài khoản của nhân viên "${confirmAction?.employee.full_name}"? Nhân viên này sẽ không thể đăng nhập vào hệ thống.`
          : `Bạn có chắc chắn muốn mở khóa tài khoản của nhân viên "${confirmAction?.employee.full_name}"? Nhân viên này sẽ có thể đăng nhập vào hệ thống trở lại.`
      }
      confirmText={confirmAction?.type === 'lock' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
      type={confirmAction?.type === 'lock' ? 'danger' : 'info'}
    />
  </>
  );
}
