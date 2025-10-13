import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import Pagination from "../../common/Pagination";
import { useState } from 'react';

// Interface cho khách hàng dựa trên database schema
interface Customer {
  user_id: number;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  role: 'CUSTOMER';
  created_at: string;
  total_orders?: number;
  total_spent?: number;
}

// Mock data cho khách hàng (tăng số lượng để demo phân trang)
const initialCustomerData: Customer[] = [
  {
    user_id: 101,
    full_name: "Nguyễn Thị Lan",
    email: "nguyen.thi.lan@gmail.com",
    phone: "0123456789",
    address: "123 Đường Nguyễn Huệ, Quận 1, TP.HCM",
    role: "CUSTOMER",
    created_at: "2024-01-10T08:30:00Z",
    total_orders: 15,
    total_spent: 2500000
  },
  {
    user_id: 102,
    full_name: "Trần Văn Minh",
    email: "tran.van.minh@yahoo.com",
    phone: "0987654321",
    address: "456 Đường Lê Lợi, Quận 2, TP.HCM",
    role: "CUSTOMER",
    created_at: "2024-02-15T09:15:00Z",
    total_orders: 8,
    total_spent: 1200000
  },
  {
    user_id: 103,
    full_name: "Lê Thị Hoa",
    email: "le.thi.hoa@gmail.com",
    phone: "0369258147",
    address: "789 Đường Điện Biên Phủ, Quận 3, TP.HCM",
    role: "CUSTOMER",
    created_at: "2024-03-05T10:00:00Z",
    total_orders: 22,
    total_spent: 3800000
  },
  {
    user_id: 104,
    full_name: "Phạm Văn Tuấn",
    email: "pham.van.tuan@outlook.com",
    phone: "0741852963",
    address: "321 Đường Cách Mạng Tháng 8, Quận 4, TP.HCM",
    role: "CUSTOMER",
    created_at: "2024-04-12T11:30:00Z",
    total_orders: 5,
    total_spent: 850000
  },
  {
    user_id: 105,
    full_name: "Hoàng Thị Mai",
    email: "hoang.thi.mai@gmail.com",
    phone: "0527419638",
    address: "654 Đường Nguyễn Thị Minh Khai, Quận 5, TP.HCM",
    role: "CUSTOMER",
    created_at: "2024-05-20T14:45:00Z",
    total_orders: 12,
    total_spent: 1950000
  },
  {
    user_id: 106,
    full_name: "Võ Văn Đức",
    email: "vo.van.duc@gmail.com",
    phone: "0963258741",
    address: "987 Đường Võ Văn Tần, Quận 6, TP.HCM",
    role: "CUSTOMER",
    created_at: "2024-06-08T16:20:00Z",
    total_orders: 3,
    total_spent: 450000
  },
  {
    user_id: 107,
    full_name: "Đặng Thị Linh",
    email: "dang.thi.linh@gmail.com",
    phone: "0852741963",
    address: "147 Đường Nguyễn Văn Cừ, Quận 7, TP.HCM",
    role: "CUSTOMER",
    created_at: "2024-07-15T09:30:00Z",
    total_orders: 18,
    total_spent: 3200000
  },
  {
    user_id: 108,
    full_name: "Bùi Văn Hùng",
    email: "bui.van.hung@yahoo.com",
    phone: "0741852963",
    address: "258 Đường Nguyễn Thị Định, Quận 8, TP.HCM",
    role: "CUSTOMER",
    created_at: "2024-08-22T11:45:00Z",
    total_orders: 7,
    total_spent: 1100000
  },
  {
    user_id: 109,
    full_name: "Phan Thị Nga",
    email: "phan.thi.nga@gmail.com",
    phone: "0369258147",
    address: "369 Đường Nguyễn Văn Linh, Quận 9, TP.HCM",
    role: "CUSTOMER",
    created_at: "2024-09-10T14:15:00Z",
    total_orders: 25,
    total_spent: 4200000
  },
  {
    user_id: 110,
    full_name: "Ngô Văn Thành",
    email: "ngo.van.thanh@outlook.com",
    phone: "0527419638",
    address: "741 Đường Nguyễn Văn Trỗi, Quận 10, TP.HCM",
    role: "CUSTOMER",
    created_at: "2024-10-05T08:00:00Z",
    total_orders: 9,
    total_spent: 1600000
  },
  {
    user_id: 111,
    full_name: "Trịnh Thị Thu",
    email: "trinh.thi.thu@gmail.com",
    phone: "0963258741",
    address: "852 Đường Nguyễn Văn Cừ, Quận 11, TP.HCM",
    role: "CUSTOMER",
    created_at: "2024-11-12T10:30:00Z",
    total_orders: 14,
    total_spent: 2300000
  },
  {
    user_id: 112,
    full_name: "Lý Văn Nam",
    email: "ly.van.nam@yahoo.com",
    phone: "0741852963",
    address: "963 Đường Nguyễn Văn Linh, Quận 12, TP.HCM",
    role: "CUSTOMER",
    created_at: "2024-12-01T13:20:00Z",
    total_orders: 6,
    total_spent: 950000
  }
];

export default function CustomerTable() {
  // Pagination state
  const [customers] = useState<Customer[]>(initialCustomerData);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Calculate pagination
  const totalItems = customers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCustomers = customers.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

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
            {currentCustomers.map((customer) => {
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
                    <div className="flex items-center gap-2">
                      <button className="text-primary hover:text-primary/80 transition-colors" title="Xem chi tiết">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button className="text-blue-500 hover:text-blue-600 transition-colors" title="Lịch sử mua hàng">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </button>
                      <button className="text-red-500 hover:text-red-600 transition-colors" title="Xóa">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
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
  );
}
