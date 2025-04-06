import { ExtendedUser, AccountFormData } from './profileTypes';

const API_BASE_URL = 'http://localhost:3000';

// Cache for user details
let userDetailsCache: any = null;
let cacheTimeout: NodeJS.Timeout | null = null;

/**
 * Uploads an image to the server
 * @param file The file to upload
 * @param accessToken The user's access token
 * @returns The URL of the uploaded image
 */
export const uploadImage = async (file: File, accessToken: string): Promise<string> => {
    if (!accessToken) {
        throw new Error('No authentication token available. Please log in.');
    }

    const formData = new FormData();
    formData.append('file', file);

    // Add a delay before making the request to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Uploading image...');
    
    const response = await fetch(`${API_BASE_URL}/image/upload`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
    });

    if (response.status === 429) { // Too Many Requests
        throw new Error('Server is busy. Please try again in a few moments.');
    }

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Authentication token expired. Please log in again.');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload image');
    }

    const result = await response.json();
    console.log('Image upload response:', result);
    
    // Handle different response formats
    let imageUrl: string | undefined;
    
    // Format 1: { statusCode: 201, message: "Ok", data: { link: "image_url" } }
    if (result?.data?.link) {
        imageUrl = result.data.link;
    } 
    // Format 2: { data: { imageUrl: "image_url" } }
    else if (result?.data?.imageUrl) {
        imageUrl = result.data.imageUrl;
    }
    // Format 3: { imageUrl: "image_url" }
    else if (result?.imageUrl) {
        imageUrl = result.imageUrl;
    }
    // Format 4: { url: "image_url" }
    else if (result?.url) {
        imageUrl = result.url;
    }
    
    if (!imageUrl) {
        console.error('Invalid response format from image upload:', result);
        throw new Error('Invalid response format from image upload');
    }

    return imageUrl;
};

/**
 * Fetches user details from the server with caching
 * @param accessToken The user's access token
 * @returns The user details
 */
export const fetchUserDetails = async (accessToken: string): Promise<ExtendedUser> => {
    if (!accessToken) {
        throw new Error('No authentication token available. Please log in.');
    }

    // Return cached data if available
    if (userDetailsCache) {
        return userDetailsCache;
    }

    // First get the user ID from /auth/me endpoint
    const meResponse = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });

    if (!meResponse.ok) {
        if (meResponse.status === 401) {
            throw new Error('Authentication token expired. Please log in again.');
        }
        throw new Error('Failed to fetch user details from /auth/me');
    }

    const meResult = await meResponse.json();
    
    // Check if the response has the expected structure
    if (!meResult?.data) {
        throw new Error('Invalid response format from /auth/me');
    }
    
    const meData = meResult.data;
    
    // Then get detailed user info from /user/:id endpoint
    const userResponse = await fetch(`${API_BASE_URL}/user/${meData.id}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });

    if (!userResponse.ok) {
        if (userResponse.status === 401) {
            throw new Error('Authentication token expired. Please log in again.');
        }
        throw new Error('Failed to fetch user details from /user/:id');
    }

    const userResult = await userResponse.json();
    
    // Check if the response has the expected structure
    if (!userResult?.data) {
        throw new Error('Invalid response format from /user/:id');
    }
    
    const userData = userResult.data;
    
    // Combine the data
    const combinedData = {
        ...meData,
        ...userData,
    };

    // Cache the data for 5 minutes
    userDetailsCache = combinedData;
    if (cacheTimeout) {
        clearTimeout(cacheTimeout);
    }
    cacheTimeout = setTimeout(() => {
        userDetailsCache = null;
    }, 5 * 60 * 1000);

    return combinedData;
};

/**
 * Clears the user details cache
 */
export const clearUserDetailsCache = () => {
    userDetailsCache = null;
    if (cacheTimeout) {
        clearTimeout(cacheTimeout);
        cacheTimeout = null;
    }
};

/**
 * Validates the form data
 * @param formData The form data to validate
 * @returns An object with validation errors, or null if valid
 */
export const validateFormData = (formData: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
}): Record<string, string> | null => {
    const errors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
        errors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
        errors.lastName = 'Last name is required';
    }
    if (!formData.phoneNumber.trim()) {
        errors.phoneNumber = 'Phone number is required';
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
};

/**
 * Updates user details on the server
 * @param formData The form data to update
 * @param accessToken The user's access token
 * @returns The updated user details
 */
export const updateUserDetails = async (formData: AccountFormData, accessToken: string): Promise<ExtendedUser> => {
    if (!accessToken) {
        throw new Error('No authentication token available. Please log in.');
    }

    // Get user ID from /auth/me endpoint
    const meResponse = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });

    if (!meResponse.ok) {
        throw new Error('Failed to fetch user ID');
    }

    const { data: { id } } = await meResponse.json();

    // Prepare the request body
    const requestBody: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
    };

    // Always include drivingLicence if it exists in formData
    if (formData.drivingLicence) {
        requestBody.drivingLicence = {
            licenceNumber: formData.drivingLicence.licenceNumber,
            expiryDate: formData.drivingLicence.expiryDate,
            drivingLicenseImages: formData.drivingLicence.drivingLicenseImages || []
        };
    }

    console.log('Sending update request with body:', JSON.stringify(requestBody, null, 2));

    // Update user details
    const updateResponse = await fetch(`${API_BASE_URL}/user/${id}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });

    if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        console.error('Update failed with response:', errorData);
        throw new Error(errorData.message || 'Failed to update user details');
    }

    const responseData = await updateResponse.json();
    console.log('Update response:', responseData);
    
    // Clear the cache to ensure we get fresh data next time
    clearUserDetailsCache();
    
    // Return the updated user data
    return responseData.data || responseData;
};

