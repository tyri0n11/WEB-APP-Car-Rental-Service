import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaSpinner, FaTimes, FaTimesCircle } from 'react-icons/fa';

interface NotificationProps {
  show: boolean;
  type: 'success' | 'error' | 'loading';
  message: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ show, type, message, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      if (type !== 'loading') {
        const timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }, 4000);
        return () => clearTimeout(timer);
      }
    }
  }, [show, onClose, type]);

  const overlayVariants = {
    hidden: { 
      opacity: 0,
      backdropFilter: 'blur(0px)'
    },
    visible: { 
      opacity: 1,
      backdropFilter: 'blur(8px)',
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      backdropFilter: 'blur(0px)',
      transition: { 
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  const notificationVariants = {
    hidden: { 
      y: -50,
      opacity: 0,
      scale: 0.9,
      rotateX: 45
    },
    visible: { 
      y: 0,
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
        mass: 1.5
      }
    },
    exit: { 
      y: -50,
      opacity: 0,
      scale: 0.9,
      rotateX: 45,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const iconVariants = {
    hidden: { 
      scale: 0.5,
      opacity: 0,
      rotate: -180
    },
    visible: { 
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 25,
        delay: 0.1
      }
    }
  };

  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        ease: "linear",
        repeat: Infinity
      }
    }
  };

  const progressVariants = {
    hidden: { width: "100%", opacity: 0 },
    visible: { 
      width: "0%",
      opacity: 1,
      transition: { 
        duration: 5,
        ease: "linear",
        opacity: { duration: 0.3 }
      }
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return '#22C55E';
      case 'error':
        return '#EF4444';
      case 'loading':
        return '#3B82F6';
      default:
        return '#22C55E';
    }
  };

  const getIconBackground = () => {
    switch (type) {
      case 'success':
        return 'rgba(34, 197, 94, 0.15)';
      case 'error':
        return 'rgba(239, 68, 68, 0.15)';
      case 'loading':
        return 'rgba(59, 130, 246, 0.15)';
      default:
        return 'rgba(34, 197, 94, 0.15)';
    }
  };

  const getIconGlow = () => {
    switch (type) {
      case 'success':
        return '0 0 0 8px rgba(34, 197, 94, 0.08)';
      case 'error':
        return '0 0 0 8px rgba(239, 68, 68, 0.08)';
      case 'loading':
        return '0 0 0 8px rgba(59, 130, 246, 0.08)';
      default:
        return '0 0 0 8px rgba(34, 197, 94, 0.08)';
    }
  };

  const styles = {
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      zIndex: 9999,
      perspective: '1000px'
    },
    container: {
      backgroundColor: '#FFFFFF',
      padding: '28px 32px',
      borderRadius: '20px',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '20px',
      maxWidth: '400px',
      width: '90%',
      position: 'relative' as const,
      marginTop: '32px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      transformOrigin: 'top',
      overflow: 'hidden'
    },
    iconWrapper: {
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: getIconBackground(),
      boxShadow: getIconGlow()
    },
    icon: {
      fontSize: '28px',
      color: getIconColor(),
    },
    message: {
      margin: 0,
      fontSize: '16px',
      color: '#1E293B',
      textAlign: 'center' as const,
      fontWeight: 500,
      lineHeight: 1.5,
      maxWidth: '300px'
    },
    closeButton: {
      position: 'absolute' as const,
      top: '12px',
      right: '12px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '8px',
      color: '#94A3B8',
      display: type === 'loading' ? 'none' : 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        color: '#1E293B',
      },
    },
    progressBar: {
      position: 'absolute' as const,
      bottom: 0,
      left: 0,
      height: '3px',
      backgroundColor: getIconColor(),
      opacity: 0.8,
    },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          style={styles.overlay}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            style={styles.container}
            variants={notificationVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div 
              style={styles.iconWrapper}
              variants={iconVariants}
              initial="hidden"
              animate="visible"
            >
              {type === 'loading' ? (
                <motion.div
                  variants={spinnerVariants}
                  animate="animate"
                  style={styles.icon}
                >
                  <FaSpinner />
                </motion.div>
              ) : type === 'success' ? (
                <FaCheckCircle style={styles.icon} />
              ) : (
                <FaTimesCircle style={styles.icon} />
              )}
            </motion.div>
            <p style={styles.message}>{message}</p>
            {type !== 'loading' && (
              <button
                style={styles.closeButton}
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(onClose, 500);
                }}
                aria-label="Close notification"
              >
                <FaTimes />
              </button>
            )}
            {type !== 'loading' && (
              <motion.div
                style={styles.progressBar}
                variants={progressVariants}
                initial="hidden"
                animate="visible"
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification; 
