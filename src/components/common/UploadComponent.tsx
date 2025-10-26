import React, { useRef, useState } from 'react';
import { useUploadFile, useUploadState } from '../../hooks/useUpload';
import { showToast } from '../../utils/toast';

interface UploadComponentProps {
  category?: 'images' | 'documents' | 'videos' | 'other';
  onUploadSuccess?: (fileInfo: { id: string; filename: string; originalName: string; mimeType: string; size: number; category: string; url: string; uploadedAt: string }) => void;
  onUploadError?: (error: string) => void;
  maxFileSize?: number; // in MB
  acceptedTypes?: string; // e.g., "image/*,.pdf,.doc"
  showPreview?: boolean; // Hiển thị preview ảnh và URL
  existingImageUrl?: string; // URL ảnh hiện có (để edit)
}

export default function UploadComponent({
  category = 'images',
  onUploadSuccess,
  onUploadError,
  maxFileSize = 10, // 10MB default
  acceptedTypes = 'image/*',
  showPreview = true,
  existingImageUrl,
}: UploadComponentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string>(existingImageUrl || '');
  const [dragActive, setDragActive] = useState(false);
  
  const uploadMutation = useUploadFile();
  const { uploadProgress, isUploading, uploadError, resetUploadState } = useUploadState();

  // Cập nhật URL khi existingImageUrl thay đổi
  React.useEffect(() => {
    if (existingImageUrl) {
      setUploadedUrl(existingImageUrl);
    }
  }, [existingImageUrl]);

  // Handle file selection
  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0]; // Chỉ lấy file đầu tiên
    
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      showToast.error(`File ${file.name} quá lớn (tối đa ${maxFileSize}MB)`);
      return;
    }

    // Check file type
    if (acceptedTypes && !file.type.match(acceptedTypes.replace(/\*/g, '.*'))) {
      showToast.error(`File ${file.name} không được hỗ trợ`);
      return;
    }

    setSelectedFile(file);
    setUploadedUrl(''); // Reset URL khi chọn file mới
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  // Handle upload
  const handleUpload = async () => {
    if (!selectedFile) {
      showToast.error('Vui lòng chọn file để upload');
      return;
    }

    try {
      resetUploadState();
      
      const result = await uploadMutation.mutateAsync({
        file: selectedFile,
        category,
      });

      if (result.code === '00') {
        showToast.success(`Upload thành công: ${selectedFile.name}`);
        
        // Lấy URL từ response
        const fileUrl = result.data?.fileUrl;
        if (fileUrl) {
          setUploadedUrl(fileUrl);
        }
        
        // Gọi callback với thông tin file đã upload
        onUploadSuccess?.({
          id: result.data.fileName,
          filename: result.data.fileName,
          originalName: result.data.originalFileName,
          mimeType: result.data.contentType,
          size: result.data.fileSize,
          category: result.data.category,
          url: fileUrl,
          uploadedAt: new Date().toISOString(),
        });
      } else {
        throw new Error(result.message || 'Upload thất bại');
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi upload';
      showToast.error(errorMessage);
      onUploadError?.(errorMessage);
    }
  };

  // Handle remove file
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadedUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 dark:border-gray-600 hover:border-primary/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes}
          onChange={handleFileInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-2">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium text-primary hover:text-primary/80">
              Click để chọn file
            </span>
            {' '}hoặc kéo thả vào đây
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Tối đa {maxFileSize}MB per file
          </p>
        </div>
      </div>

      {/* Selected File */}
      {selectedFile && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            File đã chọn
          </h4>
          
          <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            
            <button
              onClick={handleRemoveFile}
              className="ml-2 text-red-500 hover:text-red-700 transition-colors"
              title="Xóa file"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Image Preview and URL */}
      {showPreview && uploadedUrl && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Preview và URL
          </h4>
          
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            {/* Image Preview */}
            <div className="mb-3">
              <img 
                src={uploadedUrl} 
                alt="Uploaded" 
                className="max-w-full h-auto max-h-48 rounded-lg border border-gray-200 dark:border-gray-600"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            
            {/* URL Display */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                URL:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={uploadedUrl}
                  readOnly
                  className="flex-1 px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white"
                />
                <div
                  onClick={() => {
                    navigator.clipboard.writeText(uploadedUrl);
                    showToast.success('Đã copy URL vào clipboard');
                  }}
                  className="px-2 py-1 text-xs bg-primary text-white rounded hover:bg-primary/90 transition-colors cursor-pointer"
                  title="Copy URL"
                >
                  Copy
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Button */}
      {selectedFile && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleUpload}
            disabled={isUploading || uploadMutation.isPending}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isUploading || uploadMutation.isPending ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Đang upload...</span>
              </div>
            ) : (
              'Upload file'
            )}
          </button>
          
          <button
            onClick={handleRemoveFile}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Hủy
          </button>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
            <span>Tiến độ upload</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {uploadError && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{uploadError}</p>
        </div>
      )}
    </div>
  );
}
