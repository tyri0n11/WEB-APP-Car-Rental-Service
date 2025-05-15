import { Navigate, Route, Routes } from 'react-router-dom';
import Profile from '../components/pages/profile/Profile';
import { ROUTES } from './constants/ROUTES';
import { ProtectedRoute } from './ProtectedRoute';
import BookingConfirmation from '../components/pages/booking/BookingConfirmation';
import Payment from '../components/pages/booking/Payment';
import { useUser } from '../contexts/UserContext';

export const ProtectedRoutes = () => {
  const { user } = useUser();
  if(!user) return <Navigate to={ROUTES.PUBLIC.HOME} />
  return (
    <Routes>
      <Route element={<ProtectedRoute/>}>
        <Route path={ROUTES.PROTECTED.PROFILE} element={<Profile />} />
        <Route path={ROUTES.PROTECTED.BOOKING_CONFIRMATION} element={<BookingConfirmation />} />
        <Route path={ROUTES.PROTECTED.PAYMENT} element={<Payment />} />
      </Route>
    </Routes>
  );
};