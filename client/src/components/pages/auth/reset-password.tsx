import React, { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useNotification } from "../../../contexts/NotificationContext";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./reset-password.css";

const ResetPassword: React.FC = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { resetPassword } = useAuth();
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!token) {
            showNotification("error", "Invalid or missing reset token");
            setLoading(false);
            return;
        }

        if (!newPassword || !confirmPassword) {
            showNotification("error", "Please fill in all fields");
            setLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            showNotification("error", "Passwords do not match");
            setLoading(false);
            return;
        }

        if (newPassword.length < 8) {
            showNotification("error", "Password must be at least 8 characters long");
            setLoading(false);
            return;
        }

        try {
            await resetPassword(token, newPassword);
            showNotification("success", "Password reset successfully!");
            navigate("/login");
        } catch (error) {
            // Error is already handled in the context
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1 className="auth-title">Reset Password</h1>
                
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="newPassword" className="form-label">
                            New Password
                        </label>
                        <input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            className="form-input"
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="submit-button"
                        disabled={loading}
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
                
                <div className="auth-link">
                    <Link to="/login">Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
