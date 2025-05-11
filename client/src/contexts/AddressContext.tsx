'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import type { Address, AddressInput, AddressContextValue, AddressContextState } from '../types/address'

const API_BASE_URL = 'http://localhost:3000'

const AddressContext = createContext<AddressContextValue | undefined>(undefined)

export function AddressProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AddressContextState>({
        addresses: [],
        isLoading: false,
        error: null
    })

    const fetchAddresses = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true, error: null }))
        try {
            const response = await fetch(`${API_BASE_URL}/user/addresses`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                }
            })
            
            if (!response.ok) {
                if (response.status === 401) throw new Error('Authentication token expired. Please log in again.')
                throw new Error('Failed to fetch addresses')
            }
            
            const result = await response.json()
            setState(prev => ({ ...prev, addresses: result.data, isLoading: false }))
        } catch (error) {
            setState(prev => ({ 
                ...prev, 
                error: error instanceof Error ? error : new Error('An unknown error occurred'), 
                isLoading: false 
            }))
        }
    }, [])

    const saveAddress = useCallback(async (address: AddressInput): Promise<Address> => {
        try {
            const response = await fetch(`${API_BASE_URL}/user/addresses`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(address)
            })
            
            if (!response.ok) {
                if (response.status === 401) throw new Error('Authentication token expired. Please log in again.')
                throw new Error('Failed to save address')
            }
            
            const result = await response.json()
            setState(prev => ({ ...prev, addresses: [...prev.addresses, result.data] }))
            return result.data
        } catch (error) {
            throw error instanceof Error ? error : new Error('An unknown error occurred')
        }
    }, [])

    const updateAddress = useCallback(async (addressId: string, address: Partial<AddressInput>): Promise<Address> => {
        try {
            const response = await fetch(`${API_BASE_URL}/user/addresses/${addressId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(address)
            })
            
            if (!response.ok) {
                if (response.status === 401) throw new Error('Authentication token expired. Please log in again.')
                throw new Error('Failed to update address')
            }
            
            const result = await response.json()
            setState(prev => ({
                ...prev,
                addresses: prev.addresses.map(addr => 
                    addr.id === addressId ? result.data : addr
                )
            }))
            return result.data
        } catch (error) {
            throw error instanceof Error ? error : new Error('An unknown error occurred')
        }
    }, [])

    const deleteAddress = useCallback(async (addressId: string): Promise<boolean> => {
        try {
            const response = await fetch(`${API_BASE_URL}/user/addresses/${addressId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                }
            })
            
            if (!response.ok) {
                if (response.status === 401) throw new Error('Authentication token expired. Please log in again.')
                throw new Error('Failed to delete address')
            }
            
            setState(prev => ({
                ...prev,
                addresses: prev.addresses.filter(addr => addr.id !== addressId)
            }))
            return true
        } catch (error) {
            throw error instanceof Error ? error : new Error('An unknown error occurred')
        }
    }, [])

    const setDefaultAddress = useCallback(async (addressId: string): Promise<Address> => {
        try {
            const response = await fetch(`${API_BASE_URL}/user/addresses/${addressId}/default`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                }
            })
            
            if (!response.ok) {
                if (response.status === 401) throw new Error('Authentication token expired. Please log in again.')
                throw new Error('Failed to set default address')
            }
            
            const result = await response.json()
            setState(prev => ({
                ...prev,
                addresses: prev.addresses.map(addr => ({
                    ...addr,
                    isDefault: addr.id === addressId
                }))
            }))
            return result.data
        } catch (error) {
            throw error instanceof Error ? error : new Error('An unknown error occurred')
        }
    }, [])

    const value = {
        ...state,
        fetchAddresses,
        saveAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress
    }

    return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>
}

export function useAddress() {
    const context = useContext(AddressContext)
    if (context === undefined) {
        throw new Error('useAddress must be used within an AddressProvider')
    }
    return context
}

export default AddressContext 