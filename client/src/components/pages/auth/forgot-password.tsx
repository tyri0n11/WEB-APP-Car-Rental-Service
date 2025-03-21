import React, { useState } from "react";
//import images from "../../../assets/images/images";

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        if (!email) {
            setError("Email is required");
            setLoading(false);
            return;
        }

        try {
            // Read host and path from environment variables
            const API_HOST = import.meta.env.HOST || "http://localhost:3000";
            const FP_PATH = import.meta.env.FP_PATH || "/auth/email/forgot-password";
            const API_URL = `${API_HOST}${FP_PATH}`;

            // Log debug info
            /*
            setDebugInfo(
                `API URL: ${API_URL}\nBody: ${JSON.stringify({ email }, null, 2)}`
            );
            */

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
            //setResponseData(data); // Store the response
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to send request.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.box}>
                <h1 style={styles.title}>Forgot Password</h1>
                {error && <p style={styles.error}>{error}</p>}
                {message && <p style={styles.message}>{message}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        style={styles.input}
                        required
                    />
                    <button type="submit" style={styles.button(loading)} disabled={loading}>
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>
            </div>
        </div>

    );
};

const styles = {
    container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        padding: "20px",
        //backgroundImage: `url(${images.background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
    },
    box: {
        width: "100%",
        maxWidth: "600px",
        padding: "40px",
        background: "white",
        borderRadius: "10px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
    },
    title: {
        fontSize: "22px",
        color: "#333",
        marginBottom: "15px",
    },
    error: {
        color: "red",
    },
    message: {
        color: "green",
    },
    input: {
        width: "100%",
        padding: "12px",
        border: "1px solid #ddd",
        borderRadius: "6px",
        fontSize: "16px",
        marginBottom: "15px",
    },
    button: (loading: boolean) => ({
        width: "100%",
        padding: "12px",
        background: loading ? "#aaa" : "#007bff",
        color: "white",
        border: "none",
        borderRadius: "6px",
        fontSize: "16px",
        cursor: loading ? "not-allowed" : "pointer",
        transition: "background-color 0.3s ease",
    }),
};


export default ForgotPassword;
