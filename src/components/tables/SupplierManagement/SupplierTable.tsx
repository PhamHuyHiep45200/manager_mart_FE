import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import SupplierFormPopup from "./SupplierFormPopup";
import ConfirmPopup from "../UserManagement/ConfirmPopup";
import Pagination from "../../common/Pagination";
import { Supplier, SupplierFormData } from "./types";

// Mock data cho nhà cung cấp
const initialSupplierData: Supplier[] = [
  {
    supplier_id: 1,
    name: "Công ty TNHH Thực phẩm ABC",
    contact_person: "Nguyễn Văn An",
    email: "contact@abc-food.com",
    phone: "0123456789",
    address: "123 Đường Nguyễn Huệ, Quận 1, TP.HCM",
    created_at: "2024-01-15T08:30:00Z"
  },
  {
    supplier_id: 2,
    name: "Nhà máy sản xuất XYZ",
    contact_person: "Trần Thị Bình",
    email: "info@xyz-factory.com",
    phone: "0987654321",
    address: "456 Đường Lê Lợi, Quận 2, TP.HCM",
    created_at: "2024-01-20T09:15:00Z"
  },
  {
    supplier_id: 3,
    name: "Công ty Đồ uống DEF",
    contact_person: "Lê Văn Cường",
    email: "sales@def-beverage.com",
    phone: "0369258147",
    address: "789 Đường Điện Biên Phủ, Quận 3, TP.HCM",
    created_at: "2024-02-01T10:00:00Z"
  },
  {
    supplier_id: 4,
    name: "Nhà phân phối GHI",
    contact_person: "Phạm Thị Dung",
    email: "contact@ghi-distributor.com",
    phone: "0741852963",
    address: "321 Đường Cách Mạng Tháng 8, Quận 4, TP.HCM",
    created_at: "2024-02-10T11:30:00Z"
  },
  {
    supplier_id: 5,
    name: "Công ty Bánh kẹo JKL",
    contact_person: "Hoàng Văn Em",
    email: "info@jkl-confectionery.com",
    phone: "0527419638",
    address: "654 Đường Nguyễn Thị Minh Khai, Quận 5, TP.HCM",
    created_at: "2024-02-15T14:45:00Z"
  },
  {
    supplier_id: 6,
    name: "Nhà cung cấp Mỹ phẩm MNO",
    contact_person: "Võ Thị Phương",
    email: "sales@mno-cosmetics.com",
    phone: "0963258741",
    address: "987 Đường Võ Văn Tần, Quận 6, TP.HCM",
    created_at: "2024-03-01T16:20:00Z"
  },
  {
    supplier_id: 7,
    name: "Công ty Đồ gia dụng PQR",
    contact_person: "Đặng Văn Quang",
    email: "contact@pqr-household.com",
    phone: "0852741963",
    address: "147 Đường Nguyễn Văn Cừ, Quận 7, TP.HCM",
    created_at: "2024-03-10T09:30:00Z"
  },
  {
    supplier_id: 8,
    name: "Nhà phân phối Đồ chơi STU",
    contact_person: "Bùi Thị Lan",
    email: "info@stu-toys.com",
    phone: "0741852963",
    address: "258 Đường Nguyễn Thị Định, Quận 8, TP.HCM",
    created_at: "2024-03-20T11:45:00Z"
  },
  {
    supplier_id: 9,
    name: "Công ty Văn phòng phẩm VWX",
    contact_person: "Phan Văn Minh",
    email: "sales@vwx-office.com",
    phone: "0369258147",
    address: "369 Đường Nguyễn Văn Linh, Quận 9, TP.HCM",
    created_at: "2024-04-01T14:15:00Z"
  },
  {
    supplier_id: 10,
    name: "Nhà cung cấp Điện tử YZA",
    contact_person: "Ngô Thị Hoa",
    email: "contact@yza-electronics.com",
    phone: "0527419638",
    address: "741 Đường Nguyễn Văn Trỗi, Quận 10, TP.HCM",
    created_at: "2024-04-10T08:00:00Z"
  },
  {
    supplier_id: 11,
    name: "Công ty Thể thao BCD",
    contact_person: "Trịnh Văn Tuấn",
    email: "info@bcd-sports.com",
    phone: "0963258741",
    address: "852 Đường Nguyễn Văn Cừ, Quận 11, TP.HCM",
    created_at: "2024-04-20T10:30:00Z"
  },
  {
    supplier_id: 12,
    name: "Nhà phân phối Sách EFG",
    contact_person: "Lý Thị Mai",
    email: "sales@efg-books.com",
    phone: "0741852963",
    address: "963 Đường Nguyễn Văn Linh, Quận 12, TP.HCM",
    created_at: "2024-05-01T13:20:00Z"
  }
];

