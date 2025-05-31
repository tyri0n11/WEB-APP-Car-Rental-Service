import React, { createContext, useState, useCallback, useEffect, ReactNode } from 'react'
import type { AuthContextValue, LoginInput, SignupInput } from '../types/auth' // Removed unused User import
import { authApi } from '../apis/auth'

const initialState: Omit<AuthContextValue, 'login' | 'signup' | 'logout' | 'refreshToken' | 'forgotPassword' | 'resetPassword' | 'verifyEmail' | 'resendVerificationEmail' | 'changePassword'> = {
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState(initialState)

    const checkAuth = useCallback(async () => {
        try {
            const token = localStorage.getItem('accessToken')
            if (!token) {
                setState(prev => ({ ...prev, loading: false, isAuthenticated: false }))
                return
            }

            const user = await authApi.getMe()
            setState(prev => ({
                ...prev,
                user,
                loading: false,
                isAuthenticated: true
            }))
        } catch (error) {
            localStorage.removeItem('accessToken')
            setState(prev => ({
                ...prev,
                user: null,
                loading: false,
                isAuthenticated: false,
                error: error instanceof Error ? error.message.toString() : 'An error occurred'
            }))
        }
    }, [])

    useEffect(() => {
        checkAuth()
    }, [checkAuth])

    const login = useCallback(async (input: LoginInput) => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }))
            const { accessToken, user } = await authApi.login(input)
            localStorage.setItem('accessToken', accessToken)
            setState(prev => ({
                ...prev,
                user,
                loading: false,
                isAuthenticated: true,
                error: null // Clear any previous error
            }))
        } catch (error) {
            setState(prev => ({
                ...prev,
                user: null, // Ensure user is null on login failure
                isAuthenticated: false,
                error: error instanceof Error ? error.message : 'An error occurred',
                loading: false
            }))
            throw error
        }
    }, [])

    const signup = useCallback(async (input: SignupInput) => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }))
            await authApi.signup(input)
            setState(prev => ({ ...prev, loading: false }))
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'An error occurred',
                loading: false
            }))
            throw error
        }
    }, [])

    const logout = useCallback(async () => {
        localStorage.removeItem('accessToken')
        setState(prev => ({
            ...prev,
            user: null,
            isAuthenticated: false
        }))
    }, [])

    const refreshToken = useCallback(async () => {
        try {
            const { accessToken } = await authApi.refreshToken()
            localStorage.setItem('accessToken', accessToken)
        } catch (error) {
            localStorage.removeItem('accessToken')
            setState(prev => ({
                ...prev,
                user: null,
                isAuthenticated: false
            }))
            throw error
        }
    }, [])

    const forgotPassword = useCallback(async (email: string) => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }))
            await authApi.forgotPassword(email)
            setState(prev => ({ ...prev, loading: false }))
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'An error occurred',
                loading: false
            }))
            throw error
        }
    }, [])

    const resetPassword = useCallback(async (token: string, password: string) => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }))
            await authApi.resetPassword(token, password)
            setState(prev => ({ ...prev, loading: false }))
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'An error occurred',
                loading: false
            }))
            throw error
        }
    }, [])

    const verifyEmail = useCallback(async (token: string) => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }))
            await authApi.verifyEmail(token)
            setState(prev => ({ ...prev, loading: false }))
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'An error occurred',
                loading: false
            }))
            throw error
        }
    }, [])

    const resendVerificationEmail = useCallback(async (email: string) => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }))
            await authApi.resendVerificationEmail(email)
            setState(prev => ({ ...prev, loading: false }))
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'An error occurred',
                loading: false
            }))
            throw error
        }
    }, [])

    const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }))
            await authApi.changePassword(currentPassword, newPassword)
            setState(prev => ({ ...prev, loading: false }))
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'An error occurred',
                loading: false
            }))
            throw error
        }
    }, [])

    const value = {
        ...state,
        login,
        signup,
        logout,
        refreshToken,
        forgotPassword,
        resetPassword,
        verifyEmail,
        resendVerificationEmail,
        changePassword
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
