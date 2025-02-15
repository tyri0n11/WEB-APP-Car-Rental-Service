import React, { useState } from "react";
import supabase from "../supabase";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

const SignUp: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      setMessage(error.message);
      setEmail('');
      setPassword('');
      setUsername('');
    } else {
      setMessage("You're signed in successfully.");
    }

    if (data) {
      setMessage("Created Account successfully.");
      navigate('/');
    }

    setEmail('')
    setPassword('')
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Registration</h2>
        <span>{message}</span>
        <div className="input-group">
          <label>Username</label>
          <input
            type="string"
            placeholder="Display name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
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
          <button
            type="button"
            className="signup-button"
            onClick={() => (window.location.href = "/signup")}
          >
            Sign Up with Your Email
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
