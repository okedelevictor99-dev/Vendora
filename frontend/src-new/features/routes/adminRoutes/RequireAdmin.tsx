import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAdminAuthContext } from "@/context/adminAuthContext";
import FullScreenLoader from "@/components/ui/fullScreenLoader";

export const RequireAdmin = () => {
  const { isAuthenticated, isLoading } = useAdminAuthContext();
  const location = useLocation();

  if (isLoading) {
  return <FullScreenLoader text="Refreshing..." />;
}


  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};