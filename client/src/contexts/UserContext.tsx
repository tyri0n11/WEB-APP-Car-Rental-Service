import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

const API_BASE_URL = 'http://localhost:3000';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    drivingLicenceId?: {
        licenceNumber: string;
        drivingLicenseImages: string[];
        expiryDate: string;
    };
    profileImage?: string;
}

interface UserContextType {
    user: User | null;
    updateUser: (userData: Partial<User>) => Promise<User>;
    uploadImage: (file: File, type?: string) => Promise<string>;
    validateFormData: (formData: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
        email?: string;
    }) => Record<string, string> | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const { accessToken } = useAuth();
    const [user, setUser] = useState<User | null>(null);

    const uploadImage = async (file: File, type?: string): Promise<string> => {
        if (!accessToken) {
            throw new Error('No authentication token available. Please log in.');
        }

        const formData = new FormData();
        formData.append('file', file);
        if (type) {
            formData.append('type', type);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/image/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: formData,
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Authentication token expired. Please log in again.');
                }
                if (response.status === 429) {
                    throw new Error('Server is busy. Please try again in a few moments.');
                }
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to upload image');
            }

            const result = await response.json();
            const imageUrl = result?.data?.link || result?.data?.imageUrl || result?.imageUrl || result?.url;

            if (!imageUrl) {
                throw new Error('Invalid response format from image upload');
            }

            return imageUrl;
        } catch (error) {
            console.error('Image upload error:', error);
            throw error;
        }
    };

    const updateUser = async (userData: Partial<User>): Promise<User> => {
        if (!accessToken || !user?.id) {
            throw new Error('No authentication token available or user not found. Please log in.');
        }

        try {
            const updatePayload = {
                firstName: userData.firstName,
                lastName: userData.lastName,
                phoneNumber: userData.phoneNumber,
                drivingLicence: userData.drivingLicenceId ? {
                    licenceNumber: userData.drivingLicenceId.licenceNumber,
                    drivingLicenseImages: userData.drivingLicenceId.drivingLicenseImages,
                    expiryDate: userData.drivingLicenceId.expiryDate
                } : undefined
            };

            const response = await fetch(`${API_BASE_URL}/user/${user.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(updatePayload)
            });

            if (!response.ok) {
                let errorMessage = 'Failed to update user details';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch (parseError) {
                    console.error('Could not parse error response:', parseError);
                }

                throw new Error(`Error ${response.status}: ${errorMessage}`);
            }

            const { data: updatedUser } = await response.json();
            setUser(updatedUser);
            return updatedUser;
        } catch (error) {
            console.error('Update error:', error);
            throw error;
        }
    };

    const validateFormData = (formData: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
        email?: string;
    }): Record<string, string> | null => {
        const errors: Record<string, string> = {};

        if (!formData.firstName?.trim()) {
            errors.firstName = 'First name is required';
        }
        if (!formData.lastName?.trim()) {
            errors.lastName = 'Last name is required';
        }
        if (!formData.phoneNumber?.trim()) {
            errors.phoneNumber = 'Phone number is required';
        } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phoneNumber)) {
            errors.phoneNumber = 'Invalid phone number format';
        }
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Invalid email format';
        }

        return Object.keys(errors).length > 0 ? errors : null;
    };

    const value = {
        user,
        updateUser,
        uploadImage,
        validateFormData,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}; 