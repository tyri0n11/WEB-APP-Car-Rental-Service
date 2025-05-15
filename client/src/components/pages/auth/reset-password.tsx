import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useNotificationWithState } from "../../../contexts/NotificationContext";
import { AUTH_NOTIFICATIONS } from "../../../constants/notificationMessages";

const ResetPassword: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const { resetPassword } = useAuth();
    const { isLoading, handleAsync } = useNotificationWithState();

    const token = searchParams.get("token");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newPassword || !token) {
            return;
        }

        const result = await handleAsync(
            async () => resetPassword(token, newPassword),
            {
                loading: AUTH_NOTIFICATIONS.resetPassword.loading,
                success: AUTH_NOTIFICATIONS.resetPassword.success,
                error: AUTH_NOTIFICATIONS.resetPassword.error
            }
        );

        if (result) {
            setTimeout(() => {
                navigate('/auth/signin');
            }, 1500);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.overlay}>
                <div style={styles.box}>
                    <h1 style={styles.title}>Reset Password</h1>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter your new password"
                            style={styles.input}
                            required
                            disabled={isLoading}
                        />
                        <button type="submit" style={styles.button(isLoading)} disabled={isLoading}>
                            {isLoading ? "Resetting..." : "Reset Password"}
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
        textAlign: "center" as const,
    },
    title: {
        fontSize: "22px",
        color: "#333",
        marginBottom: "15px",
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
