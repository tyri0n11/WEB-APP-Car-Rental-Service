import React, { useState } from "react";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto mt-10 sm:w-96 md:w-80 lg:w-96 xl:w-1/3">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold text-gray-800">Sign In</h2>
        {errorMessage && (
          <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
        )}
        <div className="text-left">
          <label className="block font-bold text-gray-700 mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div className="text-left">
          <label className="block font-bold text-gray-700 mb-1">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            type="submit"
            className="w-full sm:w-1/2 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-700 transition"
          >
            Sign In
          </button>
          <button
            type="button"
            className="w-full sm:w-1/2 py-2 border border-blue-500 text-blue-500 font-semibold rounded hover:bg-blue-500 hover:text-white transition"
            onClick={() => (window.location.href = "/signup")}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
