import React from 'react';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const styles = {
    container: {
      minHeight: 'calc(100vh - 80px)', // Subtract header height
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      textAlign: 'center' as const,
      backgroundColor: '#F8FAFC',
    },
    icon: {
      fontSize: '64px',
      color: '#EF4444',
      marginBottom: '24px',
    },
    title: {
      fontSize: '48px',
      fontWeight: 'bold' as const,
      color: '#1E293B',
      marginBottom: '16px',
    },
    message: {
      fontSize: '20px',
      color: '#64748B',
      marginBottom: '32px',
      maxWidth: '600px',
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '16px 32px',
      backgroundColor: '#1E3A8A',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold' as const,
      cursor: 'pointer',
      transition: 'all 0.2s',
      '&:hover': {
        backgroundColor: '#2563EB',
      },
    },
    homeIcon: {
      fontSize: '20px',
    },
  };

  return (
    <div style={styles.container}>
      <FaExclamationTriangle style={styles.icon} />
      <h1 style={styles.title}>404 - Page Not Found</h1>
      <p style={styles.message}>
        Sorry, the page you are looking for does not exist or has been moved.
        Please check the URL or return to homepage.
      </p>
      <button 
        style={styles.button}
        onClick={() => navigate('/')}
      >
        <FaHome style={styles.homeIcon} />
        Back to Home
      </button>
    </div>
  );
};

export default NotFound; 