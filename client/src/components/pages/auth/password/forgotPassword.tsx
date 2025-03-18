import React, { useState } from "react";
import images from "../../../../assets/images/images"; // Import your images object

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // Spinner for button

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true); // Show loading spinner

        if (!email) {
            setError("Email is required");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/auth/email/forgot-password", {
                method: "POST",
                headers: {
                    "accept": "*/*",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                const data = await response.json();
                const refreshToken = data.refreshToken; // Assuming the backend returns a token

                if (refreshToken) {
                    const resetLink = `http://localhost:3000/reset-password?token=${refreshToken}`;
                    // Display a success message mentioning the link has been sent
                    setMessage(`A password reset link has been sent to your email.`);
                    console.log(`Reset link: ${resetLink}`); // For debugging purposes
                } else {
                    setError("Failed to generate reset link. Try again.");
                }
            } else {
                const data = await response.json();
                setError(data.message || "Something went wrong. Try again.");
            }
        } catch (error) {
            setError("Failed to send request. Check your connection.");
        }
        setLoading(false); // Stop spinner
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
            animation: "fadeIn 1s ease-in-out",
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
            boxShadow: "0 0 6px rgba(0, 123, 255, 0.5)",
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
            animation: "fadeIn 0.5s ease-in-out",
        },
        success: {
            color: "green",
            fontSize: "14px",
            animation: "fadeIn 0.5s ease-in-out",
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
                    <h1 style={{ fontSize: "22px", color: "#333", marginBottom: "15px" }}>Forgot Password</h1>
                    {error && <p style={styles.error}>{error}</p>}
                    {message && <p style={styles.success}>{message}</p>}
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            style={{
                                ...styles.input,
                                ...(email ? styles.inputFocus : {}),
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
                                    Sending
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
