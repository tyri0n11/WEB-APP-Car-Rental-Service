// routes/AuthRoutes.tsx
import { Route, Routes } from 'react-router-dom';
import ForgotPassword from '../components/pages/auth/forgot-password';
import ResetPassword from '../components/pages/auth/reset-password';
import { ROUTES } from './constants/ROUTES';

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path={ROUTES.AUTH.FORGOT_PASSWORD} element={<ForgotPassword />} />
      <Route path={ROUTES.AUTH.RESET_PASSWORD} element={<ResetPassword />} />
    </Routes>
  );
};
