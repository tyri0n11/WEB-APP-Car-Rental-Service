import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Banner from "./components/layout/Banner";
import Footer from "./components/layout/Footer";
import NavBar from "./components/layout/Navbar";
import SignIn from "./components/pages/auth/signin/SignIn";
import SignUp from "./components/pages/auth/signup/SignUp";
import { AdminRoutes } from "./routes/AdminRoutes";
import { AuthRoutes } from "./routes/AuthRoutes";
import { ProtectedRoutes } from "./routes/ProtectedRoutes";
import { PublicRoutes } from "./routes/PublicRoutes";
import { BookingProvider } from "./contexts/BookingContext";
import { NotificationProvider } from './contexts/NotificationContext';
import NotFound from "./components/pages/NotFound";
import { useUser } from "./contexts/UserContext";

function App() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const location = useLocation();
  const { user } = useUser();

  // Check if current route is admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (showSignIn || showSignUp) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [showSignIn, showSignUp]);

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector(".navbar");
      if (window.scrollY > 50) {
        navbar?.classList.add("scrolled");
      } else {
        navbar?.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Only show banner and footer if not on admin route
  const showBannerAndFooter = !(user?.role === 'ADMIN' && isAdminRoute);

  return (
    <NotificationProvider>
      <BookingProvider>
        <div className="App">
          {showBannerAndFooter && (
            <header className="navbar">
              <Banner />
              <NavBar
                onSignInClick={() => {
                  setShowSignIn(true);
                  setShowSignUp(false);
                }}
                onSignUpClick={() => {
                  setShowSignUp(true);
                  setShowSignIn(false);
                }}
              />
            </header>
          )}

          <section className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/*" element={<PublicRoutes />} />
              
              {/* Auth Routes */}
              <Route path="/auth/*" element={<AuthRoutes />} />
              
              <Route path="/user/*" element={<ProtectedRoutes />} />


              {/* Admin Routes */}
              <Route path="/admin/*" element={<AdminRoutes />} />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </section>
          {showSignIn && (
            <SignIn
              onClose={() => setShowSignIn(false)}
              onSwitchToSignUp={() => {
                setShowSignIn(false);
                setShowSignUp(true);
              }}
            />
          )}
          {showSignUp && (
            <SignUp
              onClose={() => setShowSignUp(false)}
              onSwitchToSignIn={() => {
                setShowSignUp(false);
                setShowSignIn(true);
              }}
            />
          )}
          {showBannerAndFooter && <Footer />}
        </div>
      </BookingProvider>
    </NotificationProvider>
  );
}

export default App;
