import ProductTable from '../../components/tables/ProductManagement/ProductTable';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";

function ProductPage() {
  return (
    <>
      <PageMeta
        title="Quản lý sản phẩm | Mini Mart Management"
        description="Trang quản lý sản phẩm cho hệ thống Mini Mart"
      />
      <PageBreadcrumb pageTitle="Quản lý sản phẩm" />
      
      <div className="space-y-6">
        <ComponentCard title="Danh sách sản phẩm">
          <ProductTable />
        </ComponentCard>
      </div>
    </>
  )
}

export default ProductPage
