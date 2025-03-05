import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import Banner from "./components/layout/Banner";
import Footer from "./components/layout/Footer";
import NavBar from "./components/layout/Navbar";
import Home from "./components/pages/home/Home";
import SignUp from "./components/pages/auth/signup/SignUp";
import SignIn from "./components/pages/auth/signin/SignIn";
import Contact from "./components/pages/home/sections/Contact";

function App() {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}

const MainLayout = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  return (
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

      <section>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </section>

      <section>
        <Routes>
          <Route path="/" element={<Contact />} />
        </Routes>
      </section>

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
  );
};

export default App;
