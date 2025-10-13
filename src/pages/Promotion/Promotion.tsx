import PromotionTable from '../../components/tables/PromotionManagement/PromotionTable';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";

function PromotionPage() {
  return (
    <>
      <PageMeta
        title="Quản lý mã giảm giá | Mini Mart Management"
        description="Trang quản lý mã giảm giá cho hệ thống Mini Mart"
      />
      <PageBreadcrumb pageTitle="Quản lý mã giảm giá" />
      
      <div className="space-y-6">
        <ComponentCard title="Danh sách mã giảm giá">
          <PromotionTable />
        </ComponentCard>
      </div>
    </>
  )
}

export default PromotionPage
