import React, { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useNotification } from "../../../contexts/NotificationContext";
import { AUTH_NOTIFICATIONS } from "../../../constants/notificationMessages";

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { forgotPassword } = useAuth();
    const { showNotification } = useNotification();

    const validate = () => {
        if (!email) return "Email là bắt buộc";
        if (!email.includes("@")) return "Vui lòng nhập địa chỉ email hợp lệ";
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationError = validate();
        setError(validationError);
        if (validationError) return;

        setIsLoading(true);
        try {
            await forgotPassword(email);
            showNotification("success", AUTH_NOTIFICATIONS.forgotPassword.success);
            setEmail("");
        } catch (err: any) {
            const backendMsg = err?.response?.data?.message || err?.message;
            setError(backendMsg || AUTH_NOTIFICATIONS.forgotPassword.error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.box}>
                <h1 style={styles.title}>Quên mật khẩu</h1>
                <form onSubmit={handleSubmit} autoComplete="off">
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Nhập email của bạn"
                        style={styles.input}
                        disabled={isLoading}
                        autoComplete="off"
                    />
                    {error && (
                        <div style={{ color: 'red', fontSize: 13, marginBottom: 8 }}>
                            {error}
                        </div>
                    )}
                    <button type="submit" style={styles.button(isLoading)} disabled={isLoading}>
                        {isLoading ? "Đang gửi..." : "Gửi liên kết"}
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
        marginBottom: "8px",
        background: "#fff",
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
