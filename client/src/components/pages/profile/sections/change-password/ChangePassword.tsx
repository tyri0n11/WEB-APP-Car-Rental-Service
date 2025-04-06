import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../../hooks/useAuth';
import './ChangePassword.css';

const API_AUTHEN_URL = "http://localhost:3000/auth";

const ChangePassword: React.FC = () => {
    const { user, accessToken, logout } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [success, setSuccess] = useState<string | null>(null);
    const [debugInfo, setDebugInfo] = useState<{
        requestBody: any;
        responseStatus: number | null;
        responseData: any;
        errorDetails: any;
    }>({
        requestBody: null,
        responseStatus: null,
        responseData: null,
        errorDetails: null
    });
    const [passwordInfo, setPasswordInfo] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Check if user is authenticated
    useEffect(() => {
        if (!user || !accessToken) {
            setErrors({ submit: 'You must be logged in to change your password.' });
        } else {
            console.log('User is authenticated:', user);
            console.log('Access token available:', !!accessToken);
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

    const refreshToken = async (): Promise<string | null> => {
        try {
            const refreshToken = localStorage.getItem("refresh_token");
            if (!refreshToken) {
                console.log('No refresh token found in localStorage');
                return null;
            }

            console.log('Attempting to refresh token...');
            const response = await fetch(`${API_AUTHEN_URL}/refresh-token`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh_token: refreshToken }),
            });

            console.log('Refresh token response status:', response.status);
            
            if (!response.ok) {
                console.log('Refresh token request failed');
                return null;
            }
            
            const data = await response.json();
            console.log('Refresh token response data:', data);
            
            const newAccessToken = data?.access_token;
            
            if (newAccessToken) {
                console.log('New access token received');
                localStorage.setItem("access_token", newAccessToken);
                return newAccessToken;
            } else {
                console.log('No access token in refresh response');
            }
            
            return null;
        } catch (error) {
            console.error("Error refreshing token:", error);
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setIsSubmitting(true);
            setErrors({});
            setSuccess(null);
            setDebugInfo({
                requestBody: null,
                responseStatus: null,
                responseData: null,
                errorDetails: null
            });

            if (!user || !accessToken) {
                throw new Error('You must be logged in to change your password.');
            }

            // Log the token format (first 10 chars for security)
            console.log('Using access token:', accessToken.substring(0, 10) + '...');
            
            const requestBody = {
                oldPassword: passwordInfo.currentPassword,
                newPassword: passwordInfo.newPassword,
            };
            
            console.log('Sending password change request...');
            console.log('Request body:', requestBody);
            
            setDebugInfo(prev => ({ ...prev, requestBody }));

            let token = accessToken;
            let response = await fetch('http://localhost:3000/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            console.log('Initial response status:', response.status);
            setDebugInfo(prev => ({ ...prev, responseStatus: response.status }));
            
            // If unauthorized, try to refresh the token and retry once
            if (response.status === 401) {
                console.log('Token expired, attempting to refresh...');
                const newToken = await refreshToken();
                
                if (newToken) {
                    console.log('Token refreshed, retrying request with new token:', newToken.substring(0, 10) + '...');
                    token = newToken;
                    response = await fetch('http://localhost:3000/auth/change-password', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json',
                        },
                        body: JSON.stringify(requestBody),
                    });
                    console.log('Retry response status:', response.status);
                    setDebugInfo(prev => ({ ...prev, responseStatus: response.status }));
                } else {
                    // If token refresh failed, log out the user
                    console.log('Token refresh failed, logging out user');
                    logout();
                    throw new Error('Your session has expired. Please log in again.');
                }
            }

            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));
            
            let data;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
                console.log('Response data:', data);
                setDebugInfo(prev => ({ ...prev, responseData: data }));
            } else {
                const text = await response.text();
                console.log('Response text:', text);
                setDebugInfo(prev => ({ ...prev, responseData: text }));
                throw new Error('Invalid response format from server');
            }

            if (!response.ok) {
                setDebugInfo(prev => ({ ...prev, errorDetails: data }));
                throw new Error(data.message || `Failed to change password: ${response.status} ${response.statusText}`);
            }

            setSuccess('Password changed successfully!');
            setPasswordInfo({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (error) {
            console.error('Error changing password:', error);
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
                        <div className="error-message submit-error">{errors.submit}</div>
                    )}
                    {success && <div className="success-message">{success}</div>}

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={isSubmitting || !user || !accessToken}
                    >
                        {isSubmitting ? 'Changing Password...' : 'Change Password'}
                    </button>
                </form>
                
                {/* Debug Information */}
                {(debugInfo.requestBody || debugInfo.responseStatus || debugInfo.responseData || debugInfo.errorDetails) && (
                    <div className="debug-info">
                        <h5>Debug Information</h5>
                        {debugInfo.requestBody && (
                            <div className="debug-section">
                                <h6>Request Body:</h6>
                                <pre>{JSON.stringify(debugInfo.requestBody, null, 2)}</pre>
                            </div>
                        )}
                        {debugInfo.responseStatus && (
                            <div className="debug-section">
                                <h6>Response Status: {debugInfo.responseStatus}</h6>
                            </div>
                        )}
                        {debugInfo.responseData && (
                            <div className="debug-section">
                                <h6>Response Data:</h6>
                                <pre>{JSON.stringify(debugInfo.responseData, null, 2)}</pre>
                            </div>
                        )}
                        {debugInfo.errorDetails && (
                            <div className="debug-section">
                                <h6>Error Details:</h6>
                                <pre>{JSON.stringify(debugInfo.errorDetails, null, 2)}</pre>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChangePassword;
