import { Navigate, Outlet } from "react-router";

export function ProtectedRoute() {
  const isAuthenticated = !!localStorage.getItem("nexus_token");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
