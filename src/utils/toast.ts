import toast from 'react-hot-toast';

// Toast utility functions
export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#10b981',
        color: '#fff',
        border: '1px solid #059669',
      },
    });
  },

  error: (message: string) => {
    toast.error(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#ef4444',
        color: '#fff',
        border: '1px solid #dc2626',
      },
    });
  },

  loading: (message: string) => {
    return toast.loading(message, {
      position: 'top-right',
      style: {
        background: '#3b82f6',
        color: '#fff',
        border: '1px solid #2563eb',
      },
    });
  },

  dismiss: (toastId: string) => {
    toast.dismiss(toastId);
  },

  // Handle API errors
  handleApiError: (error: any) => {
    const errorMessage = error?.response?.data?.message || 
                        error?.message || 
                        'An error occurred. Please try again.';
    
    showToast.error(errorMessage);
  },

  // Handle API success
  handleApiSuccess: (message: string) => {
    showToast.success(message);
  },
};

export default showToast;
