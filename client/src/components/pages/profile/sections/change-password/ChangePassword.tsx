import React, { useState } from 'react';
import { useAuth } from '../../../../../hooks/useAuth';
import { useNotificationWithState } from '../../../../../contexts/NotificationContext';
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
        if (password.length < 8) return 'Mật khẩu phải có ít nhất 8 ký tự';
        if (!/[a-z]/.test(password)) return 'Mật khẩu phải chứa ít nhất một chữ thường';
        if (!/[0-9]/.test(password)) return 'Mật khẩu phải chứa ít nhất một số';
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt';
        return '';
    };

    const validateForm = () => {
        const newErrors: typeof errors = {};

        if (!passwordInfo.oldPassword) {
            newErrors.oldPassword = 'Vui lòng nhập mật khẩu hiện tại';
        }

        if (!passwordInfo.newPassword) {
            newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
        } else {
            const passwordError = validatePassword(passwordInfo.newPassword);
            if (passwordError) {
                newErrors.newPassword = passwordError;
            }
        }

        if (!passwordInfo.confirmPassword) {
            newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
        } else if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
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
                throw new Error('Bạn cần đăng nhập để đổi mật khẩu.');
            }

            await handleAsync(
                async () => changePassword(passwordInfo.oldPassword, passwordInfo.newPassword),
                {
                    loading: 'Đang đổi mật khẩu...',
                    success: 'Đổi mật khẩu thành công!',
                    error: 'Đổi mật khẩu thất bại. Vui lòng thử lại.'
                }
            );

            setPasswordInfo({
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
            setErrors({});
            setIsSubmitted(false);
            showNotification('success', 'Đổi mật khẩu thành công!');
        } catch (error: any) {
            showNotification('error', error?.message || 'Đổi mật khẩu thất bại.');
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

            <form onSubmit={handleSubmit} className="change-password-form">
                <div className="form-group">
                    <label htmlFor="oldPassword">Mật khẩu hiện tại</label>
                    <input
                        type="password"
                        id="oldPassword"
                        name="oldPassword"
                        value={passwordInfo.oldPassword}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        placeholder="Nhập mật khẩu hiện tại"
                        className="input-field"
                    />
                    {isSubmitted && errors.oldPassword && (
                        <div className="error-text">{errors.oldPassword}</div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="newPassword">Mật khẩu mới</label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordInfo.newPassword}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        placeholder="Nhập mật khẩu mới"
                        className="input-field"
                    />
                    {isSubmitted && errors.newPassword && (
                        <div className="error-text">{errors.newPassword}</div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordInfo.confirmPassword}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        placeholder="Nhập lại mật khẩu mới"
                        className="input-field"
                    />
                    {isSubmitted && errors.confirmPassword && (
                        <div className="error-text">{errors.confirmPassword}</div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="change-password-button small"
                >
                    {isLoading ? 'Đang đổi...' : 'Đổi mật khẩu'}
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;
