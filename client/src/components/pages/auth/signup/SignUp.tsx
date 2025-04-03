import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useAuth } from "../../../../hooks/useAuth";
import Notification from "../../../common/Notification";
import "../AuthStyles.css";

const SignUp: React.FC<{
  onClose: () => void;
  onSwitchToSignIn: () => void;
}> = ({ onClose, onSwitchToSignIn }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({
    show: false,
    type: 'success',
    message: '',
  });

  const { signup } = useAuth();

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({
      show: true,
      type,
      message,
    });
  };

  const validateForm = () => {
    if (!firstName || !lastName || !email || !phoneNumber || !password || !repassword) {
      showNotification('error', 'Please fill in all fields');
      return false;
    }

    if (!email.includes('@')) {
      showNotification('error', 'Please enter a valid email address');
      return false;
    }

    if (password.length < 6) {
      showNotification('error', 'Password must be at least 6 characters');
      return false;
    }

    if (password !== repassword) {
      showNotification('error', 'Passwords do not match');
      return false;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      showNotification('error', 'Please enter a valid 10-digit phone number');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await signup({
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
      });
      showNotification('success', 'Account created successfully!');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      showNotification('error', 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
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
        <div className="signup-wrapper">
          <FaTimes className="close-btn" onClick={onClose} />
          <div className="form-box signup">
            <form onSubmit={handleSubmit}>
              <h1>Sign Up</h1>
              <div className="name-box">
                <div className="input-box">
                  <label>First Name</label>
                  <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="input-box">
                  <label>Last Name</label>
                  <input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

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
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
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

              <div className="input-box">
                <label>Retype password</label>
                <input
                  type="password"
                  placeholder="Retype your password"
                  value={repassword}
                  onChange={(e) => setRepassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="remember-forgot">
                <label>
                  <input type="checkbox" disabled={isLoading} /> I agree to the terms and policies
                </label>
              </div>

              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </button>

              <div className="login-link">
                <p>
                  Already have an account?{" "}
                  <span
                    className="link"
                    onClick={onSwitchToSignIn}
                    role="button"
                    tabIndex={0}
                  >
                    Sign In
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

export default SignUp;
