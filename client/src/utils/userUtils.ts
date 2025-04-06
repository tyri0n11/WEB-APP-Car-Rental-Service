import { ExtendedUser } from './profileTypes';

const API_BASE_URL = 'http://localhost:3000';

/**
 * Updates user details on the server
 * @param userId The user's ID
 * @param updateData The data to update
 * @param accessToken The user's access token
 * @returns Promise that resolves to the updated user details
 */
export const updateUserDetails = async (
    userId: string,
    updateData: {
        firstName?: string;
        lastName?: string;
        phoneNumber?: string;
        profileImage?: string;
        drivingLicense?: {
            licenceNumber: string;
            drivingLicenseImages: string[];
            expiryDate: string;
        };
    },
    accessToken: string
): Promise<any> => {
    if (!accessToken) {
        throw new Error('No authentication token available. Please log in.');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Authentication token expired. Please log in again.');
            }
            
            // Try to get more detailed error information
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

        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error('Error updating user details:', error);
        throw error;
    }
}; 