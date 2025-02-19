import "./App.css";
import NavBar from "./components/layout/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Home from "./components/Home"; //
// import Banner from "./components/layout/Banner";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Profile from "./components/Profile";
function App() {
  return (
    <BrowserRouter>
      <div className="wrapper">
        <section>
          {/* <Banner /> */}
          <NavBar />
        </section>

        <section className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </section>
      </div>
    </BrowserRouter>
  );
}

export default App;
