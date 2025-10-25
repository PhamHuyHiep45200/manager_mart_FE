import { useNavigate } from 'react-router';

export default function Support() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={handleGoBack}
                className="mr-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Hướng dẫn sử dụng hệ thống
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Mục lục
              </h2>
              <nav className="space-y-2">
                <a href="#overview" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  1. Tổng quan hệ thống
                </a>
                <a href="#category-management" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  2. Quản lý danh mục
                </a>
                <a href="#product-management" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  3. Quản lý sản phẩm
                </a>
                <a href="#promotion-management" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  4. Quản lý khuyến mãi
                </a>
                <a href="#user-management" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  5. Quản lý người dùng
                </a>
                <a href="#supplier-management" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  6. Quản lý nhà cung cấp
                </a>
                <a href="#best-practices" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  7. Thực hành tốt nhất
                </a>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              
              {/* Overview Section */}
              <section id="overview" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  1. Tổng quan hệ thống
                </h2>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Hệ thống quản lý siêu thị WinMart cung cấp các tính năng quản lý toàn diện cho việc vận hành siêu thị, 
                    bao gồm quản lý sản phẩm, danh mục, khuyến mãi, người dùng và nhà cung cấp.
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      🔑 Quy trình làm việc cơ bản
                    </h3>
                    <ol className="list-decimal list-inside text-blue-800 dark:text-blue-200 space-y-2">
                      <li>Tạo danh mục sản phẩm trước</li>
                      <li>Thêm sản phẩm vào danh mục</li>
                      <li>Thiết lập khuyến mãi cho sản phẩm</li>
                      <li>Quản lý người dùng và phân quyền</li>
                      <li>Theo dõi nhà cung cấp</li>
                    </ol>
                  </div>
                </div>
              </section>

              {/* Category Management Section */}
              <section id="category-management" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  2. Quản lý danh mục
                </h2>
                <div className="space-y-6">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">
                      📁 Tạo danh mục mới
                    </h3>
                    <ol className="list-decimal list-inside text-green-800 dark:text-green-200 space-y-2">
                      <li>Vào menu <strong>Category Management</strong></li>
                      <li>Nhấn nút <strong>"Thêm danh mục"</strong></li>
                      <li>Điền thông tin:
                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                          <li>Tên danh mục (bắt buộc)</li>
                          <li>Mô tả danh mục</li>
                          <li>Hình ảnh đại diện</li>
                          <li>Danh mục cha (nếu có)</li>
                        </ul>
                      </li>
                      <li>Nhấn <strong>"Lưu"</strong> để tạo</li>
                    </ol>
                  </div>
                  
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-4">
                      ⚠️ Lưu ý quan trọng
                    </h3>
                    <ul className="list-disc list-inside text-yellow-800 dark:text-yellow-200 space-y-2">
                      <li>Danh mục phải được tạo trước khi thêm sản phẩm</li>
                      <li>Không thể xóa danh mục có sản phẩm</li>
                      <li>Có thể tạo danh mục con để phân loại chi tiết</li>
                      <li>Tên danh mục không được trùng lặp</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Product Management Section */}
              <section id="product-management" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  3. Quản lý sản phẩm
                </h2>
                <div className="space-y-6">
                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-4">
                      🛍️ Thêm sản phẩm mới
                    </h3>
                    <ol className="list-decimal list-inside text-purple-800 dark:text-purple-200 space-y-2">
                      <li>Vào menu <strong>Product Management</strong></li>
                      <li>Nhấn nút <strong>"Thêm sản phẩm"</strong></li>
                      <li>Điền thông tin sản phẩm:
                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                          <li>Tên sản phẩm (bắt buộc)</li>
                          <li>Chọn danh mục (bắt buộc)</li>
                          <li>Giá bán</li>
                          <li>Số lượng tồn kho</li>
                          <li>Mô tả sản phẩm</li>
                          <li>Hình ảnh sản phẩm</li>
                          <li>Thông tin nhà cung cấp</li>
                        </ul>
                      </li>
                      <li>Nhấn <strong>"Lưu"</strong> để tạo sản phẩm</li>
                    </ol>
                  </div>

                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-4">
                      ❌ Lỗi thường gặp
                    </h3>
                    <ul className="list-disc list-inside text-red-800 dark:text-red-200 space-y-2">
                      <li><strong>Lỗi:</strong> "Danh mục không tồn tại" → <strong>Giải pháp:</strong> Tạo danh mục trước</li>
                      <li><strong>Lỗi:</strong> "Tên sản phẩm đã tồn tại" → <strong>Giải pháp:</strong> Đổi tên sản phẩm</li>
                      <li><strong>Lỗi:</strong> "Giá không hợp lệ" → <strong>Giải pháp:</strong> Nhập giá &gt; 0</li>
                      <li><strong>Lỗi:</strong> "Số lượng không hợp lệ" → <strong>Giải pháp:</strong> Nhập số lượng &gt;= 0</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Promotion Management Section */}
              <section id="promotion-management" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  4. Quản lý khuyến mãi
                </h2>
                <div className="space-y-6">
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-4">
                      🎯 Tạo chương trình khuyến mãi
                    </h3>
                    <ol className="list-decimal list-inside text-indigo-800 dark:text-indigo-200 space-y-2">
                      <li>Vào menu <strong>Promotion Management</strong></li>
                      <li>Nhấn nút <strong>"Thêm khuyến mãi"</strong></li>
                      <li>Thiết lập khuyến mãi:
                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                          <li>Tên chương trình khuyến mãi</li>
                          <li>Loại giảm giá (% hoặc số tiền)</li>
                          <li>Giá trị giảm giá</li>
                          <li>Ngày bắt đầu và kết thúc</li>
                          <li>Điều kiện áp dụng</li>
                          <li>Sản phẩm/danh mục áp dụng</li>
                        </ul>
                      </li>
                      <li>Nhấn <strong>"Lưu"</strong> để tạo khuyến mãi</li>
                    </ol>
                  </div>
                </div>
              </section>

              {/* User Management Section */}
              <section id="user-management" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  5. Quản lý người dùng
                </h2>
                <div className="space-y-6">
                  <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-teal-900 dark:text-teal-100 mb-4">
                      👥 Quản lý nhân viên và khách hàng
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-teal-800 dark:text-teal-200 mb-2">Nhân viên:</h4>
                        <ul className="list-disc list-inside text-teal-700 dark:text-teal-300 space-y-1 text-sm">
                          <li>Thêm/sửa/xóa nhân viên</li>
                          <li>Phân quyền truy cập</li>
                          <li>Theo dõi hoạt động</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-teal-800 dark:text-teal-200 mb-2">Khách hàng:</h4>
                        <ul className="list-disc list-inside text-teal-700 dark:text-teal-300 space-y-1 text-sm">
                          <li>Xem danh sách khách hàng</li>
                          <li>Quản lý điểm tích lũy</li>
                          <li>Lịch sử mua hàng</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Supplier Management Section */}
              <section id="supplier-management" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  6. Quản lý nhà cung cấp
                </h2>
                <div className="space-y-6">
                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-4">
                      🏭 Quản lý nhà cung cấp
                    </h3>
                    <ol className="list-decimal list-inside text-orange-800 dark:text-orange-200 space-y-2">
                      <li>Vào menu <strong>Supplier Management</strong></li>
                      <li>Thêm thông tin nhà cung cấp:
                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                          <li>Tên công ty</li>
                          <li>Thông tin liên hệ</li>
                          <li>Địa chỉ</li>
                          <li>Sản phẩm cung cấp</li>
                        </ul>
                      </li>
                      <li>Theo dõi hợp đồng và giao hàng</li>
                    </ol>
                  </div>
                </div>
              </section>

              {/* Best Practices Section */}
              <section id="best-practices" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  7. Thực hành tốt nhất
                </h2>
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      ✅ Checklist hàng ngày
                    </h3>
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                      <li>Kiểm tra tồn kho sản phẩm</li>
                      <li>Cập nhật giá sản phẩm nếu cần</li>
                      <li>Kiểm tra khuyến mãi đang hoạt động</li>
                      <li>Theo dõi đơn hàng mới</li>
                      <li>Kiểm tra thông tin nhà cung cấp</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      🔒 Bảo mật và sao lưu
                    </h3>
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                      <li>Thay đổi mật khẩu định kỳ</li>
                      <li>Không chia sẻ thông tin đăng nhập</li>
                      <li>Sao lưu dữ liệu thường xuyên</li>
                      <li>Kiểm tra log hoạt động</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      📞 Hỗ trợ kỹ thuật
                    </h3>
                    <div className="text-gray-700 dark:text-gray-300 space-y-2">
                      <p>Nếu gặp vấn đề kỹ thuật, vui lòng liên hệ:</p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Email: support@winmart.com</li>
                        <li>Hotline: 1900-xxxx</li>
                        <li>Thời gian hỗ trợ: 8:00 - 17:00 (T2-T6)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