/**
 * Uploads a driver's license image
 * @param file The image file to upload
 * @param accessToken The user's access token
 * @returns The URL of the uploaded image
 */
export const uploadDriversLicenseImage = async (file: File, accessToken: string): Promise<string> => {
    const imageUrl = await uploadImage(file, accessToken);
    
    // Get user ID
    const meResponse = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });

    if (!meResponse.ok) {
        throw new Error('Failed to fetch user ID');
    }

    const { data: { id } } = await meResponse.json();

    // Get current user details to preserve existing license images
    const userResponse = await fetch(`${API_BASE_URL}/user/${id}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });

    if (!userResponse.ok) {
        throw new Error('Failed to fetch user details');
    }

    const userResult = await userResponse.json();
    const userData = userResult.data || userResult;
    
    // Get current license images
    const currentImages = userData.drivingLicence?.drivingLicenseImages || [];
    
    // Add the new image to the array
    const updatedImages = [...currentImages, imageUrl];
    
    // Update the user's driving license images
    const updateResponse = await fetch(`${API_BASE_URL}/user/${id}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            drivingLicence: {
                ...userData.drivingLicence,
                drivingLicenseImages: updatedImages
            }
        }),
    });

    if (!updateResponse.ok) {
        throw new Error('Failed to update driver\'s license image');
    }

    // Clear the cache to ensure we get fresh data next time
    clearUserDetailsCache();
    
    return imageUrl;
};

/**
 * Deletes the user's profile picture
 * @param accessToken The user's access token
 * @returns Promise that resolves when the profile picture is deleted
 */
export const deleteProfilePicture = async (accessToken: string): Promise<void> => {
    if (!accessToken) {
        throw new Error('No authentication token available. Please log in.');
    }

    // Get user ID from /auth/me endpoint
    const meResponse = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });

    if (!meResponse.ok) {
        throw new Error('Failed to fetch user ID');
    }

    const { data: { id } } = await meResponse.json();

    // Delete profile picture
    const deleteResponse = await fetch(`${API_BASE_URL}/user/${id}/profile-picture`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });

    if (!deleteResponse.ok) {
        if (deleteResponse.status === 401) {
            throw new Error('Authentication token expired. Please log in again.');
        }
        const errorData = await deleteResponse.json();
        throw new Error(errorData.message || 'Failed to delete profile picture');
    }
    
    // Clear the cache to ensure we get fresh data next time
    clearUserDetailsCache();
}; 