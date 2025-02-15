import "./App.css";
import NavBar from "./components/layout/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Home from "./components/Home"; //
import Banner from "./components/layout/Banner";
import Dashboard from "./components/Dashboard";


function App() {
  return (
    <BrowserRouter>
      <Banner />
      <NavBar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
