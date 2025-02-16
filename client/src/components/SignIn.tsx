import React, { useState } from "react";
import "./SignIn.css";
import { supabase } from "../utils/supabaseClient";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State cho lỗi đăng nhập

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); // Reset lỗi trước khi gửi request

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setErrorMessage(error.message); // Lưu lỗi để hiển thị popup
      return;
    }

    if (data.user) {
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="signin-container">
      <form className="signin-form" onSubmit={handleSubmit}>
        <div className="signin-header">
          <h2>Sign In</h2>
        </div>
        {errorMessage && (
          <div className="error-popup">
            <div className="error-content">
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="button-group">
          <button type="submit" className="signin-button">
            Sign In
          </button>
          <button
            type="button"
            className="signup-button"
            onClick={() => (window.location.href = "/signup")}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
