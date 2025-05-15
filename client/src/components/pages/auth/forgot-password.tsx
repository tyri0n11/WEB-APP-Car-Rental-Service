import React, { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useNotificationWithState } from "../../../contexts/NotificationContext";
import { AUTH_NOTIFICATIONS } from "../../../constants/notificationMessages";
//import images from "../../../assets/images/images";

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState("");
    const { forgotPassword } = useAuth();
    const { isLoading, handleAsync } = useNotificationWithState();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            return;
        }

        await handleAsync(
            async () => forgotPassword(email),
            {
                loading: AUTH_NOTIFICATIONS.forgotPassword.loading,
                success: AUTH_NOTIFICATIONS.forgotPassword.success,
                error: AUTH_NOTIFICATIONS.forgotPassword.error
            }
        );
    };

    return (
        <div style={styles.container}>
            <div style={styles.box}>
                <h1 style={styles.title}>Forgot Password</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        style={styles.input}
                        required
                        disabled={isLoading}
                    />
                    <button type="submit" style={styles.button(isLoading)} disabled={isLoading}>
                        {isLoading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;