export default function SupplierTable() {
  // State management
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSupplierData);
  const [isFormPopupOpen, setIsFormPopupOpen] = useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'delete';
    supplier: Supplier;
  } | null>(null);

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Filtered suppliers based on search
  const filteredSuppliers = useMemo(() => {
    if (!searchTerm.trim()) return suppliers;
    
    return suppliers.filter(supplier =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.phone.includes(searchTerm)
    );
  }, [suppliers, searchTerm]);

  // Calculate pagination for filtered data
  const totalItems = filteredSuppliers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSuppliers = filteredSuppliers.slice(startIndex, endIndex);

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

  // Handle add supplier
  const handleAddSupplier = () => {
    setFormMode('add');
    setSelectedSupplier(null);
    setIsFormPopupOpen(true);
  };

  // Handle edit supplier
  const handleEditSupplier = (supplier: Supplier) => {
    setFormMode('edit');
    setSelectedSupplier(supplier);
    setIsFormPopupOpen(true);
  };

  // Handle form submit
  const handleFormSubmit = (supplierData: SupplierFormData) => {
    if (formMode === 'add') {
      // Generate new ID for new supplier
      const newId = Math.max(...suppliers.map(s => s.supplier_id)) + 1;
      const newSupplier: Supplier = {
        ...supplierData,
        supplier_id: newId,
        created_at: new Date().toISOString()
      };
      setSuppliers(prev => [...prev, newSupplier]);
    } else {
      // Update existing supplier
      setSuppliers(prev => prev.map(sup => 
        sup.supplier_id === selectedSupplier?.supplier_id 
          ? { ...sup, ...supplierData, updated_at: new Date().toISOString() }
          : sup
      ));
    }
  };

  // Handle delete supplier
  const handleDeleteSupplier = (supplier: Supplier) => {
    setConfirmAction({
      type: 'delete',
      supplier
    });
    setIsConfirmPopupOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = () => {
    if (confirmAction) {
      setSuppliers(prev => prev.filter(sup => sup.supplier_id !== confirmAction.supplier.supplier_id));
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
            placeholder="Tìm kiếm nhà cung cấp..."
          />
        </div>

        {/* Add Supplier Button */}
        <button
          onClick={handleAddSupplier}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm nhà cung cấp
        </button>
      </div>

      {/* Search Results Info */}
      {searchTerm && (
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Tìm thấy {totalItems} nhà cung cấp cho từ khóa "{searchTerm}"
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
                  Nhà cung cấp
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Người liên hệ
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
              {currentSuppliers.length > 0 ? (
                currentSuppliers.map((supplier) => (
                  <TableRow key={supplier.supplier_id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        #{supplier.supplier_id}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <span className="text-green-600 dark:text-green-400 font-semibold text-sm">
                            {supplier.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {supplier.name}
                          </span>
                          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                            {supplier.address}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <span className="font-medium text-gray-800 dark:text-white/90">
                        {supplier.contact_person}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="space-y-1">
                        <div className="text-xs">{supplier.email}</div>
                        <div className="text-xs font-medium">{supplier.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {formatDate(supplier.created_at || '')}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEditSupplier(supplier)}
                          className="text-primary hover:text-primary/80 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteSupplier(supplier)}
                          className="text-red-500 hover:text-red-600 transition-colors"
                          title="Xóa nhà cung cấp"
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
                    {searchTerm ? 'Không tìm thấy nhà cung cấp nào phù hợp' : 'Chưa có nhà cung cấp nào'}
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

      {/* Supplier Form Popup */}
      <SupplierFormPopup
        isOpen={isFormPopupOpen}
        onClose={() => setIsFormPopupOpen(false)}
        onSubmit={handleFormSubmit}
        supplier={selectedSupplier}
        mode={formMode}
      />

      {/* Confirm Delete Popup */}
      <ConfirmPopup
        isOpen={isConfirmPopupOpen}
        onClose={() => setIsConfirmPopupOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xóa nhà cung cấp"
        message={`Bạn có chắc chắn muốn xóa nhà cung cấp "${confirmAction?.supplier.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa nhà cung cấp"
        type="danger"
      />
    </>
  );
}
