import apiClient from './index';

// Interface cho Upload Request
export interface UploadRequest {
  file: File;
  category: 'images' | 'documents' | 'videos' | 'other';
}

// Interface cho Upload Response
export interface UploadResponse {
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

// Interface cho File Info
export interface FileInfo {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  category: string;
  url: string;
  uploadedAt: string;
}

// Upload Service
export const uploadService = {
  // Upload file với FormData
  uploadFile: async (uploadData: UploadRequest): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', uploadData.file);
    formData.append('category', uploadData.category);

    return apiClient.post('/api/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Upload multiple files
  uploadMultipleFiles: async (files: File[], category: UploadRequest['category']): Promise<UploadResponse[]> => {
    const uploadPromises = files.map(file => 
      uploadService.uploadFile({ file, category })
    );
    
    return Promise.all(uploadPromises);
  },

  // Get file info by ID
  getFileInfo: async (fileId: string): Promise<FileInfo> => {
    return apiClient.get(`/api/files/${fileId}`);
  },

  // Delete file by ID
  deleteFile: async (fileId: string): Promise<void> => {
    return apiClient.delete(`/api/files/${fileId}`);
  },

  // Get files by category
  getFilesByCategory: async (category: UploadRequest['category']): Promise<FileInfo[]> => {
    return apiClient.get(`/api/files/category/${category}`);
  },

  // Get all files
  getAllFiles: async (): Promise<FileInfo[]> => {
    return apiClient.get('/api/files/all');
  },
};

export default uploadService;
