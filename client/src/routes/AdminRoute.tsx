import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "./constants/ROUTES";

export const AdminRoute = () => {
  const { user } = useAuth();
  
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to={ROUTES.PUBLIC.HOME} replace />;
  }

  return <Outlet />;
}; 