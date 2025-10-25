# Upload Service Documentation

## Tổng quan
Upload Service cung cấp các chức năng upload file lên server với API endpoint `/api/files/upload`.

## API Endpoint
```
POST http://localhost:3333/api/files/upload
```

### Headers
- `Authorization: Bearer <token>` (required)
- `Content-Type: multipart/form-data` (auto-set)

### Form Data
- `file`: File object (required)
- `category`: String - "images" | "documents" | "videos" | "other" (required)

## Cách sử dụng

### 1. Import Service
```typescript
import { uploadService } from '../services/uploadService';
```

### 2. Upload Single File
```typescript
const uploadSingleFile = async (file: File) => {
  try {
    const result = await uploadService.uploadFile({
      file: file,
      category: 'images'
    });
    
    console.log('Upload thành công:', result.data);
    return result.data;
  } catch (error) {
    console.error('Upload thất bại:', error);
    throw error;
  }
};
```

### 3. Upload Multiple Files
```typescript
const uploadMultipleFiles = async (files: File[]) => {
  try {
    const results = await uploadService.uploadMultipleFiles(files, 'images');
    console.log('Upload thành công:', results);
    return results;
  } catch (error) {
    console.error('Upload thất bại:', error);
    throw error;
  }
};
```

### 4. Sử dụng React Hooks
```typescript
import { useUploadFile, useAllFiles, useDeleteFile } from '../hooks/useUpload';

function MyComponent() {
  const uploadMutation = useUploadFile();
  const { data: files } = useAllFiles();
  const deleteMutation = useDeleteFile();

  const handleUpload = async (file: File) => {
    await uploadMutation.mutateAsync({
      file,
      category: 'images'
    });
  };

  const handleDelete = async (fileId: string) => {
    await deleteMutation.mutateAsync(fileId);
  };

  return (
    // Your component JSX
  );
}
```

### 5. Sử dụng Upload Component
```typescript
import UploadComponent from '../components/common/UploadComponent';

function MyPage() {
  const handleUploadSuccess = (fileInfo) => {
    console.log('File uploaded:', fileInfo);
  };

  const handleUploadError = (error) => {
    console.error('Upload error:', error);
  };

  return (
    <UploadComponent
      category="images"
      onUploadSuccess={handleUploadSuccess}
      onUploadError={handleUploadError}
      maxFileSize={10} // 10MB
      acceptedTypes="image/*"
      multiple={true}
    />
  );
}
```

## API Methods

### uploadService.uploadFile(uploadData)
Upload một file duy nhất.

**Parameters:**
- `uploadData.file`: File object
- `uploadData.category`: 'images' | 'documents' | 'videos' | 'other'

**Returns:** Promise<UploadResponse>

### uploadService.uploadMultipleFiles(files, category)
Upload nhiều files cùng lúc.

**Parameters:**
- `files`: File[]
- `category`: 'images' | 'documents' | 'videos' | 'other'

**Returns:** Promise<UploadResponse[]>

### uploadService.getFileInfo(fileId)
Lấy thông tin chi tiết của một file.

**Parameters:**
- `fileId`: string

**Returns:** Promise<FileInfo>

### uploadService.deleteFile(fileId)
Xóa một file.

**Parameters:**
- `fileId`: string

**Returns:** Promise<void>

### uploadService.getFilesByCategory(category)
Lấy danh sách files theo category.

**Parameters:**
- `category`: 'images' | 'documents' | 'videos' | 'other'

**Returns:** Promise<FileInfo[]>

### uploadService.getAllFiles()
Lấy tất cả files.

**Returns:** Promise<FileInfo[]>

## Types

### UploadRequest
```typescript
interface UploadRequest {
  file: File;
  category: 'images' | 'documents' | 'videos' | 'other';
}
```

### UploadResponse
```typescript
interface UploadResponse {
  success: boolean;
  data: {
    id: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    category: string;
    url: string;
    uploadedAt: string;
  };
  message?: string;
}
```

### FileInfo
```typescript
interface FileInfo {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  category: string;
  url: string;
  uploadedAt: string;
}
```

## React Hooks

### useUploadFile()
Hook để upload single file với React Query.

### useUploadMultipleFiles()
Hook để upload multiple files với React Query.

### useFileInfo(fileId)
Hook để lấy thông tin file theo ID.

### useFilesByCategory(category)
Hook để lấy files theo category.

### useAllFiles()
Hook để lấy tất cả files.

### useDeleteFile()
Hook để xóa file.

### useUploadState()
Hook để quản lý state của upload process.

## Upload Component Props

### UploadComponent
```typescript
interface UploadComponentProps {
  category?: 'images' | 'documents' | 'videos' | 'other';
  onUploadSuccess?: (fileInfo: FileInfo) => void;
  onUploadError?: (error: string) => void;
  maxFileSize?: number; // in MB
  acceptedTypes?: string; // e.g., "image/*,.pdf,.doc"
  multiple?: boolean;
}
```

## Demo Page
Truy cập `/upload-demo` để xem demo đầy đủ các tính năng upload.

## Lưu ý
- File size tối đa: 10MB (có thể config)
- Supported categories: images, documents, videos, other
- Cần có token authentication
- Sử dụng FormData để upload
- Tự động retry khi có lỗi network
