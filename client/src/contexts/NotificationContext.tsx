import React, { createContext, useCallback, useContext, useState } from 'react';
import Notification from '../components/common/Notification';

type NotificationType = 'success' | 'error' | 'loading';

interface NotificationContextType {
  showNotification: (type: NotificationType, message: string) => void;
  hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [show, setShow] = useState(false);
  const [type, setType] = useState<NotificationType>('success');
  const [message, setMessage] = useState('');

  const showNotification = useCallback((newType: NotificationType, newMessage: string) => {
    // Nếu đang hiển thị notification, đóng nó trước
    if (show) {
      setShow(false);
      setTimeout(() => {
        setType(newType);
        setMessage(newMessage);
        setShow(true);
      }, 500);
    } else {
      setType(newType);
      setMessage(newMessage);
      setShow(true);
    }
  }, [show]);

  const hideNotification = useCallback(() => {
    setShow(false);
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      <Notification
        show={show}
        type={type === 'loading' ? 'success' : type}
        message={message}
        onClose={hideNotification}
      />
    </NotificationContext.Provider>
  );
};

export const useNotificationWithState = () => {
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const handleAsync = async <T,>(
    asyncFn: () => Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ): Promise<T | undefined> => {
    try {
      setIsLoading(true);
      showNotification('loading', messages.loading);
      const result = await asyncFn();
      showNotification('success', messages.success);
      return result;
    } catch (error) {
      showNotification('error', messages.error);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleAsync
  };
}; 