import { BrowserRouter as Router, Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import UserPage from "./pages/UserPages/UserPage";
import CategoryPage from "./pages/Category/Category";
import SupplierPage from "./pages/Supplier/Supplier";
import PromotionPage from "./pages/Promotion/Promotion";
import ProductPage from "./pages/Product/Product";

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
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/user-manager" element={<UserPage />} />
            <Route path="/category-manager" element={<CategoryPage />} />
            <Route path="/supplier-manager" element={<SupplierPage />} />
            <Route path="/promotion-manager" element={<PromotionPage />} />
            <Route path="/product-manager" element={<ProductPage />} />
            {/* <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            <Route path="/form-elements" element={<FormElements />} />

            <Route path="/basic-tables" element={<BasicTables />} />

            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} /> */}
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
