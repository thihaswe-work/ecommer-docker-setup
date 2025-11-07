import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

// Protected
export const PrivateRoute = () => {
  const user = useAuthStore((state) => state.user);
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
};

// Public
export const PublicRoute = () => {
  const user = useAuthStore((state) => state.user);
  if (user) return <Navigate to="/" replace />;
  return <Outlet />;
};
