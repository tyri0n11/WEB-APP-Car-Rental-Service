import "./App.css";
import NavBar from "./components/layout/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/pages/home/Home"; //
import Banner from "./components/layout/Banner";

function App() {
  return (
    <BrowserRouter>
      <div className="wrapper">
        <section className="header">
          <Banner />
          <NavBar />
        </section>

        <section className="content">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </section>
      </div>
    </BrowserRouter>
  );
}

export default App;
