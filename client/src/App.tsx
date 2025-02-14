import "./App.css";
import NavBar from "./components/layout/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Home from "./components/Home"; //
import Banner from "./components/layout/Banner";
function App() {
  return (
    <Router>
      <Banner />
      <NavBar />
      <div className="content">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;
