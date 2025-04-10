import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { useNotification } from './NotificationContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: 'user' | 'admin';
  isEmailVerified: boolean;
  drivingLicenceId?: {
    id: string;
    licenceNumber: string;
    drivingLicenseImages: string[];
    expiryDate: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_ACCESS_TOKEN'; payload: string }
  | { type: 'SET_REFRESH_TOKEN'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGOUT' };

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignUpData) => Promise<void>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  verifyAccount: (token: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem('access_token'),
  refreshToken: localStorage.getItem('refresh_token'),
  loading: false,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, error: null };
    case 'SET_ACCESS_TOKEN':
      localStorage.setItem('access_token', action.payload);
      return { ...state, accessToken: action.payload, error: null };
    case 'SET_REFRESH_TOKEN':
      localStorage.setItem('refresh_token', action.payload);
      return { ...state, refreshToken: action.payload, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'LOGOUT':
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      return { ...state, user: null, accessToken: null, refreshToken: null, error: null };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { showNotification } = useNotification();

  const fetchUser = useCallback(async () => {
    if (!state.accessToken) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${state.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const user = await response.json();
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch user data' });
      showNotification('error', 'Failed to fetch user data');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.accessToken, showNotification]);

  const refreshAccessToken = useCallback(async () => {
    if (!state.refreshToken) {
      dispatch({ type: 'LOGOUT' });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: state.refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const { accessToken, refreshToken } = await response.json();
      dispatch({ type: 'SET_ACCESS_TOKEN', payload: accessToken });
      dispatch({ type: 'SET_REFRESH_TOKEN', payload: refreshToken });
    } catch (error) {
      dispatch({ type: 'LOGOUT' });
      showNotification('error', 'Session expired. Please login again.');
    }
  }, [state.refreshToken, showNotification]);

  useEffect(() => {
    if (state.accessToken) {
      fetchUser();
    }
  }, [state.accessToken, fetchUser]);

  useEffect(() => {
    const interval = setInterval(refreshAccessToken, 14 * 60 * 1000); // Refresh every 14 minutes
    return () => clearInterval(interval);
  }, [refreshAccessToken]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const { accessToken, refreshToken } = await response.json();
      dispatch({ type: 'SET_ACCESS_TOKEN', payload: accessToken });
      dispatch({ type: 'SET_REFRESH_TOKEN', payload: refreshToken });
      showNotification('success', 'Login successful');
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Invalid credentials' });
      showNotification('error', 'Invalid credentials');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [showNotification]);

  const signup = useCallback(async (userData: SignUpData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to sign up');
      }

      showNotification('success', 'Sign up successful. Please check your email to verify your account.');
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to sign up' });
      showNotification('error', 'Failed to sign up');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [showNotification]);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
    showNotification('success', 'Logged out successfully');
  }, [showNotification]);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    if (!state.accessToken) {
      throw new Error('Authentication required');
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state.accessToken}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        throw new Error('Failed to change password');
      }

      showNotification('success', 'Password changed successfully');
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to change password' });
      showNotification('error', 'Failed to change password');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.accessToken, showNotification]);

  const forgotPassword = useCallback(async (email: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch(`${API_BASE_URL}/auth/email/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send reset password email');
      }

      showNotification('success', 'Reset password instructions sent to your email');
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to send reset password email' });
      showNotification('error', 'Failed to send reset password email');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [showNotification]);

  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      if (!response.ok) {
        throw new Error('Failed to reset password');
      }

      showNotification('success', 'Password reset successfully');
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to reset password' });
      showNotification('error', 'Failed to reset password');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [showNotification]);

  const verifyAccount = useCallback(async (token: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch(`${API_BASE_URL}/auth/verify-account?token=${token}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to verify account');
      }

      showNotification('success', 'Account verified successfully');
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to verify account' });
      showNotification('error', 'Failed to verify account');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [showNotification]);

  const sendVerificationEmail = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch(`${API_BASE_URL}/auth/email/verify-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: state.user?.email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send verification email');
      }

      showNotification('success', 'Verification email sent successfully');
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to send verification email' });
      showNotification('error', 'Failed to send verification email');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.user?.email, showNotification]);

  const updateProfile = async (userData: Partial<User>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await fetch('/api/user/update-profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state.accessToken}`
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      dispatch({ type: 'SET_USER', payload: updatedUser });
      showNotification('success', 'Profile updated successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      showNotification('error', errorMessage);
      throw err;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        loading: state.loading,
        error: state.error,
        login,
        signup,
        logout,
        changePassword,
        forgotPassword,
        resetPassword,
        verifyAccount,
        sendVerificationEmail,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
