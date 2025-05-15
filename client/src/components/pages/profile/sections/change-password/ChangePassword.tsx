import React, { useState } from 'react';
import { useAuth } from '../../../../../hooks/useAuth';
import { useNotificationWithState } from '../../../../../contexts/NotificationContext';
import { AUTH_NOTIFICATIONS } from '../../../../../constants/notificationMessages';
import Notification from '../../../../common/Notification';
import './ChangePassword.css';

const ChangePassword: React.FC = () => {
    const { user, changePassword } = useAuth();
    const { isLoading, handleAsync } = useNotificationWithState();
    const [passwordInfo, setPasswordInfo] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [notification, setNotification] = useState<{
        show: boolean;
        type: 'success' | 'error';
        message: string;
    }>({
        show: false,
        type: 'success',
        message: '',
    });

    const [errors, setErrors] = useState<{
        oldPassword?: string;
        newPassword?: string;
        confirmPassword?: string;
    }>({});

    const [isSubmitted, setIsSubmitted] = useState(false);

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({
            show: true,
            type,
            message,
        });
    };

    const validatePassword = (password: string): string => {
        if (password.length < 8) return 'Password must be at least 8 characters';
        if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
        if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must contain at least one special character';
        return '';
    };

    const validateForm = () => {
        const newErrors: typeof errors = {};
        
        if (!passwordInfo.oldPassword) {
            newErrors.oldPassword = 'Current password is required';
        }

        if (!passwordInfo.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else {
            const passwordError = validatePassword(passwordInfo.newPassword);
            if (passwordError) {
                newErrors.newPassword = passwordError;
            }
        }

        if (!passwordInfo.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your new password';
        } else if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordInfo(prev => ({ ...prev, [name]: value }));
        if (isSubmitted) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
        if (!validateForm()) return;

        try {
            if (!user) {
                throw new Error('You must be logged in to change your password.');
            }

            await handleAsync(
                async () => changePassword(passwordInfo.oldPassword, passwordInfo.newPassword),
                {
                    loading: AUTH_NOTIFICATIONS.changePassword.loading,
                    success: AUTH_NOTIFICATIONS.changePassword.success,
                    error: AUTH_NOTIFICATIONS.changePassword.error
                }
            );

            setPasswordInfo({
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
            setErrors({});
            setIsSubmitted(false);
            showNotification('success', 'Password changed successfully!');
        } catch (error: any) {
            showNotification('error', error?.message || 'Failed to change password.');
        }
    };

    return (
        <div className="change-password-section">
            <Notification
                show={notification.show}
                type={notification.type}
                message={notification.message}
                onClose={() => setNotification(prev => ({ ...prev, show: false }))}
            />

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="oldPassword">Current Password</label>
                    <input
                        type="password"
                        id="oldPassword"
                        name="oldPassword"
                        value={passwordInfo.oldPassword}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        placeholder="Enter your current password"
                        className="input-field"
                    />
                    {isSubmitted && errors.oldPassword && (
                        <div style={{ color: 'red', fontSize: 12, marginTop: 2 }}>{errors.oldPassword}</div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordInfo.newPassword}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        placeholder="Enter your new password"
                        className="input-field"
                    />
                    {isSubmitted && errors.newPassword && (
                        <div style={{ color: 'red', fontSize: 12, marginTop: 2 }}>{errors.newPassword}</div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordInfo.confirmPassword}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        placeholder="Confirm your new password"
                        className="input-field"
                    />
                    {isSubmitted && errors.confirmPassword && (
                        <div style={{ color: 'red', fontSize: 12, marginTop: 2 }}>{errors.confirmPassword}</div>
                    )}
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="change-password-button"
                >
                    {isLoading ? 'Changing Password...' : 'Change Password'}
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;
