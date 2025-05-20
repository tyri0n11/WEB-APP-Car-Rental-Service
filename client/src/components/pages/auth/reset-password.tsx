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
                loading: "Đang đặt lại mật khẩu...",
                success: "Đặt lại mật khẩu thành công!",
                error: "Đặt lại mật khẩu thất bại. Vui lòng thử lại.",
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
                    <h1 style={styles.title}>Đặt Lại Mật Khẩu</h1>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Nhập mật khẩu mới"
                            style={styles.input}
                            required
                            disabled={isLoading}
                        />
                        <button type="submit" style={styles.button(isLoading)} disabled={isLoading}>
                            {isLoading ? "Đang đặt lại..." : "Đặt Lại Mật Khẩu"}
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
        width: "100vw",
        padding: "20px",
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
        width: "90%",
        maxWidth: "500px",
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
