'use client'

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import type { UpdateProfileInput, UpdateDrivingLicenseInput, UserContextValue } from '../types/user'
import { userApi } from '../apis/user'
import { useAuth } from './AuthContext'

const initialState: Omit<UserContextValue, 'updateProfile' | 'updateDrivingLicense' | 'deleteAccount' | 'getUser'> = {
    user: null,
    isLoading: false,
    error: null
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState(initialState)
    const { user: authUser, logout } = useAuth()

    useEffect(() => {
        if (authUser && authUser.id) { // Add a check for authUser.id
            setState(prev => ({ ...prev, isLoading: true, error: null })); // Set loading and clear error
            userApi.getUser(authUser.id)
                .then(detailedUser => {
                    setState(prev => ({
                        ...prev,
                        user: detailedUser,
                        isLoading: false,
                        error: null
                    }))
                })
                .catch(error => {
                    setState(prev => ({
                        ...prev,
                        user: null,
                        error: error instanceof Error ? error.message : 'An error occurred',
                        isLoading: false
                    }))
                })
        } else if (!authUser) { // If authUser becomes null (e.g., after logout)
            setState(prev => ({ // Clear user details from UserContext
                ...prev,
                user: null,
                isLoading: false,
                error: null
            }));
        }
    }, [authUser])

    const updateProfile = useCallback(async (input: UpdateProfileInput) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }))
            const user = await userApi.updateProfile(input)
            setState(prev => ({
                ...prev,
                user,
                isLoading: false
            }))
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'An error occurred',
                isLoading: false
            }))
            throw error
        }
    }, [])

    const updateDrivingLicense = useCallback(async (input: UpdateDrivingLicenseInput) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }))
            const user = await userApi.updateDrivingLicense(input)
            setState(prev => ({
                ...prev,
                user,
                isLoading: false
            }))
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'An error occurred',
                isLoading: false
            }))
            throw error
        }
    }, [])

    const deleteAccount = useCallback(async () => {
        if (!authUser) return
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }))
            await userApi.deleteAccount(authUser.id)
            await logout()
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'An error occurred',
                isLoading: false
            }))
            throw error
        }
    }, [authUser, logout])

    const getUser = useCallback(async (id: string) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }))
            const user = await userApi.getUser(id)
            setState(prev => ({
                ...prev,
                user,
                isLoading: false
            }))
            return user
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'An error occurred',
                isLoading: false
            }))
            throw error
        }
    }, [])

    const value = {
        ...state,
        updateProfile,
        updateDrivingLicense,
        deleteAccount,
        getUser
    }

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}

export default UserContext