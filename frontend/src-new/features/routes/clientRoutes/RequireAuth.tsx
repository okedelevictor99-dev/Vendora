import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "@/context/authContext";
import FullScreenLoader from "@/components/ui/fullScreenLoader";

export const RequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuthContext();
  const location = useLocation();

   if (isLoading) {
  return <FullScreenLoader text="Refreshing..." />;
}

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};