import React, { useState } from 'react';
import { useAuth } from '../../../../../hooks/useAuth';
import { useNotificationWithState } from '../../../../../contexts/NotificationContext';
import { AUTH_NOTIFICATIONS } from '../../../../../constants/notificationMessages';
import './ChangePassword.css';

const PASSWORD_RULE = 'Password must be at least 8 characters.';

interface FormMessage {
    type: 'success' | 'error';
    message: string;
}

const ChangePassword: React.FC = () => {
    const { user, changePassword } = useAuth();
    const { isLoading, handleAsync } = useNotificationWithState();
    const [passwordInfo, setPasswordInfo] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [newPasswordError, setNewPasswordError] = useState<string | null>(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
    const [formMessage, setFormMessage] = useState<FormMessage | null>(null);

    const validateForm = () => {
        if (!passwordInfo.oldPassword) {
            throw new Error('Current password is required');
        }
        if (!passwordInfo.newPassword) {
            throw new Error('New password is required');
        } else if (passwordInfo.newPassword.length < 8) {
            throw new Error(PASSWORD_RULE);
        }
        if (!passwordInfo.confirmPassword) {
            throw new Error('Please confirm your new password');
        } else if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
            throw new Error('Passwords do not match');
        }
        return true;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordInfo((prev) => ({ ...prev, [name]: value }));
        if (name === 'newPassword') {
            if (value.length < 8) {
                setNewPasswordError(PASSWORD_RULE);
            } else {
                setNewPasswordError(null);
            }
            if (passwordInfo.confirmPassword && value !== passwordInfo.confirmPassword) {
                setConfirmPasswordError('Passwords do not match');
            } else {
                setConfirmPasswordError(null);
            }
        }
        if (name === 'confirmPassword') {
            if (value !== passwordInfo.newPassword) {
                setConfirmPasswordError('Passwords do not match');
            } else {
                setConfirmPasswordError(null);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormMessage(null);
        try {
            validateForm();
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
            setNewPasswordError(null);
            setConfirmPasswordError(null);
            setFormMessage({ type: 'success', message: 'Password changed successfully!' });
        } catch (error: any) {
            setFormMessage({ type: 'error', message: error?.message || 'Failed to change password.' });
        }
    };

    return (
        <form className="change-password-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="oldPassword">Current Password</label>
                <input
                    type="password"
                    id="oldPassword"
                    name="oldPassword"
                    value={passwordInfo.oldPassword}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    required
                    className="input-field"
                />
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
                    required
                    className="input-field"
                />
                {newPasswordError && <span className="error-message">{newPasswordError}</span>}
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
                    required
                    className="input-field"
                />
                {confirmPasswordError && <span className="error-message">{confirmPasswordError}</span>}
            </div>
            <button 
                type="submit" 
                disabled={isLoading}
                className="change-password-button prominent"
            >
                {isLoading ? 'Changing Password...' : 'Change Password'}
            </button>
            {formMessage && (
                <div className={formMessage.type === 'success' ? 'success-message' : 'error-message'}>
                    {formMessage.message}
                </div>
            )}
        </form>
    );
};

export default ChangePassword;
