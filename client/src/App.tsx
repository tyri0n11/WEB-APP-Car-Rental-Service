import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import Banner from "./components/layout/Banner";
import Footer from "./components/layout/Footer";
import NavBar from "./components/layout/Navbar";
import Home from "./components/pages/home/Home";
import SignUp from "./components/pages/auth/signup/SignUp";
import SignIn from "./components/pages/auth/signin/SignIn";
import Contact from "./components/pages/home/sections/Contact";
import CarDetail from "./components/pages/home/sections/CarDetail";



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

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-cover bg-center">
        <nav>
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
        </nav>

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/car/:id" element={<CarDetail />} />
          </Routes>
        </main>

        <Footer />

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
      </div>
    </BrowserRouter>
  );
}

export default App;
