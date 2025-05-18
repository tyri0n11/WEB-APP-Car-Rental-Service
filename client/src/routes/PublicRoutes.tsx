import { Route, Routes } from 'react-router-dom';
import About from '../components/pages/about/About';
import CarDetail from '../components/pages/car/carDetail';
import Contact from '../components/pages/contact/Contact';
import Home from '../components/pages/home/Home';
import Services from '../components/pages/service/Service';
import { ROUTES } from './constants/ROUTES';

export const PublicRoutes = () => {
  return (
    <Routes>
      <Route path={ROUTES.PUBLIC.HOME} element={<Home />} />
      <Route path={ROUTES.PUBLIC.ABOUT} element={<About />} />
      <Route path={ROUTES.PUBLIC.CONTACT} element={<Contact />} />
      <Route path={ROUTES.PUBLIC.SERVICES} element={<Services />} />
      <Route path={ROUTES.PUBLIC.CAR_DETAIL(':id')} element={<CarDetail />} />
    </Routes>
  );
};

