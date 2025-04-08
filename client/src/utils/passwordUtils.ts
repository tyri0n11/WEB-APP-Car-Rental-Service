const API_BASE_URL = 'http://localhost:3000';

/**
 * Changes a user's password
 * @param currentPassword The user's current password
 * @param newPassword The user's new password
 * @param accessToken The user's access token
 * @returns Promise that resolves to true if successful
 */
export const changePassword = async (
    currentPassword: string,
    newPassword: string,
    accessToken: string
): Promise<boolean> => {
    if (!accessToken) {
        throw new Error('No authentication token available. Please log in.');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                currentPassword,
                newPassword
            })
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Authentication token expired. Please log in again.');
            }
            
            // Try to get more detailed error information
            let errorMessage = 'Failed to change password';
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
        return result.success || false;
    } catch (error) {
        console.error('Error changing password:', error);
        throw error;
    }
};

/**
 * Refreshes an authentication token
 * @param refreshToken The refresh token
 * @returns Promise that resolves to the new access token or null if unsuccessful
 */
export const refreshToken = async (refreshToken: string): Promise<string | null> => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                refreshToken
            })
        });

        if (!response.ok) {
            console.error('Failed to refresh token:', response.status);
            return null;
        }

        const result = await response.json();
        return result.accessToken || null;
    } catch (error) {
        console.error('Error refreshing token:', error);
        return null;
    }
};

/**
 * Validates a password
 * @param password The password to validate
 * @returns An object with validation errors, or null if valid
 */
export const validatePassword = (password: string): Record<string, string> | null => {
    const errors: Record<string, string> = {};
    
    if (!password) {
        errors.password = 'Password is required';
    } else if (password.length < 8) {
        errors.password = 'Password must be at least 8 characters long';
    } else if (!/[A-Z]/.test(password)) {
        errors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(password)) {
        errors.password = 'Password must contain at least one lowercase letter';
    } else if (!/[0-9]/.test(password)) {
        errors.password = 'Password must contain at least one number';
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.password = 'Password must contain at least one special character';
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
}; 