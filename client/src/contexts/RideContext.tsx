import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

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

interface RideContextType {
    rides: Ride[];
    fetchRides: () => Promise<void>;
    cancelRide: (rideId: string) => Promise<Ride>;
    formatDate: (dateString: string) => string;
    getStatusColor: (status: Ride['status']) => string;
}

const RideContext = createContext<RideContextType | undefined>(undefined);

export const useRide = () => {
    const context = useContext(RideContext);
    if (!context) {
        throw new Error('useRide must be used within a RideProvider');
    }
    return context;
};

export const RideProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { accessToken } = useAuth();
    const { showNotification } = useNotification();
    const [rides, setRides] = useState<Ride[]>([]);

    // Fetch user's ride history
    const fetchRides = useCallback(async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/rides`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch rides');
            }

            const result = await response.json();
            setRides(result.data);
        } catch (error) {
            showNotification('error', 'Failed to fetch rides');
        }
    }, [accessToken, showNotification]);

    // Cancel a scheduled ride
    const cancelRide = useCallback(async (rideId: string) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/rides/${rideId}/cancel`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to cancel ride');
            }

            const result = await response.json();
            const cancelledRide = result.data;
            setRides(prev => prev.map(ride => ride.id === rideId ? cancelledRide : ride));
            showNotification('success', 'Ride cancelled successfully');
            return cancelledRide;
        } catch (error) {
            showNotification('error', 'Failed to cancel ride');
            throw error;
        }
    }, [accessToken, showNotification]);

    // Format date for display
    const formatDate = useCallback((dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }, []);

    // Get color based on ride status
    const getStatusColor = useCallback((status: Ride['status']) => {
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
    }, []);

    return (
        <RideContext.Provider
            value={{
                rides,
                fetchRides,
                cancelRide,
                formatDate,
                getStatusColor,
            }}
        >
            {children}
        </RideContext.Provider>
    );
}; 