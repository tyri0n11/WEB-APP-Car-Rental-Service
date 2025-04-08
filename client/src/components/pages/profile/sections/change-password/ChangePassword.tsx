import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../../hooks/useAuth';
import './ChangePassword.css';

const API_AUTHEN_URL = "http://localhost:3000/auth";

const ChangePassword: React.FC = () => {
    const { user, accessToken } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [success, setSuccess] = useState<string | null>(null);
    const [passwordInfo, setPasswordInfo] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Check if user is authenticated
    useEffect(() => {
        if (!user || !accessToken) {
            setErrors({ submit: 'You must be logged in to change your password.' });
        }
    }, [user, accessToken]);

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
            setErrors({});
            setSuccess(null);

            if (!user || !accessToken) {
                throw new Error('You must be logged in to change your password.');
            }

            const requestBody = {
                oldPassword: passwordInfo.currentPassword,
                newPassword: passwordInfo.newPassword,
            };

            const response = await fetch(`${API_AUTHEN_URL}/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || `Failed to change password: ${response.status} ${response.statusText}`);
            }

            setSuccess('Password changed successfully!');
            setPasswordInfo({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (error) {
            if (error instanceof Error) {
                setErrors({ submit: error.message });
            } else {
                setErrors({ submit: 'Failed to change password. Please try again.' });
            }
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
                        <div className="error-message">{errors.submit}</div>
                    )}

                    {success && (
                        <div className="success-message">{success}</div>
                    )}

                    <button
                        type="submit"
                        className="submit-button"
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
