
import CategoryTable from '../../components/tables/CategoryManagement/CategoryTable';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";

function CategoryPage() {
  return (
    <>
      <PageMeta
        title="Quản lý danh mục | Mini Mart Management"
        description="Trang quản lý danh mục sản phẩm cho hệ thống Mini Mart"
      />
      <PageBreadcrumb pageTitle="Quản lý danh mục" />
      
      <div className="space-y-6">
        <ComponentCard title="Danh sách danh mục">
          <CategoryTable />
        </ComponentCard>
      </div>
    </>
  )
}

export default CategoryPage
