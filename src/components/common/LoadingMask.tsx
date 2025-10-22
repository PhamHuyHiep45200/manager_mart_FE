import React from 'react';

interface LoadingMaskProps {
  isLoading: boolean;
  children: React.ReactNode;
  message?: string;
}

const LoadingMask: React.FC<LoadingMaskProps> = ({ 
  isLoading, 
  children, 
  message = 'Loading...' 
}) => {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Main content */}
      <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
        {children}
      </div>
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm mx-4">
            {/* Spinner */}
            <div className="flex items-center justify-center mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
            </div>
            
            {/* Loading message */}
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {message}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingMask;
