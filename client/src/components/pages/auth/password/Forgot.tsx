import React, { useState } from "react";

const Forgot: React.FC = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [responseData, setResponseData] = useState(null);
    const [debugInfo, setDebugInfo] = useState<string | null>(null); // For debugging information

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);
        setResponseData(null);
        setDebugInfo(null);

        if (!email) {
            setError("Email is required");
            setLoading(false);
            return;
        }

        try {
            const API_URL = "http://localhost:3000/auth/email/forgot-password"; // Correct endpoint
            setDebugInfo(
                `API URL: ${API_URL}\nBody: ${JSON.stringify({ email }, null, 2)}`
            );

            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Something went wrong.");
            }

            setMessage("Password reset link sent successfully!");
            setResponseData(data); // Store the response
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to send request.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", width: "100%" }}>
            <div style={{ width: "500px", padding: "40px", background: "white", borderRadius: "10px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", textAlign: "center" }}>
                <h1 style={{ fontSize: "22px", color: "#333", marginBottom: "15px" }}>Forgot Password</h1>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {message && <p style={{ color: "green" }}>{message}</p>}
                {responseData && (
                    <div style={{ textAlign: "left", background: "#f4f4f4", padding: "10px", borderRadius: "5px", overflowX: "auto", maxHeight: "300px", whiteSpace: "pre-wrap" }}>
                        <h3>Response Data:</h3>
                        <code>{JSON.stringify(responseData, null, 2)}</code>
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
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
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>
                {debugInfo && (
                    <div style={{ textAlign: "left", background: "#f9f9f9", padding: "10px", marginTop: "20px", borderRadius: "5px", overflowX: "auto", whiteSpace: "pre-wrap" }}>
                        <h3>Debug Info:</h3>
                        <code>{debugInfo}</code>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Forgot;
