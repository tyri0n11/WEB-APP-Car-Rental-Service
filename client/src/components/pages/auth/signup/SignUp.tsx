import React, { useState } from "react";
import { FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../../../hooks/useAuth";
import { useNotification } from "../../../../contexts/NotificationContext";
import "../AuthStyles.css";

const SignUp: React.FC<{
  onClose: () => void;
  onSwitchToSignIn: () => void;
}> = ({ onClose, onSwitchToSignIn }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepassword, setShowRepassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    password?: string;
    repassword?: string;
    agree?: string;
  }>({});

  const { signup } = useAuth();
  const { showNotification } = useNotification();

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
      .replace(/Passwords do not match/gi, 'Mật khẩu không khớp');
  }

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!firstName) newErrors.firstName = 'Tên là bắt buộc';
    if (!lastName) newErrors.lastName = 'Họ là bắt buộc';
    if (!email) newErrors.email = 'Email là bắt buộc';
    else if (!email.includes('@')) newErrors.email = 'Vui lòng nhập địa chỉ email hợp lệ';
    if (!phoneNumber) newErrors.phoneNumber = 'Số điện thoại là bắt buộc';
    else if (!/^\d{10}$/.test(phoneNumber)) newErrors.phoneNumber = 'Vui lòng nhập số điện thoại 10 chữ số hợp lệ';
    if (!password) newErrors.password = 'Mật khẩu là bắt buộc';
    else if (password.length < 6) newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    else if (!/[A-Z]/.test(password)) newErrors.password = 'Mật khẩu phải chứa ít nhất một chữ hoa';
    else if (!/[a-z]/.test(password)) newErrors.password = 'Mật khẩu phải chứa ít nhất một chữ thường';
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) newErrors.password = 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt';
    if (!repassword) newErrors.repassword = 'Vui lòng nhập lại mật khẩu';
    else if (password !== repassword) newErrors.repassword = 'Mật khẩu không khớp';
    if (!isAgreed) newErrors.agree = 'Bạn phải đồng ý với điều khoản và chính sách';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    let signupSuccess = false;
    try {
      await signup({
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
      });
      signupSuccess = true;
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhoneNumber('');
      setPassword('');
      setRepassword('');
      showNotification('success', 'Tạo tài khoản thành công!');
    } catch (error: any) {
      const backendMsg = error?.response?.data?.message || error?.message;
      showNotification('error', prettifyErrorMessage(backendMsg) || 'Tạo tài khoản thất bại');
    } finally {
      setIsLoading(false);
      if (signupSuccess) {
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    }
  };

  return (
    <>
      <div className="modal">
        <div className="signup-wrapper">
          <FaTimes className="close-btn" onClick={onClose} />
          <div className="form-box signup">
            <form onSubmit={handleSubmit} noValidate>
              <h1>Đăng Ký</h1>
              <div className="name-box">
                <div className="input-box">
                  <label>Tên</label>
                  <input
                    type="text"
                    placeholder="Tên"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isLoading}
                    className={errors.firstName ? "input-error" : ""}
                  />
                  {errors.firstName && <div style={{ color: 'red', fontSize: 12, marginTop: 2 }}>{errors.firstName}</div>}
                </div>
                <div className="input-box">
                  <label>Họ</label>
                  <input
                    type="text"
                    placeholder="Họ"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isLoading}
                    className={errors.lastName ? "input-error" : ""}
                  />
                  {errors.lastName && <div style={{ color: 'red', fontSize: 12, marginTop: 2 }}>{errors.lastName}</div>}
                </div>
              </div>

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
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={isLoading}
                  className={errors.phoneNumber ? "input-error" : ""}
                />
                {errors.phoneNumber && <div style={{ color: 'red', fontSize: 12, marginTop: 2 }}>{errors.phoneNumber}</div>}
              </div>

              <div className="input-box">
                <label>Mật khẩu</label>
                <div style={{ position: 'relative' }}>
                <input
                    type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className={errors.password ? "input-error" : ""}
                />
                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      fontSize: '18px',
                      color: '#666',
                      display: 'flex',
                      alignItems: 'center',
                      zIndex: 1
                    }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
                {errors.password && <div style={{ color: 'red', fontSize: 12, marginTop: 2 }}>{errors.password}</div>}
              </div>

              <div className="input-box">
                <label>Nhập lại mật khẩu</label>
                <div style={{ position: 'relative' }}>
                <input
                    type={showRepassword ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu"
                  value={repassword}
                  onChange={(e) => setRepassword(e.target.value)}
                  disabled={isLoading}
                  className={errors.repassword ? "input-error" : ""}
                />
                  <div
                    onClick={() => setShowRepassword(!showRepassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      fontSize: '18px',
                      color: '#666',
                      display: 'flex',
                      alignItems: 'center',
                      zIndex: 1
                    }}
                  >
                    {showRepassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
                {errors.repassword && <div style={{ color: 'red', fontSize: 12, marginTop: 2 }}>{errors.repassword}</div>}
              </div>

              <div className="remember-forgot" style={{ flexDirection: 'column', gap: '4px' }}>
                <label style={{ marginBottom: '2px' }}>
                  <input
                    type="checkbox"
                    checked={isAgreed}
                    onChange={e => setIsAgreed(e.target.checked)}
                    disabled={isLoading}
                  />
                  Tôi đồng ý với các điều khoản và chính sách
                </label>
                {errors.agree && (
                  <div style={{
                    color: 'red',
                    fontSize: 12,
                    display: 'block',
                    marginTop: 0
                  }}>
                    {errors.agree}
                  </div>
                )}
              </div>

              <div className="button-box">
                <button type="submit" disabled={isLoading}>
                  {isLoading ? 'Đang tạo tài khoản...' : 'Đăng Ký'}
                </button>
              </div>

              <div className="login-link">
                <p>
                  Đã có tài khoản?{" "}
                  <span
                    className="link"
                    onClick={onSwitchToSignIn}
                    role="button"
                    tabIndex={0}
                  >
                    Đăng nhập
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

export default SignUp;
