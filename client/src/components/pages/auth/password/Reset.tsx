import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const Reset: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Extract token from the query parameter
    const token = searchParams.get("token");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        if (!newPassword || !token) {
            setError("Password and token are required");
            setLoading(false);
            return;
        }

        try {
            // Read host and path from environment variables
            const API_HOST = import.meta.env.HOST || "http://localhost:3000";
            const RP_PATH = import.meta.env.RP_PATH || "/auth/reset-password";
            const API_URL = `${API_HOST}${RP_PATH}`;

            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to reset password.");
            }

            setMessage("Password reset successfully!");
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            setError("No token found in the URL.");
        }
    }, [token]);

    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", width: "100%" }}>
            <div style={{ width: "500px", padding: "40px", background: "white", borderRadius: "10px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", textAlign: "center" }}>
                <h1 style={{ fontSize: "22px", color: "#333", marginBottom: "15px" }}>Reset Password</h1>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {message && <p style={{ color: "green" }}>{message}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter your new password"
                        style={{
                            width: "100%",
                            padding: "12px",
                            border: "1px solid #ddd",
                            borderRadius: "6px",
                            fontSize: "16px",
                            marginBottom: "15px",
                        }}
                        required
                    />
                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            padding: "12px",
                            background: loading ? "#aaa" : "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "16px",
                            cursor: loading ? "not-allowed" : "pointer",
                            transition: "background-color 0.3s ease",
                        }}
                        disabled={loading}
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Reset;
