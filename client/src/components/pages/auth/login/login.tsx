import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigateTo = useNavigate();

  const handleNavigation = (path: string) => {
    onClose();
    navigateTo(path);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    console.log("Login attempt:", { email, password });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.classList.add("no-scroll"); // Prevent scrolling
    } else {
      document.body.classList.remove("no-scroll"); // Allow scrolling
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("no-scroll"); // Cleanup
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="login-modal" onClick={onClose}>
      <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="login-close" onClick={onClose}>&times;</span>

        <h2 className="login-title">Login</h2>

        {errorMessage && <div className="login-error">{errorMessage}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="login-button-group">
            <button type="submit" className="login-button">Login</button>
            <button
              type="button"
              className="signup-button"
              onClick={() => handleNavigation("/Signup")}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;