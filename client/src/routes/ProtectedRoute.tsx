import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>; 

  return user ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
