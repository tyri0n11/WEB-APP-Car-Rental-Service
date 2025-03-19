import React, { useState } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import '../auth_styles.css';

const SignIn: React.FC<{ onClose: () => void; onSwitchToSignUp: () => void }> = ({ onClose, onSwitchToSignUp }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { login } = useAuth();

  const checkValid = () => {
    if (email.length < 5 || !email.includes("@") || !email.includes(".") || email.length > 89) {
      setMessage("Invalid email format");
      return false;
    }
    return true
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (!checkValid()) {
      console.log("Invalid input");
      return;
    }
    try {
      await login(email, password);
      onClose();
    } catch (error) {
      console.error(error);
      setMessage((error as any).response.data.message);
    }
  };

  return (
    <div className="modal">
      <div className="wrapper">
        <span className="close-btn" onClick={onClose}>&times;</span>
        <div className="form-box">
          <form onSubmit={handleSubmit}>
            <h1>Sign In</h1>
            {message && <p className="message">{message}</p>}
            <div className="input-box">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
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
            </div>
            <div className="remember-forgot">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <a href="#">Forgot password?</a>
            </div>

            <div className="button-box">
              <button type="submit">Login</button>
            </div>

            <div className="login-link">
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
