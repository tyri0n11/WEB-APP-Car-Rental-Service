import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ROUTES } from "./constants/ROUTES";

export const ProtectedRoute = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to={ROUTES.PUBLIC.HOME} replace />;
  }

  return <Outlet />;
};
