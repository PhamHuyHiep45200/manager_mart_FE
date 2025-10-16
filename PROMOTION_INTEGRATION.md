# Promotion Management với React Query Integration

## Tổng quan
Đã tích hợp Promotion Management với React Query và API từ Postman collection. Sử dụng `getAll()` API để lấy tất cả promotions mà không cần phân trang.

## Tính năng đã tích hợp

### ✅ **API Integration**
- **GET**: `GET /api/promotions/all` - Lấy tất cả promotions
- **POST**: `POST /api/promotions/create` - Tạo promotion mới
- **No Pagination**: Sử dụng `getAll()` thay vì search API

### ✅ **React Query Integration**
- **No Cache Policy**: staleTime: 0, gcTime: 0 cho admin
- **Auto Refetch**: Khi window focus, mount, reconnect
- **Error Handling**: Loading states và error recovery

### ✅ **CRUD Operations**
- **Create**: Thêm mã giảm giá mới
- **Read**: Hiển thị danh sách với search/filter
- **Update**: TODO - Chưa có API update
- **Delete**: TODO - Chưa có API delete

### ✅ **UI Features**
- **Search**: Tìm kiếm theo mã code và status
- **Pagination**: Client-side pagination
- **Status Badges**: Color-coded status (ACTIVE, INACTIVE, EXPIRED)
- **Date Display**: Format ngày tháng Việt Nam

## Cấu trúc Files

### 📁 **Hooks**
- `src/hooks/usePromotions.ts` - React Query hooks cho Promotion API

### 📁 **Components**
- `src/components/tables/PromotionManagement/PromotionTable.tsx` - Main table component
- `src/components/tables/PromotionManagement/PromotionFormPopup.tsx` - Form popup
- `src/components/tables/PromotionManagement/types.ts` - TypeScript interfaces

### 📁 **Services**
- `src/services/promotionService.ts` - API service functions

## API Endpoints được sử dụng

### 📡 **Promotion APIs**
- `GET /api/promotions/all` - Lấy tất cả promotions
- `POST /api/promotions/create` - Tạo promotion mới

### 🔄 **Request/Response Format**
```typescript
// Create Promotion Request
{
  code: string,
  discountPercent: number,
  startDate: string,
  endDate: string,
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED'
}

// Promotion Response
{
  id: number,
  code: string,
  discountPercent: number,
  startDate: string,
  endDate: string,
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED'
}
```

## Data Mapping

### 🔄 **API ↔ UI Conversion**
```typescript
// API Response → UI Format
{
  id: promo.id || 0,                    // API id → UI promo_id
  code: promo.code,                     // Direct mapping
  discount_percent: promo.discountPercent, // camelCase → snake_case
  start_date: promo.startDate,          // camelCase → snake_case
  end_date: promo.endDate,              // camelCase → snake_case
  status: promo.status,                // Direct mapping
  created_at: new Date().toISOString()  // Mock created_at
}
```

## Tính năng UI/UX

### 🎨 **Visual Design**
- **Purple Theme**: Purple icons và badges cho promotions
- **Status Colors**: 
  - ACTIVE = Green (success)
  - INACTIVE = Yellow (warning) 
  - EXPIRED = Red (error)
- **Date Format**: Vietnamese format (DD/MM/YYYY)

### 🖱️ **Interactions**
- **Search**: Real-time search theo code và status
- **Add**: Click "Thêm mã giảm giá" để tạo mới
- **Edit**: Click edit icon (TODO - chưa có API)
- **Delete**: Click delete icon (TODO - chưa có API)

### 📱 **Responsive Design**
- Mobile-friendly table layout
- Responsive search bar
- Touch-friendly buttons

## Cách sử dụng

### 1. **Thêm mã giảm giá**
- Click "Thêm mã giảm giá"
- Điền thông tin:
  - Mã code (ví dụ: "SALE20")
  - Phần trăm giảm (ví dụ: 20)
  - Ngày bắt đầu và kết thúc
  - Trạng thái (ACTIVE/INACTIVE/EXPIRED)
- Save để tạo

### 2. **Tìm kiếm**
- Nhập mã code hoặc status vào search box
- Kết quả sẽ được filter real-time

### 3. **Pagination**
- Sử dụng controls ở cuối bảng
- Thay đổi số items per page
- Navigate qua các trang

## Technical Implementation

### ⚡ **React Query Configuration**
```typescript
// QueryClient settings
staleTime: 0, // Luôn fetch data mới nhất
gcTime: 0, // Không cache data
refetchOnWindowFocus: true,
refetchOnMount: true,
refetchOnReconnect: true
```

### 🔄 **State Management**
- **Server State**: React Query quản lý API data
- **Local State**: UI interactions (search, pagination, form state)
- **Form State**: React Hook Form cho validation

### 📊 **Data Flow**
1. **API Call** → `usePromotions()` hook
2. **Data Conversion** → API format → UI format
3. **Filtering** → Search và pagination
4. **Rendering** → Display với proper formatting

## Performance Characteristics

### ⚡ **Admin-Optimized**
- **No Cache**: Đảm bảo data luôn fresh
- **High Frequency Refetch**: Refetch khi cần thiết
- **Memory Efficient**: Không lưu cache data

### 🔄 **Real-time Updates**
- Window focus → Refetch
- Component mount → Refetch
- Network reconnect → Refetch
- Manual refresh → Refetch

## Limitations & TODOs

### 🚧 **Chưa implement**
- **Update API**: Chưa có API để cập nhật promotion
- **Delete API**: Chưa có API để xóa promotion
- **Search API**: Đang dùng client-side search

### 🔧 **Future Enhancements**
- Implement update/delete APIs
- Add bulk operations
- Add promotion usage tracking
- Add expiration date warnings
- Add promotion analytics

## Lưu ý quan trọng

### 🚨 **API Requirements**
- Backend phải hỗ trợ `GET /api/promotions/all`
- Backend phải hỗ trợ `POST /api/promotions/create`
- API phải trả về đúng format như documentation

### ⚡ **Performance Considerations**
- `getAll()` có thể chậm với nhiều promotions
- Consider implement search API nếu cần
- Monitor API response times

### 🔧 **Development Notes**
- Update/Delete functionality được comment với TODO
- Error handling đã được implement
- Loading states đã được implement
- Form validation đã được implement
