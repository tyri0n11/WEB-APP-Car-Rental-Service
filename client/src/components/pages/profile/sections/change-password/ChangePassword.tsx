import React, { useState } from 'react';
import { useAuth } from '../../../../../hooks/useAuth';
import './ChangePassword.css';

const ChangePassword: React.FC = () => {
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [success, setSuccess] = useState<string | null>(null);
    const [passwordInfo, setPasswordInfo] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!passwordInfo.currentPassword) {
            newErrors.currentPassword = 'Current password is required';
        }

        if (!passwordInfo.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (passwordInfo.newPassword.length < 8) {
            newErrors.newPassword = 'Password must be at least 8 characters long';
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
        setPasswordInfo((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
        setSuccess(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setIsSubmitting(true);
            const response = await fetch('/api/users/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentPassword: passwordInfo.currentPassword,
                    newPassword: passwordInfo.newPassword,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to change password');
            }

            setSuccess('Password changed successfully!');
            setPasswordInfo({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (error) {
            console.error('Error changing password:', error);
            setErrors({ submit: 'Failed to change password. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="change-password-root">
            <div className="change-password-section">
                <div className="change-password-header">
                    <h4>Change Password</h4>
                </div>

                <form onSubmit={handleSubmit} className="password-form">
                    <div className="form-field">
                        <label htmlFor="currentPassword">Current Password</label>
                        <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={passwordInfo.currentPassword}
                            onChange={handleInputChange}
                            placeholder="Enter your current password"
                            className={errors.currentPassword ? 'error' : ''}
                        />
                        {errors.currentPassword && (
                            <span className="error-message">{errors.currentPassword}</span>
                        )}
                    </div>

                    <div className="form-field">
                        <label htmlFor="newPassword">New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={passwordInfo.newPassword}
                            onChange={handleInputChange}
                            placeholder="Enter your new password"
                            className={errors.newPassword ? 'error' : ''}
                        />
                        {errors.newPassword && (
                            <span className="error-message">{errors.newPassword}</span>
                        )}
                    </div>

                    <div className="form-field">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={passwordInfo.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirm your new password"
                            className={errors.confirmPassword ? 'error' : ''}
                        />
                        {errors.confirmPassword && (
                            <span className="error-message">{errors.confirmPassword}</span>
                        )}
                    </div>

                    {errors.submit && (
                        <div className="error-message submit-error">{errors.submit}</div>
                    )}
                    {success && <div className="success-message">{success}</div>}

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Changing Password...' : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
