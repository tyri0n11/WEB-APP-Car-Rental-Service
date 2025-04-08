import { User } from '../contexts/AuthContext';

const API_BASE_URL = 'http://localhost:3000';

// Cache for user details with TypeScript type
interface CacheEntry {
    data: User;
    timestamp: number;
}

let userDetailsCache: CacheEntry | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Generic image upload function that handles different types of images
 * @param file The file to upload
 * @param accessToken The user's access token
 * @param type Optional type of image being uploaded (e.g., 'license', 'profile')
 * @returns The URL of the uploaded image
 */
export const uploadImage = async (file: File, accessToken: string, type?: string): Promise<string> => {
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

/**
 * Fetches user details from the server with improved caching
 * @param accessToken The user's access token
 * @returns The user details
 */
export const fetchUserDetails = async (accessToken: string): Promise<User> => {
    if (!accessToken) {
        throw new Error('No authentication token available. Please log in.');
    }

    // Return cached data if available and not expired
    if (userDetailsCache && Date.now() - userDetailsCache.timestamp < CACHE_DURATION) {
        return userDetailsCache.data;
    }

    try {
        // Get user ID from /auth/me endpoint
        const meResponse = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!meResponse.ok) {
            throw new Error(meResponse.status === 401
                ? 'Authentication token expired. Please log in again.'
                : 'Failed to fetch user details');
        }

        const { data: meData } = await meResponse.json();
        if (!meData?.id) {
            throw new Error('Invalid response format from /auth/me');
        }

        // Get detailed user info
        const userResponse = await fetch(`${API_BASE_URL}/user/${meData.id}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!userResponse.ok) {
            throw new Error(userResponse.status === 401
                ? 'Authentication token expired. Please log in again.'
                : 'Failed to fetch user details');
        }

        const { data: userData } = await userResponse.json();
        if (!userData) {
            throw new Error('Invalid response format from /user/:id');
        }

        // Combine and cache the data
        const combinedData = { ...meData, ...userData };
        userDetailsCache = {
            data: combinedData,
            timestamp: Date.now()
        };

        return combinedData;
    } catch (error) {
        // Clear cache on error
        clearUserDetailsCache();
        throw error;
    }
};

/**
 * Clears the user details cache
 */
export const clearUserDetailsCache = () => {
    userDetailsCache = null;
};

/**
 * Validates the form data with improved validation rules
 * @param formData The form data to validate
 * @returns An object with validation errors, or null if valid
 */
export const validateFormData = (formData: {
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

interface UserUpdatePayload {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    drivingLicence: {
        licenceNumber: string;
        drivingLicenseImages: string[];
        expiryDate: string;
    };
}

/**
 * Updates user details on the server with improved error handling
 * @param formData The form data to update
 * @param accessToken The user's access token
 * @returns The updated user details
 */
export const updateUserDetails = async (formData: User, accessToken: string): Promise<User> => {
    if (!accessToken) {
        throw new Error('No authentication token available. Please log in.');
    }

    try {
        // Prepare the update payload according to the API's expected format
        const updatePayload: UserUpdatePayload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phoneNumber: formData.phoneNumber,
            drivingLicence: {
                licenceNumber: formData.drivingLicenceId?.licenceNumber || '',
                drivingLicenseImages: formData.drivingLicenceId?.drivingLicenseImages || [],
                expiryDate: formData.drivingLicenceId?.expiryDate || ''
            }
        };

        console.log('Sending update request:', {
            url: `${API_BASE_URL}/user/${formData.id}`,
            payload: updatePayload
        });

        const response = await fetch(`${API_BASE_URL}/user/${formData.id}`, {
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
                console.error('Server error details:', errorData);
            } catch (parseError) {
                console.error('Could not parse error response:', parseError);
            }

            throw new Error(`Error ${response.status}: ${errorMessage}`);
        }

        const { data: updatedUser } = await response.json();
        
        // Update cache with new data
        if (userDetailsCache) {
            userDetailsCache.data = updatedUser;
            userDetailsCache.timestamp = Date.now();
        }

        return updatedUser;
    } catch (error) {
        console.error('Update error:', error);
        throw error;
    }
};