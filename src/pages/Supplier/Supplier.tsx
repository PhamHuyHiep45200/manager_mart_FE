import SupplierTable from '../../components/tables/SupplierManagement/SupplierTable';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";

function SupplierPage() {
  return (
    <>
      <PageMeta
        title="Quản lý nhà cung cấp | Mini Mart Management"
        description="Trang quản lý nhà cung cấp cho hệ thống Mini Mart"
      />
      <PageBreadcrumb pageTitle="Quản lý nhà cung cấp" />
      
      <div className="space-y-6">
        <ComponentCard title="Danh sách nhà cung cấp">
          <SupplierTable />
        </ComponentCard>
      </div>
    </>
  )
}

export default SupplierPage
