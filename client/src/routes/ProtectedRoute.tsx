import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../src/hooks/useAuth"; // Đảm bảo bạn có AuthContext.tsx

const PrivateRoute = () => {
    const { user } = useAuth(); 

    return user ? <Outlet /> : <Navigate to="/" />; 
};

export default PrivateRoute;
