# Category Management với Tree Structure

## Tổng quan
Đã tạo lại Category Management với **Tree Structure** (cấu trúc cây) để hỗ trợ danh mục cha-con, tích hợp React Query và API từ Postman collection.

## Cấu trúc Tree Structure

### 🌳 **Parent-Child Categories**
- **Danh mục gốc (Root)**: Cấp 0 - Ví dụ: "Rau củ quả", "Thực phẩm tươi sống"
- **Danh mục con (Child)**: Cấp 1+ - Ví dụ: "Chuối", "Xoài", "Bơ" trong "Rau củ quả"

### 📊 **Visual Hierarchy**
- **Indentation**: Child categories được thụt lề theo cấp độ
- **Expand/Collapse**: Click để mở rộng/thu gọn danh mục cha
- **Level Badges**: Hiển thị cấp độ với màu sắc khác nhau
- **Background**: Child categories có background khác để phân biệt

## Tính năng chính

### ✅ **Tree View Interface**
- Hiển thị cấu trúc cây với parent-child relationship
- Expand/collapse functionality
- Visual indentation cho child categories
- Level badges (Gốc, Cấp 1, Cấp 2...)

### ✅ **CRUD Operations**
- **Create Root**: Thêm danh mục gốc
- **Create Child**: Thêm danh mục con cho parent
- **Update**: Chỉnh sửa thông tin danh mục
- **Delete**: Xóa danh mục (có confirm popup)

### ✅ **Search & Filter**
- Tìm kiếm theo tên và mô tả
- Real-time search với API
- Hiển thị kết quả tìm kiếm

### ✅ **API Integration**
- Sử dụng React Query với **No Cache Policy**
- Tích hợp đầy đủ với Postman collection
- Error handling và loading states

## API Endpoints được sử dụng

### 📡 **Category APIs**
- `GET /api/categories/tree` - Lấy cây danh mục
- `GET /api/categories/roots` - Lấy danh mục gốc
- `GET /api/categories/{id}/children` - Lấy danh mục con
- `POST /api/categories/create` - Tạo danh mục mới
- `PUT /api/categories/update` - Cập nhật danh mục
- `DELETE /api/categories/{id}` - Xóa danh mục

### 🔄 **Request/Response Format**
```typescript
// Create Category Request
{
  name: string,
  description: string,
  parentId?: number // null cho root category
}

// Category Response
{
  id: number,
  name: string,
  description: string,
  parentId?: number,
  children?: Category[]
}
```

## Cấu trúc Files

### 📁 **Hooks**
- `src/hooks/useCategories.ts` - React Query hooks cho Category API

### 📁 **Components**
- `src/components/tables/CategoryManagement/CategoryTable.tsx` - Main table component
- `src/components/tables/CategoryManagement/CategoryFormPopup.tsx` - Form popup
- `src/components/tables/CategoryManagement/types.ts` - TypeScript interfaces

### 📁 **Services**
- `src/services/categoryService.ts` - API service functions

## UI/UX Features

### 🎨 **Visual Design**
- **Tree Lines**: Visual connectors cho parent-child
- **Expand Icons**: Chevron icons với animation
- **Level Badges**: Color-coded badges (Gốc = green, Child = blue)
- **Background Colors**: Different backgrounds cho child categories
- **Icons**: Category icons với first letter

### 🖱️ **Interactions**
- **Expand/Collapse**: Click chevron để toggle
- **Add Child**: Green plus icon cho parent categories
- **Edit**: Blue pencil icon
- **Delete**: Red trash icon với confirmation

### 📱 **Responsive Design**
- Mobile-friendly table layout
- Responsive search bar
- Touch-friendly buttons

## Cách sử dụng

### 1. **Thêm danh mục gốc**
- Click "Thêm danh mục gốc"
- Điền tên và mô tả
- Save để tạo

### 2. **Thêm danh mục con**
- Click icon "+" màu xanh trên danh mục cha
- Điền thông tin danh mục con
- Save để tạo

### 3. **Mở rộng/thu gọn**
- Click chevron icon để expand/collapse
- Child categories sẽ hiển thị/ẩn

### 4. **Tìm kiếm**
- Nhập từ khóa vào search box
- Kết quả sẽ được filter real-time

### 5. **Chỉnh sửa/Xóa**
- Click icon edit để chỉnh sửa
- Click icon delete để xóa (có confirm)

## Technical Implementation

### ⚡ **React Query Integration**
- **No Cache Policy**: staleTime: 0, gcTime: 0
- **Auto Refetch**: Khi window focus, mount, reconnect
- **Optimistic Updates**: Immediate UI updates
- **Error Handling**: Loading states và error recovery

### 🔄 **State Management**
- **Local State**: UI interactions (expand/collapse, form state)
- **Server State**: React Query quản lý API data
- **Form State**: React Hook Form cho form validation

### 🎯 **Performance Optimizations**
- **Memoization**: useMemo cho expensive calculations
- **Flattened Display**: Efficient rendering của tree structure
- **Conditional Rendering**: Chỉ render expanded children

## Data Flow

### 📊 **Tree Data Processing**
1. **API Response** → Category tree từ server
2. **Convert to UI Format** → Thêm UI state (isExpanded, level)
3. **Flatten for Display** → Convert tree thành flat array
4. **Filter & Search** → Apply search filters
5. **Render** → Display với proper indentation

### 🔄 **CRUD Flow**
1. **User Action** → Click button/form submit
2. **API Call** → React Query mutation
3. **Cache Invalidation** → Invalidate related queries
4. **Refetch** → Auto refetch fresh data
5. **UI Update** → Display updated data

## Lưu ý quan trọng

### 🚨 **API Requirements**
- Backend phải hỗ trợ parent-child relationship
- API phải trả về tree structure với children
- Cần hỗ trợ create với parentId

### ⚡ **Performance Considerations**
- Tree structure có thể phức tạp với nhiều levels
- Consider pagination cho large trees
- Monitor API call frequency

### 🔧 **Future Enhancements**
- Drag & drop để reorder categories
- Bulk operations (delete multiple)
- Category images/icons
- Advanced filtering options
- Export/Import functionality
