import dummyAddresses from './dummy/addresses.json';

const API_BASE_URL = 'http://localhost:3000';

// Define the address interface
export interface Address {
    id: string;
    userId: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
}

/**
 * Fetches addresses from the server
 * @param accessToken The user's access token
 * @returns Promise that resolves to an array of addresses
 */
export const fetchAddresses = async (accessToken: string): Promise<Address[]> => {
    if (!accessToken) {
        throw new Error('No authentication token available. Please log in.');
    }

    try {
        // For now, use dummy data since the API is not ready
        // When the API is ready, uncomment this code
        /*
        const response = await fetch(`${API_BASE_URL}/user/addresses`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Authentication token expired. Please log in again.');
            }
            throw new Error('Failed to fetch addresses');
        }
        
        const result = await response.json();
        return result.data;
        */
        
        // Return dummy data for now
        return dummyAddresses as Address[];
    } catch (error) {
        console.error('Error fetching addresses:', error);
        throw error;
    }
};

/**
 * Saves an address to the server
 * @param address The address to save
 * @param accessToken The user's access token
 * @returns Promise that resolves to the saved address
 */
export const saveAddress = async (address: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>, accessToken: string): Promise<Address> => {
    if (!accessToken) {
        throw new Error('No authentication token available. Please log in.');
    }

    try {
        // For now, simulate saving to the server
        // When the API is ready, uncomment this code
        /*
        const response = await fetch(`${API_BASE_URL}/user/addresses`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(address)
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Authentication token expired. Please log in again.');
            }
            throw new Error('Failed to save address');
        }
        
        const result = await response.json();
        return result.data;
        */
        
        // Simulate saving to the server
        const newAddress: Address = {
            id: Math.random().toString(36).substring(2, 9),
            userId: 'user123', // This would come from the server
            ...address,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        return newAddress;
    } catch (error) {
        console.error('Error saving address:', error);
        throw error;
    }
};

/**
 * Updates an address on the server
 * @param addressId The ID of the address to update
 * @param address The updated address data
 * @param accessToken The user's access token
 * @returns Promise that resolves to the updated address
 */
export const updateAddress = async (addressId: string, address: Partial<Address>, accessToken: string): Promise<Address> => {
    if (!accessToken) {
        throw new Error('No authentication token available. Please log in.');
    }

    try {
        // For now, simulate updating on the server
        // When the API is ready, uncomment this code
        /*
        const response = await fetch(`${API_BASE_URL}/user/addresses/${addressId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(address)
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Authentication token expired. Please log in again.');
            }
            throw new Error('Failed to update address');
        }
        
        const result = await response.json();
        return result.data;
        */
        
        // Simulate updating on the server
        const updatedAddress: Address = {
            id: addressId,
            userId: 'user123', // This would come from the server
            street: address.street || '',
            city: address.city || '',
            state: address.state || '',
            postalCode: address.postalCode || '',
            country: address.country || '',
            isDefault: address.isDefault || false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        return updatedAddress;
    } catch (error) {
        console.error('Error updating address:', error);
        throw error;
    }
};

/**
 * Deletes an address from the server
 * @param addressId The ID of the address to delete
 * @param accessToken The user's access token
 * @returns Promise that resolves to true if successful
 */
export const deleteAddress = async (addressId: string, accessToken: string): Promise<boolean> => {
    if (!accessToken) {
        throw new Error('No authentication token available. Please log in.');
    }

    try {
        // For now, simulate deleting from the server
        // When the API is ready, uncomment this code
        /*
        const response = await fetch(`${API_BASE_URL}/user/addresses/${addressId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Authentication token expired. Please log in again.');
            }
            throw new Error('Failed to delete address');
        }
        
        return true;
        */
        
        // Simulate deleting from the server
        return true;
    } catch (error) {
        console.error('Error deleting address:', error);
        throw error;
    }
};

/**
 * Sets an address as the default address
 * @param addressId The ID of the address to set as default
 * @param accessToken The user's access token
 * @returns Promise that resolves to the updated address
 */
export const setDefaultAddress = async (addressId: string, accessToken: string): Promise<Address> => {
    if (!accessToken) {
        throw new Error('No authentication token available. Please log in.');
    }

    try {
        // For now, simulate setting default on the server
        // When the API is ready, uncomment this code
        /*
        const response = await fetch(`${API_BASE_URL}/user/addresses/${addressId}/default`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Authentication token expired. Please log in again.');
            }
            throw new Error('Failed to set default address');
        }
        
        const result = await response.json();
        return result.data;
        */
        
        // Simulate setting default on the server
        const defaultAddress: Address = {
            id: addressId,
            userId: 'user123', // This would come from the server
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            postalCode: '10001',
            country: 'USA',
            isDefault: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        return defaultAddress;
    } catch (error) {
        console.error('Error setting default address:', error);
        throw error;
    }
}; 