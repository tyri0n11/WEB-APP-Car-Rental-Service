import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export interface Address {
    id: string;
    userId: string;
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
}

interface AddressContextType {
    addresses: Address[];
    loading: boolean;
    error: string | null;
    fetchAddresses: () => Promise<void>;
    addAddress: (addressData: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<Address>;
    updateAddress: (id: string, addressData: Partial<Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>) => Promise<Address>;
    deleteAddress: (id: string) => Promise<void>;
    setDefaultAddress: (id: string) => Promise<void>;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const useAddress = (): AddressContextType => {
    const context = useContext(AddressContext);
    if (!context) {
        throw new Error('useAddress must be used within an AddressProvider');
    }
    return context;
};

interface AddressProviderProps {
    children: React.ReactNode;
}

export const AddressProvider: React.FC<AddressProviderProps> = ({ children }) => {
    const { accessToken } = useAuth();
    const { showNotification } = useNotification();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAddresses = useCallback(async () => {
        if (!accessToken) return;

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${API_BASE_URL}/addresses`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch addresses');
            }

            const data = await response.json();
            setAddresses(data);
        } catch (error) {
            setError('Failed to fetch addresses');
            showNotification('error', 'Failed to fetch addresses');
        } finally {
            setLoading(false);
        }
    }, [accessToken, showNotification]);

    const addAddress = useCallback(async (addressData: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Address> => {
        if (!accessToken) {
            throw new Error('Authentication required');
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${API_BASE_URL}/addresses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(addressData),
            });

            if (!response.ok) {
                throw new Error('Failed to add address');
            }

            const address = await response.json();
            setAddresses(prev => [...prev, address]);
            showNotification('success', 'Address added successfully');
            return address;
        } catch (error) {
            setError('Failed to add address');
            showNotification('error', 'Failed to add address');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [accessToken, showNotification]);

    const updateAddress = useCallback(async (id: string, addressData: Partial<Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<Address> => {
        if (!accessToken) {
            throw new Error('Authentication required');
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${API_BASE_URL}/addresses/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(addressData),
            });

            if (!response.ok) {
                throw new Error('Failed to update address');
            }

            const address = await response.json();
            setAddresses(prev => prev.map(addr => 
                addr.id === id ? address : addr
            ));
            showNotification('success', 'Address updated successfully');
            return address;
        } catch (error) {
            setError('Failed to update address');
            showNotification('error', 'Failed to update address');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [accessToken, showNotification]);

    const deleteAddress = useCallback(async (id: string) => {
        if (!accessToken) {
            throw new Error('Authentication required');
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${API_BASE_URL}/addresses/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete address');
            }

            setAddresses(prev => prev.filter(addr => addr.id !== id));
            showNotification('success', 'Address deleted successfully');
        } catch (error) {
            setError('Failed to delete address');
            showNotification('error', 'Failed to delete address');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [accessToken, showNotification]);

    const setDefaultAddress = useCallback(async (id: string) => {
        if (!accessToken) {
            throw new Error('Authentication required');
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${API_BASE_URL}/addresses/${id}/default`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to set default address');
            }

            setAddresses(prev => prev.map(addr => ({
                ...addr,
                isDefault: addr.id === id,
            })));
            showNotification('success', 'Default address updated successfully');
        } catch (error) {
            setError('Failed to set default address');
            showNotification('error', 'Failed to set default address');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [accessToken, showNotification]);

    return (
        <AddressContext.Provider
            value={{
                addresses,
                loading,
                error,
                fetchAddresses,
                addAddress,
                updateAddress,
                deleteAddress,
                setDefaultAddress,
            }}
        >
            {children}
        </AddressContext.Provider>
    );
}; 