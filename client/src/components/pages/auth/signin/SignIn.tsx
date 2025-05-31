import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useNotification } from "../../../../contexts/NotificationContext";
import { useAuth } from "../../../../contexts/AuthContext";
import { ROUTES } from '../../../../routes/constants/ROUTES';

import "../AuthStyles.css";

// Helper to prettify backend error messages for user display
function prettifyErrorMessage(msg: string): string {
  if (!msg) return ''
  return msg
    .replace(/phoneNumber/gi, 'Số điện thoại')
    .replace(/firstName/gi, 'Tên')
    .replace(/lastName/gi, 'Họ')
    .replace(/repassword/gi, 'Nhập lại mật khẩu')
    .replace(/password/gi, 'Mật khẩu')
    .replace(/email/gi, 'Email')
    .replace(/is required/gi, 'là bắt buộc')
    .replace(/is not valid/gi, 'không hợp lệ')
    .replace(/must be at least/gi, 'phải có ít nhất')
    .replace(/must contain at least/gi, 'phải chứa ít nhất')
    .replace(/invalid credentials/gi, 'Email hoặc mật khẩu không khớp')
    .replace(/Email or mật khẩu doesn't match/gi, 'Email hoặc mật khẩu không khớp')
    .replace(/Email or password doesn't match/gi, 'Email hoặc mật khẩu không khớp')
    .replace(/password doesn't match/gi, 'Email hoặc mật khẩu không khớp')
    .replace(/mật khẩu doesn't match/gi, 'Email hoặc mật khẩu không khớp')
}

const SignIn: React.FC<{
  onClose: () => void;
  onSwitchToSignUp: () => void;
}> = ({ onClose, onSwitchToSignUp }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = 'Email là bắt buộc';
    else if (!email.includes('@')) newErrors.email = 'Vui lòng nhập địa chỉ email hợp lệ';
    if (!password) newErrors.password = 'Mật khẩu là bắt buộc';
    else if (password.length < 6) newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await login({ email, password });
      showNotification('success', "Đăng nhập thành công!");
      setEmail('');
      setPassword('');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error: any) {
      const backendMsg = error?.response?.data?.message || error?.message;
      showNotification('error', prettifyErrorMessage(backendMsg) || "Đăng nhập thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="modal">
        <div className="signin-wrapper">
          <FaTimes className="close-btn" onClick={onClose} />

          <div className="form-box signin">
            <form onSubmit={handleSubmit} noValidate>
              <h1>Đăng Nhập</h1>

              <div className="input-box">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className={errors.email ? "input-error" : ""}
                />
                {errors.email && <div style={{ color: 'red', fontSize: 12, marginTop: 2 }}>{errors.email}</div>}
              </div>

              <div className="input-box">
                <label>Mật khẩu</label>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className={errors.password ? "input-error" : ""}
                />
                {errors.password && <div style={{ color: 'red', fontSize: 12, marginTop: 2 }}>{errors.password}</div>}
              </div>

              <div className="remember-forgot">
                <label>
                  <input type="checkbox" disabled={isLoading} /> Ghi nhớ đăng nhập
                </label>
                <Link to={ROUTES.AUTH.FORGOT_PASSWORD} onClick={onClose}>
                  Quên mật khẩu?
                </Link>
              </div>

              <div className="button-box">
                <button type="submit" disabled={isLoading}>
                  {isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                </button>
              </div>
              <div className="register-link">
                <p>
                  Chưa có tài khoản?{" "}
                  <span
                    className="link"
                    onClick={onSwitchToSignUp}
                    role="button"
                    tabIndex={0}
                  >
                    Đăng ký
                  </span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
