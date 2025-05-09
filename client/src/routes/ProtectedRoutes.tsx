// routes/ProtectedRoutes.tsx
import { Route, Routes } from 'react-router-dom';
import Dashboard from '../components/pages/dashboard/Dashboard';
import Profile from '../components/pages/profile/Profile';
import { ROUTES } from './constants/ROUTES';
import { ProtectedRoute } from './ProtectedRoute';
export const ProtectedRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute/>}>
        <Route path={ROUTES.PROTECTED.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.PROTECTED.PROFILE} element={<Profile />} />
      </Route>
    </Routes>
  );
};