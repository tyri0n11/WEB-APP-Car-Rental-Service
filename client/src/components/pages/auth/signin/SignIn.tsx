import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AUTH_NOTIFICATIONS } from "../../../../constants/notificationMessages";
import { useNotificationWithState } from "../../../../contexts/NotificationContext";
import { useAuth } from "../../../../hooks/useAuth";

import "../AuthStyles.css";

const SignIn: React.FC<{
  onClose: () => void;
  onSwitchToSignUp: () => void;
}> = ({ onClose, onSwitchToSignUp }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoading, handleAsync } = useNotificationWithState();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  

    const result = await handleAsync(
      async () => login(email, password),
      {
        
        loading: AUTH_NOTIFICATIONS.signIn.loading,
        success: AUTH_NOTIFICATIONS.signIn.success,
        error: AUTH_NOTIFICATIONS.signIn.error,
      }
    );

    if (!result) {
      console.error("Login failed");
    }
  };

  return (
    <div className="modal">
      <div className="signin-wrapper">
        <FaTimes className="close-btn" onClick={onClose} />

        <div className="form-box signin">
          <form onSubmit={handleSubmit}>
            <h1>Sign In</h1>

            <div className="input-box">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>

            <div className="remember-forgot">
              <label>
                <input type="checkbox" disabled={isLoading} /> Remember me
              </label>
              <Link to="/auth/forgot-password" onClick={onClose}>
                Forgot password?
              </Link>
            </div>

            <div className="button-box">
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
            <div className="register-link">
              <p>
                Don't have an account?{" "}
                <span
                  className="link"
                  onClick={onSwitchToSignUp}
                  role="button"
                  tabIndex={0}
                >
                  Sign Up
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
