# User Management với React Query - Admin Version

## Tổng quan
Đã tích hợp React Query vào UserManagement với **No Cache Policy** để đảm bảo web admin luôn có data mới nhất.

## Cache Policy cho Web Admin

### ⚡ **No Cache Configuration**
```typescript
// QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // Luôn coi data là stale để fetch mới
      gcTime: 0, // Không cache data
      retry: 1,
      refetchOnWindowFocus: true, // Refetch khi focus lại window
      refetchOnMount: true, // Refetch khi component mount
      refetchOnReconnect: true, // Refetch khi reconnect
    },
  },
});
```

### 🔄 **Always Fresh Data**
- **staleTime: 0** - Luôn fetch data mới từ server
- **gcTime: 0** - Không lưu cache, giải phóng memory ngay lập tức
- **Auto Refetch** - Tự động refetch khi:
  - Window được focus lại
  - Component mount
  - Network reconnect

## Cấu trúc đã cập nhật

### 1. **App.tsx**
- QueryClient với **No Cache Policy**
- React Query Devtools để debug
- Auto refetch configuration

### 2. **src/hooks/useUsers.ts**
- Tất cả hooks đều có `staleTime: 0`
- `refetchOnWindowFocus: true`
- `refetchOnMount: true`

### 3. **EmployeeTable.tsx & CustomerTable.tsx**
- Luôn fetch data mới nhất từ API
- Real-time search với server-side filtering
- Loading states cho mỗi API call

## Tính năng chính

### ✅ **Real-time Data**
- Luôn có data mới nhất từ server
- Không có stale data issues
- Perfect cho admin dashboard

### ✅ **Search & Filter**
- Server-side search với API
- Real-time filtering
- Reset pagination khi search

### ✅ **Pagination**
- Server-side pagination
- Tùy chỉnh số items per page
- Navigation controls

### ✅ **CRUD Operations**
- **Create**: Thêm nhân viên/khách hàng
- **Read**: Luôn fetch data mới nhất
- **Update**: Cập nhật thông tin
- **Delete**: Xóa người dùng

## API Integration

### Endpoints được sử dụng:
- `POST /api/users/search` - Tìm kiếm với pagination
- `POST /api/users/create` - Tạo user mới
- `PUT /api/users/update` - Cập nhật user
- `DELETE /api/users/{id}` - Xóa user

### Request/Response Format:
```typescript
// Search Request
{
  page: number,
  size: number,
  sorts: any[],
  filters: Array<{
    field: string,
    operator: string,
    value: string
  }>
}

// Search Response
{
  content: User[],
  totalElements: number,
  totalPages: number,
  size: number,
  number: number
}
```

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

### 📊 **Trade-offs**
- **Pros**: Luôn có data mới nhất, perfect cho admin
- **Cons**: Nhiều API calls hơn, có thể chậm hơn
- **Best for**: Admin dashboards, real-time monitoring

## Cách sử dụng

### 1. **Search**
- Nhập tên vào search box
- API call ngay lập tức
- Kết quả được filter từ server

### 2. **Navigation**
- Chuyển tab → Refetch data
- Focus lại window → Refetch data
- Luôn có data mới nhất

### 3. **CRUD Operations**
- Mọi thao tác đều trigger refetch
- Data luôn được sync với server
- Không có stale data issues

## Development

### Debug
- React Query Devtools (F12)
- Check network tab cho API calls
- Monitor refetch frequency

### Monitoring
- Track API call frequency
- Monitor response times
- Check for unnecessary refetches

### Optimization
- Có thể adjust refetchOnWindowFocus nếu cần
- Có thể thêm staleTime nhỏ nếu performance issues
- Monitor memory usage

## Lưu ý quan trọng

### 🚨 **Admin Dashboard Only**
- Configuration này chỉ phù hợp cho admin dashboard
- Không nên dùng cho user-facing apps
- Có thể gây nhiều API calls không cần thiết

### ⚡ **Performance Impact**
- Nhiều API calls hơn bình thường
- Có thể ảnh hưởng đến server load
- Monitor và optimize nếu cần

### 🔧 **Customization**
- Có thể điều chỉnh refetchOnWindowFocus
- Có thể thêm staleTime nhỏ cho performance
- Balance giữa freshness và performance
