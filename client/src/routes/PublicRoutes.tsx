import { Route, Routes } from 'react-router-dom';
import About from '../components/pages/about/About';
import CarDetail from '../components/pages/car/carDetail';
import Contact from '../components/pages/contact/Contact';
import Home from '../components/pages/home/Home';
import Services from '../components/pages/service/Service';
import NotFound from '../components/pages/profile/sections/membership/NotFound';

export const PublicRoutes = () => {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="contact" element={<Contact />} />
      <Route path="services" element={<Services />} />
      <Route path="cars/:id" element={<CarDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

