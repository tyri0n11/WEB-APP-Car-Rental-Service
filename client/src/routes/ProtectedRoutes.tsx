import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Profile from '../components/pages/profile/Profile';
import Account from '../components/pages/profile/sections/account/Account';
import Membership from '../components/pages/profile/sections/membership/Membership';
import Rewards from '../components/pages/profile/sections/membership/Rewards';
import PointsHistory from '../components/pages/profile/sections/membership/PointsHistory';
import Favorites from '../components/pages/profile/sections/favourites/Favourites';
import MyRides from '../components/pages/profile/sections/rides/Rides';
import ChangePassword from '../components/pages/profile/sections/change-password/ChangePassword';
import { ROUTES } from './constants/ROUTES';
import BookingConfirmation from '../components/pages/booking/BookingConfirmation';
import Payment from '../components/pages/booking/Payment';
import CompletedBooking from '../components/pages/booking/CompletedBooking';
import { useUser } from '../contexts/UserContext';
import { Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { user } = useUser();
  const location = useLocation();
  const [isRestoringAuth, setIsRestoringAuth] = useState(false);

  useEffect(() => {
    // Only try to restore auth for completed-booking route
    if (!user && location.pathname.includes('/completed-booking')) {
      const pendingDataStr = sessionStorage.getItem("pendingBookingData");
      if (pendingDataStr) {
        try {
          const pendingData = JSON.parse(pendingDataStr);
          if (pendingData.accessToken && !localStorage.getItem('accessToken')) {
            console.log('ProtectedRoute: Restoring auth token');
            setIsRestoringAuth(true);
            localStorage.setItem('accessToken', pendingData.accessToken);
            // Don't remove pendingBookingData here, let CompletedBooking handle it
            window.location.reload();
            return;
          }
        } catch (error) {
          console.error('ProtectedRoute: Error parsing pendingBookingData:', error);
        }
      }
    }
  }, [user, location.pathname]);
    // Show a loading state while restoring auth
  if (isRestoringAuth) {
    return <div>Restoring your session...</div>;
  }

  // Only redirect if we're not on completed-booking page or if we've tried auth restoration
  if (!user && (!location.pathname.includes('/completed-booking') || !sessionStorage.getItem("pendingBookingData"))) {
    console.log('ProtectedRoute: Redirecting to home', {
      path: location.pathname,
      hasPendingData: !!sessionStorage.getItem("pendingBookingData")
    });
    return <Navigate to={ROUTES.PUBLIC.HOME} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export const ProtectedRoutes = () => {
  

  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/user/profile" replace />} />
        
        {/* Profile routes */}
        <Route path="profile" element={<Profile />}>
          <Route index element={<Account />} />
          <Route path="membership" element={<Membership />} />
          <Route path="membership/rewards" element={<Rewards />} />
          <Route path="membership/points-history" element={<PointsHistory />} />
          <Route path="rides" element={<MyRides />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="account" element={<Account />} />
          <Route path="password" element={<ChangePassword />} />
        </Route>

        {/* Booking routes */}
        <Route path="booking-confirmation" element={<BookingConfirmation />} />
        <Route path="payment" element={<Payment />} />
        <Route path="completed-booking/status/:status/bookingcode/:code" element={<CompletedBooking />} />

        {/* Catch all redirect to profile */}
        <Route path="*" element={<Navigate to="/user/profile" replace />} />
      </Route>
    </Routes>
  );
};