import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AUTH_NOTIFICATIONS } from "../../../../constants/notificationMessages";
import { useNotificationWithState } from "../../../../contexts/NotificationContext";
import { useAuth } from "../../../../hooks/useAuth";
import Notification from "../../../common/Notification";

import "../AuthStyles.css";

// Helper to prettify backend error messages for user display
function prettifyErrorMessage(msg: string): string {
  if (!msg) return ''
  return msg
    .replace(/phoneNumber/gi, 'Phone number')
    .replace(/firstName/gi, 'First name')
    .replace(/lastName/gi, 'Last name')
    .replace(/repassword/gi, 'Retyped password')
    .replace(/password/gi, 'Password')
    .replace(/email/gi, 'Email')
    .replace(/is required/gi, 'is required')
    .replace(/is not valid/gi, 'is not valid')
    .replace(/must be at least/gi, 'must be at least')
    .replace(/must contain at least/gi, 'must contain at least')
    .replace(/invalid credentials/gi, 'Invalid email or password')
}

const SignIn: React.FC<{
  onClose: () => void;
  onSwitchToSignUp: () => void;
}> = ({ onClose, onSwitchToSignUp }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoading, handleAsync } = useNotificationWithState();
  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({
    show: false,
    type: 'success',
    message: '',
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({
      show: true,
      type,
      message,
    });
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!email.includes('@')) newErrors.email = 'Please enter a valid email address';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await handleAsync(
        async () => login({ email, password }),
        {
          loading: AUTH_NOTIFICATIONS.signIn.loading,
          success: AUTH_NOTIFICATIONS.signIn.success,
          error: AUTH_NOTIFICATIONS.signIn.error,
        }
      );

      showNotification('success', 'Successfully signed in!');
      setEmail('');
      setPassword('');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error: any) {
      const backendMsg = error?.response?.data?.message || error?.message;
      showNotification('error', backendMsg ? prettifyErrorMessage(backendMsg) : 'Failed to sign in. Please check your credentials.');
    }
  };

  return (
    <>
      <Notification
        show={notification.show}
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification(prev => ({ ...prev, show: false }))}
      />

      <div className="modal">
        <div className="signin-wrapper">
          <FaTimes className="close-btn" onClick={onClose} />

          <div className="form-box signin">
            <form onSubmit={handleSubmit} noValidate>
              <h1>Sign In</h1>

              <div className="input-box">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
                {errors.email && <div style={{ color: 'red', fontSize: 12, marginTop: 2 }}>{errors.email}</div>}
              </div>

              <div className="input-box">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                {errors.password && <div style={{ color: 'red', fontSize: 12, marginTop: 2 }}>{errors.password}</div>}
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
    </>
  );
};

export default SignIn;
