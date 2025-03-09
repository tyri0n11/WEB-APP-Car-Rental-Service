import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Banner from "./components/layout/Banner";
import Footer from "./components/layout/Footer";
import NavBar from "./components/layout/Navbar";
import SignIn from "./components/pages/auth/signin/SignIn";
import SignUp from "./components/pages/auth/signup/SignUp";
import Home from "./components/pages/home/Home";
import Contact from "./components/pages/home/sections/Contact";
import About from "./components/pages/about/About";


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

  useEffect(() => {
    if (showSignIn || showSignUp) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [showSignIn, showSignUp]);

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
          <Route path="/about" element={<About />} />
        </Routes>
      </section>

      <section>
        <Routes>
          <Route path="/" element={<Contact />} />
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
  );
};

export default App;