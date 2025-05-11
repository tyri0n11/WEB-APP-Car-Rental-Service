import { Navigate, Route, Routes } from 'react-router-dom';
import Profile from '../components/pages/profile/Profile';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from './constants/ROUTES';
import { ProtectedRoute } from './ProtectedRoute';

export const ProtectedRoutes = () => {
  const { user } = useAuth();
  if(!user) return <Navigate to={ROUTES.PUBLIC.HOME} />
  return (
    <Routes>
      <Route element={<ProtectedRoute/>}>
        <Route path={ROUTES.PROTECTED.PROFILE} element={<Profile />} />
      </Route>
    </Routes>
  );
};