import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Banner from "./components/layout/Banner";
import Footer from "./components/layout/Footer";
import NavBar from "./components/layout/Navbar";
import Home from "./components/pages/home/Home";

function App() {
  return (
    <BrowserRouter>
      <div
        className="flex flex-col min-h-screen gap-0 p-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/assets/background.png')" }}
      >
        <section>
          <nav>
            <Banner />
            <NavBar />
          </nav>
        </section>

        <section >
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </section>
        <section>
          <Footer />
        </section>


      </div>
    </BrowserRouter>
  );
}

export default App;