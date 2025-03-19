import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
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
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    if (password !== repassword) {
      setMessage("Passwords do not match");
      return;
    }
  };

  return (
    <div className="modal">
      <div className="signup-wrapper">
        <FaTimes className="close-btn" onClick={onClose} />
        <div className="form-box signup">
          <form onSubmit={handleSubmit}>
            <h1>Sign Up</h1>
            {message && <p className="message">{message}</p>}
            <div className="name-box">
              <div className="input-box">
                <label>First Name</label>
                <input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
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

            <div className="input-box">
              <label>Retype password</label>
              <input
                type="password"
                placeholder="Retype your password"
                value={repassword}
                onChange={(e) => setRepassword(e.target.value)}
                required
              />
            </div>

            <div className="remember-forgot">
              <label>
                <input type="checkbox" /> I agree to the terms and policies
              </label>
            </div>

            <button type="submit">Sign Up</button>

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
  );
};

export default SignUp;
