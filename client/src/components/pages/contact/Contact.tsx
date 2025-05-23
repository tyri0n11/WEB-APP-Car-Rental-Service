import React, { useState } from 'react';
import { FaCheckCircle, FaClock, FaEnvelope, FaExclamationCircle, FaFacebook, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhone, FaSpinner, FaTwitter } from 'react-icons/fa';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
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

  const [isLoading, setIsLoading] = useState(false);

  const colors = {
    primary: '#1E3A8A',
    primaryHover: '#2563EB',
    secondary: '#64748B',
    background: '#FFFFFF',
    backgroundAlt: '#F8FAFC',
    border: '#E2E8F0',
    text: '#1E293B',
    textLight: '#64748B',
    accent: '#3B82F6',
    success: '#22C55E',
  };

  const contactInfo = [
    {
      icon: <FaPhone />,
      title: 'Điện thoại',
      content: '+84 123 456 789',
      link: 'tel:+84123456789',
    },
    {
      icon: <FaEnvelope />,
      title: 'Email',
      content: 'support@carental.com',
      link: 'mailto:support@carental.com',
    },
    {
      icon: <FaMapMarkerAlt />,
      title: 'Địa chỉ',
      content: '123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh',
      link: 'https://maps.google.com',
    },
    {
      icon: <FaClock />,
      title: 'Giờ làm việc',
      content: 'Thứ 2 - Chủ nhật: 24/7',
      link: null,
    },
  ];

  const socialLinks = [
    { icon: <FaFacebook />, link: '#', color: '#1877F2' },
    { icon: <FaTwitter />, link: '#', color: '#1DA1F2' },
    { icon: <FaInstagram />, link: '#', color: '#E4405F' },
    { icon: <FaLinkedin />, link: '#', color: '#0A66C2' },
  ];

  const styles = {
    container: {
      maxWidth: '1250px',
      margin: '0 auto',
      padding: '48px 16px',
      fontFamily: "'Be Vietnam Pro', Arial, Helvetica, sans-serif",
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '48px',
      fontFamily: "'Be Vietnam Pro', Arial, Helvetica, sans-serif",
    },
    title: {
      fontSize: '36px',
      fontWeight: 'bold' as const,
      color: colors.text,
      marginBottom: '16px',
      fontFamily: "'Be Vietnam Pro', Arial, Helvetica, sans-serif",
      letterSpacing: "0.5px",
    },
    subtitle: {
      fontSize: '18px',
      color: colors.textLight,
      maxWidth: '600px',
      margin: '0 auto',
      fontFamily: "'Be Vietnam Pro', Arial, Helvetica, sans-serif",
    },
    content: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '32px',
      fontFamily: "'Be Vietnam Pro', Arial, Helvetica, sans-serif",
      marginBottom: '32px',
      '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr',
      },
    },
    contactInfo: {
      display: 'grid',
      gap: '16px',
      fontFamily: "'Be Vietnam Pro', Arial, Helvetica, sans-serif",
    },
    infoCard: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px', // tăng spacing giữa icon và text
      padding: '28px',
      backgroundColor: colors.background,
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      fontFamily: "'Be Vietnam Pro', Arial, Helvetica, sans-serif",
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      },
    },
    infoIcon: {
      width: '48px',
      height: '48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.backgroundAlt,
      borderRadius: '12px',
      color: colors.primary,
      fontSize: '24px',
      fontFamily: "'Be Vietnam Pro', Arial, Helvetica, sans-serif",
    },
    infoContent: {
      flex: 1,
      fontFamily: "'Be Vietnam Pro', Arial, Helvetica, sans-serif",
    },
    infoTitle: {
      fontSize: '18px',
      fontWeight: 'bold' as const,
      color: colors.text,
      marginBottom: '4px',
      fontFamily: "'Be Vietnam Pro', Arial, Helvetica, sans-serif",
    },
    infoText: {
      color: colors.textLight,
      textDecoration: 'none',
      fontFamily: "'Be Vietnam Pro', Arial, Helvetica, sans-serif",
    },
    form: {
      backgroundColor: colors.background,
      padding: '36px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      fontFamily: "'Be Vietnam Pro', Arial, Helvetica, sans-serif",
    },
    formGroup: {
      marginBottom: '28px', // tăng spacing giữa các trường
      fontFamily: "'Be Vietnam Pro', Arial, Helvetica, sans-serif",
    },
    label: {
      display: 'block',
      marginBottom: '10px',
      color: colors.text,
      fontWeight: 'bold' as const,
      fontFamily: "'Be Vietnam Pro', Arial, Helvetica, sans-serif",
    },
    input: {
      width: '100%',
      padding: '14px',
      border: `1px solid ${colors.border}`,
      borderRadius: '8px',
      fontSize: '16px',
      transition: 'all 0.2s',
      fontFamily: "'Be Vietnam Pro', Arial, Helvetica, sans-serif",
      '&:focus': {
        outline: 'none',
        borderColor: colors.primary,
      },
    },
    textarea: {
      width: '100%',
      padding: '14px',
      border: `1px solid ${colors.border}`,
      borderRadius: '8px',
      fontSize: '16px',
      minHeight: '150px',
      resize: 'vertical' as const,
      transition: 'all 0.2s',
      fontFamily: "'Be Vietnam Pro', Arial, Helvetica, sans-serif",
      '&:focus': {
        outline: 'none',
        borderColor: colors.primary,
      },
    },
    submitButton: {
      width: '100%',
      padding: '16px',
      backgroundColor: colors.primary,
      color: colors.background,
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold' as const,
      cursor: 'pointer',
      transition: 'all 0.2s',
      fontFamily: "'Be Vietnam Pro', Arial, Helvetica, sans-serif",
      marginTop: "8px",
      '&:hover': {
        backgroundColor: colors.primaryHover,
      },
    },
    socialLinks: {
      display: 'flex',
      justifyContent: 'center',
      gap: '20px', // tăng spacing giữa các icon
      marginTop: '40px',
      fontFamily: "'Be Vietnam Pro', Arial, Helvetica, sans-serif",
    },
    socialLink: {
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      backgroundColor: colors.backgroundAlt,
      color: colors.text,
      fontSize: '20px',
      transition: 'all 0.3s ease',
      fontFamily: "'Be Vietnam Pro', Arial, Helvetica, sans-serif",
      '&:hover': {
        transform: 'translateY(-4px)',
      },
    },
    notification: {
      position: 'fixed' as const,
      top: '24px',
      right: '24px',
      padding: '16px 24px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      zIndex: 1000,
      animation: 'slideIn 0.3s ease-out',
      backgroundColor: (notification.type === 'success' ? colors.success : '#EF4444'),
      color: colors.background,
      fontFamily: "'Be Vietnam Pro', Arial, Helvetica, sans-serif",
    },
    notificationIcon: {
      fontSize: '20px',
      fontFamily: "'Be Vietnam Pro', Arial, Helvetica, sans-serif",
    },
    notificationText: {
      fontSize: '14px',
      fontWeight: 'bold' as const,
      fontFamily: "'Be Vietnam Pro', Arial, Helvetica, sans-serif",
    },
    loadingSpinner: {
      animation: 'spin 1s linear infinite',
      fontFamily: "'Be Vietnam Pro', Arial, Helvetica, sans-serif",
    },
    '@keyframes slideIn': {
      from: {
        transform: 'translateX(100%)',
        opacity: 0,
      },
      to: {
        transform: 'translateX(0)',
        opacity: 1,
      },
    },
    '@keyframes spin': {
      from: {
        transform: 'rotate(0deg)',
      },
      to: {
        transform: 'rotate(360deg)',
      },
    },
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({
      show: true,
      type,
      message,
    });

    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      showNotification('success', 'Gửi tin nhắn thành công!');
    } catch (error) {
      showNotification('error', 'Gửi tin nhắn thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={styles.container}>
      {notification.show && (
        <div style={styles.notification}>
          {notification.type === 'success' ? (
            <FaCheckCircle style={styles.notificationIcon} />
          ) : (
            <FaExclamationCircle style={styles.notificationIcon} />
          )}
          <span style={styles.notificationText}>{notification.message}</span>
        </div>
      )}

      <div style={styles.header}>
        <h1 style={styles.title}>Liên hệ với chúng tôi</h1>
        <p style={styles.subtitle}>
          Có thắc mắc về dịch vụ? Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7.
        </p>
      </div>

      <div style={styles.content}>
        <div style={styles.contactInfo}>
          {contactInfo.map((info, index) => (
            <a
              key={index}
              href={info.link || '#'}
              style={{ ...styles.infoCard, textDecoration: 'none' }}
              target={info.link ? '_blank' : undefined}
              rel="noopener noreferrer"
            >
              <div style={styles.infoIcon}>{info.icon}</div>
              <div style={styles.infoContent}>
                <h3 style={styles.infoTitle}>{info.title}</h3>
                <p style={styles.infoText}>{info.content}</p>
              </div>
            </a>
          ))}
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="name">Họ và tên</label>
            <input
              type="text"
              id="name"
              name="name"
              style={styles.input}
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="email">Địa chỉ Email</label>
            <input
              type="email"
              id="email"
              name="email"
              style={styles.input}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="subject">Chủ đề</label>
            <input
              type="text"
              id="subject"
              name="subject"
              style={styles.input}
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="message">Nội dung</label>
            <textarea
              id="message"
              name="message"
              style={styles.textarea}
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            style={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FaSpinner style={{ ...styles.notificationIcon, ...styles.loadingSpinner }} />
                Đang gửi...
              </>
            ) : (
              'Gửi tin nhắn'
            )}
          </button>
        </form>
      </div>

      <div style={styles.socialLinks}>
        {socialLinks.map((social, index) => (
          <a
            key={index}
            href={social.link}
            style={{ ...styles.socialLink, color: social.color }}
            target="_blank"
            rel="noopener noreferrer"
          >
            {social.icon}
          </a>
        ))}
      </div>
    </div>
  );
};

export default Contact;