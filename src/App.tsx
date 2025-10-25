import { BrowserRouter as Router, Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { showToast } from "./utils/toast";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import LoadingMask from "./components/common/LoadingMask";
import Home from "./pages/Dashboard/Home";
import UserPage from "./pages/UserPages/UserPage";
import CategoryPage from "./pages/Category/Category";
// import SupplierPage from "./pages/Supplier/Supplier";
import PromotionPage from "./pages/Promotion/Promotion";
import ProductPage from "./pages/Product/Product";
import Support from "./pages/Support";
import { useEffect } from "react";
import { useAuthStore } from "./stores/authStore";

// Tạo QueryClient instance cho web admin - luôn cần data mới nhất
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
    mutations: {
      onError: (error: Error) => {
        // Show error toast for mutations
        showToast.handleApiError(error);
      },
      onSuccess: () => {
        // Show success toast for mutations (optional)
        // You can customize this based on your needs
      },
    },
  },
});

// Component để initialize auth state
const AuthInitializer = () => {
  const { getMe, user } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      getMe();
    }
  }, [getMe, user]);

  return null;
};

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <LoadingMask isLoading={true} message="Checking authentication...">
        <div></div>
      </LoadingMask>
    );
  }

  if (!isAuthenticated) {
    window.location.href = '/signin';
    return null;
  }

  return <>{children}</>;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    window.location.href = '/';
    return null;
  }

  return <>{children}</>;
};

export default function App() {
  const { isLoading } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer />
      <LoadingMask isLoading={isLoading} message="Loading application...">
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Dashboard Layout - Protected Routes */}
            <Route element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route index path="/" element={<Home />} />
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/support" element={<Support />} />
              <Route path="/user-manager" element={<UserPage />} />
              <Route path="/category-manager" element={<CategoryPage />} />
              {/* <Route path="/supplier-manager" element={<SupplierPage />} /> */}
              <Route path="/promotion-manager" element={<PromotionPage />} />
              <Route path="/product-manager" element={<ProductPage />} />
            </Route>

            {/* Auth Layout - Public Routes */}
            <Route path="/signin" element={
              <PublicRoute>
                <SignIn />
              </PublicRoute>
            } />

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </LoadingMask>
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#10b981',
              color: '#fff',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#ef4444',
              color: '#fff',
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}
