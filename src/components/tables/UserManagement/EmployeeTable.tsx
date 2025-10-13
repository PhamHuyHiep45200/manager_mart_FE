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

// Mock data cho nhân viên (tăng số lượng để demo phân trang)
const initialEmployeeData: Employee[] = [
  {
    user_id: 1,
    full_name: "Nguyễn Văn An",
    email: "nguyen.van.an@minimart.com",
    phone: "0123456789",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    role: "ADMIN",
    created_at: "2024-01-15T08:30:00Z",
    is_locked: false
  },
  {
    user_id: 2,
    full_name: "Trần Thị Bình",
    email: "tran.thi.binh@minimart.com",
    phone: "0987654321",
    address: "456 Đường XYZ, Quận 2, TP.HCM",
    role: "EMPLOYEE",
    created_at: "2024-02-20T09:15:00Z",
    is_locked: false
  },
  {
    user_id: 3,
    full_name: "Lê Văn Cường",
    email: "le.van.cuong@minimart.com",
    phone: "0369258147",
    address: "789 Đường DEF, Quận 3, TP.HCM",
    role: "EMPLOYEE",
    created_at: "2024-03-10T10:00:00Z",
    is_locked: true
  },
  {
    user_id: 4,
    full_name: "Phạm Thị Dung",
    email: "pham.thi.dung@minimart.com",
    phone: "0741852963",
    address: "321 Đường GHI, Quận 4, TP.HCM",
    role: "EMPLOYEE",
    created_at: "2024-04-05T11:30:00Z",
    is_locked: false
  },
  {
    user_id: 5,
    full_name: "Hoàng Văn Em",
    email: "hoang.van.em@minimart.com",
    phone: "0527419638",
    address: "654 Đường JKL, Quận 5, TP.HCM",
    role: "EMPLOYEE",
    created_at: "2024-05-12T14:45:00Z",
    is_locked: false
  },
  {
    user_id: 6,
    full_name: "Võ Thị Phương",
    email: "vo.thi.phuong@minimart.com",
    phone: "0963258741",
    address: "987 Đường MNO, Quận 6, TP.HCM",
    role: "EMPLOYEE",
    created_at: "2024-06-08T16:20:00Z",
    is_locked: false
  },
  {
    user_id: 7,
    full_name: "Đặng Văn Quang",
    email: "dang.van.quang@minimart.com",
    phone: "0852741963",
    address: "147 Đường PQR, Quận 7, TP.HCM",
    role: "EMPLOYEE",
    created_at: "2024-07-15T09:30:00Z",
    is_locked: true
  },
  {
    user_id: 8,
    full_name: "Bùi Thị Lan",
    email: "bui.thi.lan@minimart.com",
    phone: "0741852963",
    address: "258 Đường STU, Quận 8, TP.HCM",
    role: "EMPLOYEE",
    created_at: "2024-08-22T11:45:00Z",
    is_locked: false
  },
  {
    user_id: 9,
    full_name: "Phan Văn Minh",
    email: "phan.van.minh@minimart.com",
    phone: "0369258147",
    address: "369 Đường VWX, Quận 9, TP.HCM",
    role: "EMPLOYEE",
    created_at: "2024-09-10T14:15:00Z",
    is_locked: false
  },
  {
    user_id: 10,
    full_name: "Ngô Thị Hoa",
    email: "ngo.thi.hoa@minimart.com",
    phone: "0527419638",
    address: "741 Đường YZA, Quận 10, TP.HCM",
    role: "EMPLOYEE",
    created_at: "2024-10-05T08:00:00Z",
    is_locked: false
  },
  {
    user_id: 11,
    full_name: "Trịnh Văn Tuấn",
    email: "trinh.van.tuan@minimart.com",
    phone: "0963258741",
    address: "852 Đường BCD, Quận 11, TP.HCM",
    role: "EMPLOYEE",
    created_at: "2024-11-12T10:30:00Z",
    is_locked: false
  },
  {
    user_id: 12,
    full_name: "Lý Thị Mai",
    email: "ly.thi.mai@minimart.com",
    phone: "0741852963",
    address: "963 Đường EFG, Quận 12, TP.HCM",
    role: "EMPLOYEE",
    created_at: "2024-12-01T13:20:00Z",
    is_locked: true
  }
];

export default function EmployeeTable() {
  // State management
  const [employees, setEmployees] = useState<Employee[]>(initialEmployeeData);
  const [isFormPopupOpen, setIsFormPopupOpen] = useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'lock' | 'unlock';
    employee: Employee;
  } | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Calculate pagination
  const totalItems = employees.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = employees.slice(startIndex, endIndex);

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
  const handleFormSubmit = (employeeData: EmployeeFormData) => {
    if (formMode === 'add') {
      // Generate new ID for new employee
      const newId = Math.max(...employees.map(e => e.user_id)) + 1;
      const newEmployee: Employee = {
        ...employeeData,
        user_id: newId,
        created_at: new Date().toISOString(),
        is_locked: false
      };
      setEmployees(prev => [...prev, newEmployee]);
    } else {
      // Update existing employee
      setEmployees(prev => prev.map(emp => 
        emp.user_id === selectedEmployee?.user_id 
          ? { ...emp, ...employeeData }
          : emp
      ));
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

  // Handle confirm lock/unlock
  const handleConfirmLockToggle = () => {
    if (confirmAction) {
      setEmployees(prev => prev.map(emp => 
        emp.user_id === confirmAction.employee.user_id 
          ? { ...emp, is_locked: !emp.is_locked }
          : emp
      ));
    }
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <>
      {/* Add Employee Button */}
      <div className="mb-4 flex justify-end">
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
            {currentEmployees.map((employee) => (
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
