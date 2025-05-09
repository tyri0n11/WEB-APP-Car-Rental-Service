import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Banner from "./components/layout/Banner";
import Footer from "./components/layout/Footer";
import NavBar from "./components/layout/Navbar";
import SignIn from "./components/pages/auth/signin/SignIn";
import SignUp from "./components/pages/auth/signup/SignUp";
import { ProtectedRoutes } from "./routes/ProtectedRoutes";

import "./App.css";
import NotFound from "./components/pages/NotFound";
import { NotificationProvider } from './contexts/NotificationContext';
import { AuthRoutes } from "./routes/AuthRoutes";
import { PublicRoutes } from "./routes/PublicRoutes";

function App() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    if (showSignIn || showSignUp) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [showSignIn, showSignUp]);

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 50) {
        navbar?.classList.add('scrolled');
      } else {
        navbar?.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <NotificationProvider>
      <div className="App">
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

        <section className="main-content">
        <Routes>
            {/* Public Routes */}
            <Route path="/*" element={<PublicRoutes />} />
            
            {/* Auth Routes */}
            <Route path="/auth/*" element={<AuthRoutes />} />
            
            {/* Protected Routes */}
            <Route path="/protected/*" element={<ProtectedRoutes />} />
            
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

        <Footer />
      </div>
    </NotificationProvider>
  );
}

export default App;
