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
  const [isAgreed, setIsAgreed] = useState(false);
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    password?: string;
    repassword?: string;
    agree?: string;
  }>({});

  const { signup } = useAuth();

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({
      show: true,
      type,
      message,
    });
  };

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
  }

  const validateForm = () => {
    const newErrors: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phoneNumber?: string;
      password?: string;
      repassword?: string;
      agree?: string;
    } = {};
    if (!firstName) newErrors.firstName = 'First name is required';
    if (!lastName) newErrors.lastName = 'Last name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!email.includes('@')) newErrors.email = 'Please enter a valid email address';
    if (!phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    else if (!/^\d{10}$/.test(phoneNumber)) newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    else if (!/[A-Z]/.test(password)) newErrors.password = 'Password must contain at least one uppercase letter';
    else if (!/[a-z]/.test(password)) newErrors.password = 'Password must contain at least one lowercase letter';
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) newErrors.password = 'Password must contain at least one special character';
    if (!repassword) newErrors.repassword = 'Please retype your password';
    else if (password !== repassword) newErrors.repassword = 'Passwords do not match';
    if (!isAgreed) newErrors.agree = 'You must agree to the terms and policies';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    let signupSuccess = false;
    try {
      await signup({
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
      });
      signupSuccess = true;
      showNotification('success', 'Account created!');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhoneNumber('');
      setPassword('');
      setRepassword('');
    } catch (error: any) {
      const backendMsg = error?.response?.data?.message || error?.message;
      showNotification('error', backendMsg ? prettifyErrorMessage(backendMsg) : 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
      if (signupSuccess) {
        setTimeout(() => {
          onClose();
        }, 1000);
      }
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
            <form onSubmit={handleSubmit} noValidate>
              <h1>Sign Up</h1>
              <div className="name-box">
                <div className="input-box">
                  <label>First Name</label>
                  <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isLoading}
                    className={errors.firstName ? "input-error" : ""}
                  />
                  {errors.firstName && <div style={{ color: 'red', fontSize: 12, marginTop: 2 }}>{errors.firstName}</div>}
                </div>

                <div className="input-box">
                  <label>Last Name</label>
                  <input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isLoading}
                    className={errors.lastName ? "input-error" : ""}
                  />
                  {errors.lastName && <div style={{ color: 'red', fontSize: 12, marginTop: 2 }}>{errors.lastName}</div>}
                </div>
              </div>

              <div className="input-box">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className={errors.email ? "input-error" : ""}
                />
                {errors.email && <div style={{ color: 'red', fontSize: 12, marginTop: 2 }}>{errors.email}</div>}
              </div>

              <div className="input-box">
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={isLoading}
                  className={errors.phoneNumber ? "input-error" : ""}
                />
                {errors.phoneNumber && <div style={{ color: 'red', fontSize: 12, marginTop: 2 }}>{errors.phoneNumber}</div>}
              </div>

              <div className="input-box">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className={errors.password ? "input-error" : ""}
                />
                {errors.password && <div style={{ color: 'red', fontSize: 12, marginTop: 2 }}>{errors.password}</div>}
              </div>

              <div className="input-box">
                <label>Retype password</label>
                <input
                  type="password"
                  placeholder="Retype your password"
                  value={repassword}
                  onChange={(e) => setRepassword(e.target.value)}
                  disabled={isLoading}
                  className={errors.repassword ? "input-error" : ""}
                />
                {errors.repassword && <div style={{ color: 'red', fontSize: 12, marginTop: 2 }}>{errors.repassword}</div>}
              </div>

              <div className="remember-forgot" style={{ flexDirection: 'column', gap: '4px' }}>
                <label style={{ marginBottom: '2px' }}>
                  <input
                    type="checkbox"
                    checked={isAgreed}
                    onChange={e => setIsAgreed(e.target.checked)}
                    disabled={isLoading}
                  />
                  I agree to the terms and policies
                </label>
                {errors.agree && (
                  <div style={{
                    color: 'red',
                    fontSize: 12,
                    display: 'block',
                    marginTop: 0
                  }}>
                    {errors.agree}
                  </div>
                )}
              </div>

              <div className="button-box">
                <button type="submit" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Sign Up'}
                </button>
              </div>

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
