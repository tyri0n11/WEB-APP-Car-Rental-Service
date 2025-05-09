import { Route, Routes } from 'react-router-dom';
import AdminBookings from '../components/pages/admin/AdminBookings';
import AdminCars from '../components/pages/admin/AdminCars';
import AdminRevenue from '../components/pages/admin/AdminRevenue';
import Dashboard from '../components/pages/admin/Dashboard';
import { AdminRoute } from './AdminRoute';

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminRoute />}>
        <Route index element={<Dashboard />} />
        <Route path="cars" element={<AdminCars />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="revenue" element={<AdminRevenue />} />
      </Route>
    </Routes>
  );
}; 