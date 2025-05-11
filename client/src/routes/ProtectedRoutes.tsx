import { Route, Routes } from 'react-router-dom';
import Profile from '../components/pages/profile/Profile';
import { ROUTES } from './constants/ROUTES';
import { ProtectedRoute } from './ProtectedRoute';
export const ProtectedRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute/>}>
        <Route path={ROUTES.PROTECTED.PROFILE} element={<Profile />} />
      </Route>
    </Routes>
  );
};