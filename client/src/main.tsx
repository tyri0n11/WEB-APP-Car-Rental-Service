import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { CarProvider } from "./contexts/CarContext.tsx";
import { UserProvider } from "./contexts/UserContext.tsx";
import { BookingProvider } from "./contexts/BookingContext.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  //<StrictMode>
    <AuthProvider>
      <UserProvider>
        <CarProvider>
          <BookingProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </BookingProvider>
        </CarProvider>
      </UserProvider>
    </AuthProvider>
  //</StrictMode>
);
