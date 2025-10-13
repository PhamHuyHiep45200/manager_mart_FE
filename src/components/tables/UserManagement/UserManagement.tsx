import { useState } from 'react';
import PageBreadcrumb from "../../common/PageBreadCrumb";
import ComponentCard from "../../common/ComponentCard";
import PageMeta from "../../common/PageMeta";
import EmployeeTable from "./EmployeeTable";
import CustomerTable from "./CustomerTable";

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState<'employees' | 'customers'>('employees');

  return (
    <>
      <PageMeta
        title="Quản lý người dùng | Mini Mart Management"
        description="Trang quản lý nhân viên và khách hàng cho hệ thống Mini Mart"
      />
      <PageBreadcrumb pageTitle="Quản lý người dùng" />
      
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05] p-1">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('employees')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'employees'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Nhân viên
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'customers'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Khách hàng
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <ComponentCard title={activeTab === 'employees' ? 'Danh sách nhân viên' : 'Danh sách khách hàng'}>
          {activeTab === 'employees' ? <EmployeeTable /> : <CustomerTable />}
        </ComponentCard>
      </div>
    </>
  );
}
