import "./App.css";
import NavBar from "./components/layout/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/pages/home/Home";
import Banner from "./components/layout/Banner";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen gap-0 p-0 bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/assets/background.png')" }}>
        <section className="sticky top-0">
          <nav className="navbar position-sticky">
            <Banner />
            <NavBar />
          </nav>
        </section>

        <section className="m-5 p-8 bg-white bg-opacity-90 shadow-md">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </section>
      </div>
    </BrowserRouter>
  );
}

export default App;
