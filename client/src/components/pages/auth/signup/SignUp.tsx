import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../hooks/useAuth";

import "../auth_styles.css";

const SignUp: React.FC<{ onClose: () => void; onSwitchToSignIn: () => void }> = ({ onClose, onSwitchToSignIn }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const { signup } = useAuth();

  const checkValid = () => {
    if (email.length < 5 || !email.includes("@") || !email.includes(".") || email.length > 89) {
      setMessage("Invalid email format");
      return false;
    }

    if (password !== repassword) {
      setMessage("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    if (!checkValid()) {
      console.log("Invalid input");
      return;
    }

    const data = {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
    };

    try {
      const response = await signup(data);
      console.log("Signup response:", response);
      onClose();
    } catch (error) {
      console.error(error);
      setMessage((error as any).response.data.message);
    }
  };

  useEffect(() => {
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose, email, password, repassword]);

  return (
    <div className="modal">
      <div className="wrapper">
        <span className="close-btn" onClick={onClose}>&times;</span>
        <div className="form-box signup">
          <form onSubmit={handleSubmit}>
            <h1>Sign Up</h1>
            {message && <p className="message">{message}</p>}

            <div className="name-box">
              <div className="input-box">
                <label>First Name:</label>
                <input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div className="input-box">
                <label>Last Name:</label>
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
              <label>Email:</label>
              <input
                type="email"
                placeholder="example@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={89}
              />
            </div>

            <div className="input-box">
              <label>Password:</label>
              <input
                type="password"
                placeholder="Enter password here"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="input-box">
              <label>Re-type Password:</label>
              <input
                type="password"
                placeholder="Re-type your password"
                value={repassword}
                onChange={(e) => setRepassword(e.target.value)}
                required
              />
            </div>

            <div className="input-box">
              <label>Phone:</label>
              <input
                type="text"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>

            <div className="remember-forgot">
              <label>
                <input type="checkbox" /> I agree to the terms and policies
              </label>
            </div>

            <div className="button-box">
              <button type="submit">Register</button>
            </div>

            <div className="login-link">
              <p>
                Already have an account?{" "}
                <span className="link" onClick={onSwitchToSignIn} role="button" tabIndex={0}>
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