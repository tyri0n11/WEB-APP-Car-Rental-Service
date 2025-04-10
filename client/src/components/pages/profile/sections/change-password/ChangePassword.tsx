import React, { useState } from 'react';
import { FaLock, FaSave } from 'react-icons/fa';
import { useAuth } from '../../../../../contexts/AuthContext';
import { useNotification } from '../../../../../contexts/NotificationContext';
import './ChangePassword.css';

const ChangePassword: React.FC = () => {
    const { changePassword } = useAuth();
    const { showNotification } = useNotification();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const validateForm = () => {
        const newErrors = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        };
        let isValid = true;

        if (!formData.currentPassword) {
            newErrors.currentPassword = 'Current password is required';
            isValid = false;
        }

        if (!formData.newPassword) {
            newErrors.newPassword = 'New password is required';
            isValid = false;
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = 'New password must be at least 6 characters long';
            isValid = false;
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your new password';
            isValid = false;
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            await changePassword(formData.currentPassword, formData.newPassword);
            showNotification('success', 'Password changed successfully');
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (error) {
            showNotification('error', error instanceof Error ? error.message : 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user starts typing
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    return (
        <div className="profile-section">
            <div className="profile-section-header">
                <h2>Change Password</h2>
            </div>
            <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                    <label htmlFor="currentPassword">Current Password</label>
                    <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className={errors.currentPassword ? 'form-input error' : 'form-input'}
                    />
                    {errors.currentPassword && (
                        <span className="error-message">{errors.currentPassword}</span>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className={errors.newPassword ? 'form-input error' : 'form-input'}
                    />
                    {errors.newPassword && (
                        <span className="error-message">{errors.newPassword}</span>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={errors.confirmPassword ? 'form-input error' : 'form-input'}
                    />
                    {errors.confirmPassword && (
                        <span className="error-message">{errors.confirmPassword}</span>
                    )}
                </div>

                <div className="form-actions">
                    <button 
                        type="submit" 
                        className="profile-button profile-button-primary" 
                        disabled={loading}
                    >
                        <FaSave /> {loading ? 'Changing Password...' : 'Change Password'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangePassword;
