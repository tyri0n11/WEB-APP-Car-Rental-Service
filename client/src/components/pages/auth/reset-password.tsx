import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

const ResetPassword: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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
            const API_HOST = import.meta.env.VITE_HOST || "http://localhost:3000";
            const RP_PATH = import.meta.env.VITE_RP_PATH || "/auth/reset-password";
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

            setTimeout(() => {
                window.history.replaceState({}, document.title, window.location.pathname);
                setSearchParams({});
            }, 500);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.overlay}>
                <div style={styles.box}>
                    <h1 style={styles.title}>Reset Password</h1>
                    {error && <p style={styles.error}>{error}</p>}
                    {message && <p style={styles.message}>{message}</p>}
                    <form onSubmit={handleSubmit}>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter your new password"
                            style={styles.input}
                            required
                        />
                        <button type="submit" style={styles.button(loading)} disabled={loading}>
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Updated responsive styles
const styles = {
    container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw", // Full width of the browser
        padding: "20px", // Prevents content from touching edges on small screens
        //backgroundImage: `url(${images.background})`,]
        backgroundSize: "cover",
        backgroundPosition: "center",
    },
    overlay: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    box: {
        width: "90%", // Responsive width for mobile screens
        maxWidth: "500px", // Prevents it from being too wide on larger screens
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

export default ResetPassword;
