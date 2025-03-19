import React, { useState } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import '../auth_styles.css';

const SignIn: React.FC<{ onClose: () => void; onSwitchToSignUp: () => void }> = ({ onClose, onSwitchToSignUp }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();        
    setErrorMessage("");
  };

  return (
    <div className="modal">
      <div className="wrapper">
        <FaTimes className="close-btn" onClick={onClose} />

        <div className="form-box signin">
          <form onSubmit={handleSubmit}>
            <h1>Sign In</h1>
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <div className="input-box">
              <label>Email</label>
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <FaEnvelope className="icon" />
            </div>

            <div className="input-box">
              <label>Password</label>
              <input 
                type="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <FaLock className="icon" />
            </div>

            <div className="remember-forgot">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <a href="#">Forgot password?</a>
            </div>

            <button type="submit">Sign In</button>

            <div className="register-link">
              <p>
              Don't have an account?{" "}
            <span className="link" onClick={onSwitchToSignUp} role="button" tabIndex={0}>
              Sign Up
            </span>
          </p>
            </div>
          </form>
        </div>
      </div >
    </div >
  );
};

export default SignIn;
