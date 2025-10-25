import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { uploadService, UploadRequest, FileInfo } from '../services/uploadService';

// Hook để upload file
export const useUploadFile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (uploadData: UploadRequest) => uploadService.uploadFile(uploadData),
    onSuccess: () => {
      // Invalidate và refetch files queries
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
};

// Hook để upload multiple files
export const useUploadMultipleFiles = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ files, category }: { files: File[]; category: UploadRequest['category'] }) => 
      uploadService.uploadMultipleFiles(files, category),
    onSuccess: () => {
      // Invalidate và refetch files queries
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
};

// Hook để lấy thông tin file
export const useFileInfo = (fileId: string) => {
  return useQuery({
    queryKey: ['file', fileId],
    queryFn: () => uploadService.getFileInfo(fileId),
    enabled: !!fileId,
  });
};

// Hook để lấy files theo category
export const useFilesByCategory = (category: UploadRequest['category']) => {
  return useQuery({
    queryKey: ['files', 'category', category],
    queryFn: () => uploadService.getFilesByCategory(category),
    enabled: !!category,
  });
};

// Hook để lấy tất cả files
export const useAllFiles = () => {
  return useQuery({
    queryKey: ['files', 'all'],
    queryFn: () => uploadService.getAllFiles(),
  });
};

// Hook để xóa file
export const useDeleteFile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (fileId: string) => uploadService.deleteFile(fileId),
    onSuccess: () => {
      // Invalidate và refetch files queries
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
};

// Hook để quản lý upload state
export const useUploadState = () => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const resetUploadState = () => {
    setUploadProgress(0);
    setIsUploading(false);
    setUploadedFiles([]);
    setUploadError(null);
  };

  return {
    uploadProgress,
    setUploadProgress,
    isUploading,
    setIsUploading,
    uploadedFiles,
    setUploadedFiles,
    uploadError,
    setUploadError,
    resetUploadState,
  };
};
