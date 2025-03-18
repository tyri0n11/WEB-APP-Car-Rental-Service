import React, { useState } from "react";
import images from "../../../../assets/images/images"; // Import your images object

const ResetPassword: React.FC = () => {
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // Spinner for the button

    // Get the token from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token"); // Extracts the "token" from the query parameters

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true); // Start loading spinner

        if (!newPassword) {
            setError("New password is required");
            setLoading(false);
            return;
        }

        if (!token) {
            setError("Invalid or missing token. Please check your email link.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/auth/reset-password", {
                method: "POST",
                headers: {
                    accept: "*/*",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, newPassword }), // Send the token and new password
            });

            if (response.ok) {
                setMessage("Your password has been reset successfully.");
            } else {
                const data = await response.json();
                setError(data.message || "Something went wrong. Try again.");
            }
        } catch (error) {
            setError("Failed to send request. Check your connection.");
        }

        setLoading(false); // Stop the spinner
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
            animation: "fadeIn 1s ease-in-out", // Fade-in animation for the wrapper
        },
        input: {
            width: "100%",
            padding: "12px",
            border: "1px solid #ddd",
            borderRadius: "6px",
            fontSize: "16px",
            outline: "none" as "none",
            transition: "border-color 0.3s ease, box-shadow 0.3s ease",
            marginBottom: "15px",
        },
        inputFocus: {
            borderColor: "#007bff",
            boxShadow: "0 0 6px rgba(0, 123, 255, 0.5)", // Blue glowing effect
        },
        button: {
            width: "100%",
            padding: "12px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
        },
        buttonHover: {
            background: "#0056b3",
        },
        buttonDisabled: {
            background: "#007bff",
            cursor: "not-allowed",
        },
        error: {
            color: "red",
            fontSize: "14px",
            animation: "fadeIn 0.5s ease-in-out", // Smooth fade-in animation for errors
        },
        success: {
            color: "green",
            fontSize: "14px",
            animation: "fadeIn 0.5s ease-in-out", // Smooth fade-in animation for success messages
        },
        spinner: {
            width: "20px",
            height: "20px",
            border: "3px solid white",
            borderTop: "3px solid rgba(0, 0, 0, 0.2)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            display: "inline-block",
            verticalAlign: "middle",
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

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes spin {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
                `}
            </style>
            <div style={styles.container}>
                <div style={styles.wrapper}>
                    <h1 style={{ fontSize: "22px", color: "#333", marginBottom: "15px" }}>Reset Password</h1>
                    {error && <p style={styles.error}>{error}</p>}
                    {message && <p style={styles.success}>{message}</p>}
                    <form onSubmit={handleSubmit}>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter your new password"
                            style={{
                                ...styles.input,
                                ...(newPassword ? styles.inputFocus : {}),
                            }}
                            required
                        />
                        <button
                            type="submit"
                            style={{
                                ...styles.button,
                                ...(loading ? styles.buttonDisabled : styles.buttonHover),
                            }}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    Resetting
                                    <span style={styles.spinner}></span>
                                </>
                            ) : (
                                "Reset Password"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ResetPassword;
