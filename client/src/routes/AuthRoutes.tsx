// routes/AuthRoutes.tsx
import { Route, Routes } from 'react-router-dom';
import ForgotPassword from '../components/pages/auth/forgot-password';
import ResetPassword from '../components/pages/auth/reset-password';
import { ROUTES } from './constants/ROUTES';

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password" element={<ResetPassword />} />
    </Routes>
  );
};
