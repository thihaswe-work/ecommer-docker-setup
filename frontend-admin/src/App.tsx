import { Suspense, lazy } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import GlobalErrorHandler from "./components/GlobalErrorHandler";
import Loader from "./components/Loader";
import { PrivateRoute, PublicRoute } from "./components/RouteGuards";
import { SidebarProvider } from "./components/ui/sidebar";
import { useError } from "./context/errorContext";
import AuthLayout from "./layouts/AuthLayout";
import PublicLayout from "./layouts/PublicLayout";
import RegisterPage from "./pages/(auth)/register.tsx";
import ResetPasswordPage from "./pages/(auth)/reset-password";
import ProductDetailPage from "./pages/(routes)/products/productDetail.tsx";
import UserDetailPage from "./pages/(routes)/users/userDetail.tsx";
import SettingPage from "./pages/(routes)/settings/index.tsx";
import ProfilePage from "./pages/(routes)/profile/index.tsx";

// ✅ Lazy imports
const LoginPage = lazy(() => import("./pages/(auth)/login"));
const DashboardPage = lazy(() => import("./pages/(routes)/dashboard"));
const UsersPage = lazy(() => import("./pages/(routes)/users"));
const OrdersPage = lazy(() => import("./pages/(routes)/orders"));
const ProductsPage = lazy(() => import("./pages/(routes)/products"));
const OrderDetailPage = lazy(
  () => import("./pages/(routes)/orders/orderDetail")
);
const NotFound = lazy(() => import("./pages/(errors)/notfound"));

function App() {
  const { error } = useError();

  if (error) return <GlobalErrorHandler />;

  return (
    <Router>
      {/* Suspense fallback while lazy components load */}
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Public */}
          <Route element={<PublicRoute />}>
            <Route
              path="login"
              element={
                <PublicLayout>
                  <LoginPage />
                </PublicLayout>
              }
            />
            <Route
              path="register"
              element={
                <PublicLayout>
                  <RegisterPage />
                </PublicLayout>
              }
            />
            <Route
              path="reset-password"
              element={
                <PublicLayout>
                  <ResetPasswordPage />
                </PublicLayout>
              }
            />
          </Route>

          {/* Protected */}
          <Route element={<PrivateRoute />}>
            <Route
              element={
                <SidebarProvider>
                  <AuthLayout />
                </SidebarProvider>
              }
            >
              <Route path="" element={<DashboardPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/:id" element={<ProductDetailPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="users/:id" element={<UserDetailPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="orders/:id" element={<OrderDetailPage />} />
              <Route path="settings" element={<SettingPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
