import dummyBookings from './dummy/bookings.json';

const API_BASE_URL = 'http://localhost:3000';

// Define the ride interface
export interface Ride {
    id: string;
    carId: string;
    carName?: string;
    carImage?: string;
    startDate: string;
    endDate: string;
    pickupAddress: string;
    returnAddress: string;
    totalPrice: number;
    status: 'completed' | 'cancelled' | 'upcoming';
}

/**
 * Fetches rides from the server
 * @param accessToken The user's access token
 * @returns Promise that resolves to an array of rides
 */
export const fetchRides = async (accessToken: string): Promise<Ride[]> => {
    if (!accessToken) {
        throw new Error('No authentication token available. Please log in.');
    }

    try {
        // For now, use dummy data since the API is not ready
        // When the API is ready, uncomment this code
        /*
        const response = await fetch(`${API_BASE_URL}/user/rides`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Authentication token expired. Please log in again.');
            }
            throw new Error('Failed to fetch rides');
        }
        
        const result = await response.json();
        return result.data;
        */

        // Return dummy data for now
        return dummyBookings as Ride[];
    } catch (error) {
        console.error('Error fetching rides:', error);
        throw error;
    }
};

/**
 * Cancels a ride
 * @param rideId The ID of the ride to cancel
 * @param accessToken The user's access token
 * @returns Promise that resolves to the updated ride
 */
export const cancelRide = async (rideId: string, accessToken: string): Promise<Ride> => {
    if (!accessToken) {
        throw new Error('No authentication token available. Please log in.');
    }

    try {
        // For now, simulate canceling on the server
        // When the API is ready, uncomment this code
        /*
        const response = await fetch(`${API_BASE_URL}/user/rides/${rideId}/cancel`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Authentication token expired. Please log in again.');
            }
            throw new Error('Failed to cancel ride');
        }
        
        const result = await response.json();
        return result.data;
        */

        // Simulate canceling on the server
        const cancelledRide: Ride = {
            id: rideId,
            carId: 'car1',
            carName: 'Tesla Model 3',
            carImage: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            startDate: '2023-06-15',
            endDate: '2023-06-20',
            pickupAddress: '123 Main St, New York, NY 10001',
            returnAddress: '123 Main St, New York, NY 10001',
            totalPrice: 750,
            status: 'cancelled'
        };

        return cancelledRide;
    } catch (error) {
        console.error('Error canceling ride:', error);
        throw error;
    }
};

/**
 * Formats a date string to a more readable format
 * @param dateString The date string to format
 * @returns The formatted date string
 */
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/**
 * Gets the color for a ride status
 * @param status The ride status
 * @returns The color for the status
 */
export const getStatusColor = (status: Ride['status']): string => {
    switch (status) {
        case 'completed':
            return 'green';
        case 'cancelled':
            return 'red';
        case 'upcoming':
            return 'blue';
        default:
            return 'gray';
    }
}; 