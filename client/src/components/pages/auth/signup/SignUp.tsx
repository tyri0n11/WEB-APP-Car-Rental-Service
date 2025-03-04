import React, { useState } from "react";
import "./SignUp.css";

const SignUp: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Registration</h2>
        {message && <p className="message">{message}</p>}
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
        <div className="input-group">
          <label>Retype password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={repassword}
            onChange={(e) => setRepassword(e.target.value)}
            required
          />
        </div>
        <div className="button-group">
          <button
            type="submit"
            className="signup-button"
            onClick={() => handleSubmit}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
