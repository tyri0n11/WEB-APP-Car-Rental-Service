import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { CarProvider } from "./contexts/CarContext.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <CarProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CarProvider>
    </AuthProvider>
  </StrictMode>
);
