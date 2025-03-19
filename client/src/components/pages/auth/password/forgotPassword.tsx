import React, { useState } from "react";
import images from "../../../../assets/images/images"; // Ensure this is the correct path to your images

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // Spinner for button
    const [connected, setConnected] = useState(false); // State for backend connection

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        console.log("Email:", email);
        if (!email.trim()) {
            setError("Email is required");
            setLoading(false);
            return;
        }

        try {
            // Ensure BACKEND_URL is properly loaded
            const API_URL = import.meta.env.BACKEND_URL;
            if (!API_URL) {
                throw new Error("Backend URL is not set in environment variables.");
            }
            console.log("Connecting to backend at:", API_URL);
            // headers: { "Content-Type": "application/json" },
            const response = await fetch(`${API_URL}/auth/email/forgot-password`, {
                method: "POST",
                body: JSON.stringify({ email }), // Use actual email state
            });

            console.log("Response status:", response.status);

            if (!response.ok) {
                let errorMessage = "Something went wrong.";
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (jsonError) {
                    console.warn("Response is not in JSON format.");
                }
                throw new Error(errorMessage);
            }

            let responseData = {};
            try {
                responseData = await response.json(); // Try parsing JSON
            } catch (jsonError) {
                console.warn("No JSON body returned from server.");
            }

            setMessage(responseData?.message || "Password reset link sent to your email.");
        } catch (err) {
            console.error("Error during fetch:", err);
            setError(err instanceof Error ? err.message : "Failed to send request.");
        } finally {
            setLoading(false);
        }
    };


    const styles = {
        container: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            width: "100%",
        },
        wrapper: {
            width: "500px",
            padding: "40px",
            background: "white",
            borderRadius: "10px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            textAlign: "center" as "center",
        },
        input: {
            width: "100%",
            padding: "12px",
            border: "1px solid #ddd",
            borderRadius: "6px",
            fontSize: "16px",
            marginBottom: "15px",
        },
        button: {
            width: "100%",
            padding: "12px",
            background: loading ? "#aaa" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background-color 0.3s ease",
        },
        error: {
            color: "red",
            fontSize: "14px",
        },
        success: {
            color: "green",
            fontSize: "14px",
        },
        connected: {
            color: "blue",
            fontSize: "14px",
        },
        spinner: {
            width: "20px",
            height: "20px",
            border: "3px solid white",
            borderTop: "3px solid rgba(0, 0, 0, 0.2)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            display: "inline-block",
            marginLeft: "8px",
        },
    };

    return (
        <>
            <style>
                {`
                html, body {
                    height: 100%;
                    margin: 0;
                    font-family: 'Inter', sans-serif;
                    background: url(${images.background}) no-repeat center center fixed;
                    background-size: cover;
                    overflow: hidden;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                `}
            </style>
            <div style={styles.container}>
                <div style={styles.wrapper}>
                    <h1 style={{ fontSize: "22px", color: "#333", marginBottom: "15px" }}>Forgot Password</h1>
                    {connected && <p style={styles.connected}>Connected to backend successfully!</p>}
                    {error && <p style={styles.error}>{error}</p>}
                    {message && <p style={styles.success}>{message}</p>}
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            style={styles.input}
                            required
                        />
                        <button
                            type="submit"
                            style={styles.button}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    Sending...
                                    <span style={styles.spinner}></span>
                                </>
                            ) : (
                                "Send Reset Link"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;
