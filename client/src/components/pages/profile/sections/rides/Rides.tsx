import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../../hooks/useAuth';
import './Rides.css';

interface Ride {
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

const MyRides: React.FC = () => {
    const { user, accessToken } = useAuth();
    const [rides, setRides] = useState<Ride[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'completed' | 'cancelled' | 'upcoming'>('all');

    useEffect(() => {
        const fetchRides = async () => {
            try {
                // For now, use dummy data since the API is not ready
                // When the API is ready, uncomment this code
                /*
                const response = await fetch('/api/users/rides', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch rides');
                }
                const data = await response.json();
                setRides(data);
                */
                
                // Dummy data for testing
                const dummyRides: Ride[] = [
                    {
                        id: '1',
                        carId: 'car1',
                        carName: 'Tesla Model 3',
                        carImage: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                        startDate: '2023-06-15',
                        endDate: '2023-06-20',
                        pickupAddress: '123 Main St, New York, NY',
                        returnAddress: '123 Main St, New York, NY',
                        totalPrice: 750,
                        status: 'completed'
                    },
                    {
                        id: '2',
                        carId: 'car2',
                        carName: 'Porsche 911',
                        carImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                        startDate: '2023-07-10',
                        endDate: '2023-07-15',
                        pickupAddress: '456 Oak Ave, Los Angeles, CA',
                        returnAddress: '456 Oak Ave, Los Angeles, CA',
                        totalPrice: 1200,
                        status: 'upcoming'
                    },
                    {
                        id: '3',
                        carId: 'car3',
                        carName: 'Audi Q5',
                        carImage: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                        startDate: '2023-05-01',
                        endDate: '2023-05-05',
                        pickupAddress: '789 Pine St, Chicago, IL',
                        returnAddress: '789 Pine St, Chicago, IL',
                        totalPrice: 600,
                        status: 'cancelled'
                    }
                ];
                
                // Simulate API delay
                setTimeout(() => {
                    setRides(dummyRides);
                    setLoading(false);
                }, 1000);
                
            } catch (err) {
                setError('Failed to load ride history');
                console.error('Error fetching rides:', err);
                setLoading(false);
            }
        };

        fetchRides();
    }, [accessToken]);

    const filteredRides = rides.filter(ride =>
        filter === 'all' ? true : ride.status === filter
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getStatusColor = (status: Ride['status']) => {
        switch (status) {
            case 'completed':
                return '#48bb78';
            case 'cancelled':
                return '#e53e3e';
            case 'upcoming':
                return '#4299e1';
            default:
                return '#718096';
        }
    };

    if (loading) {
        return <div className="my-rides-loading">Loading ride history...</div>;
    }

    if (error) {
        return <div className="my-rides-error">{error}</div>;
    }

    return (
        <div className="my-rides-root">
            <div className="my-rides-section">
                <div className="my-rides-header">
                    <h4>My Ride History</h4>
                    <div className="filter-buttons">
                        <button
                            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            All
                        </button>
                        <button
                            className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
                            onClick={() => setFilter('upcoming')}
                        >
                            Upcoming
                        </button>
                        <button
                            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                            onClick={() => setFilter('completed')}
                        >
                            Completed
                        </button>
                        <button
                            className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
                            onClick={() => setFilter('cancelled')}
                        >
                            Cancelled
                        </button>
                    </div>
                </div>

                {filteredRides.length === 0 ? (
                    <div className="my-rides-empty">
                        <p>No rides found for the selected filter.</p>
                    </div>
                ) : (
                    <div className="rides-list">
                        {filteredRides.map((ride) => (
                            <div key={ride.id} className="ride-card">
                                <img 
                                    src={ride.carImage || 'https://via.placeholder.com/150'} 
                                    alt={ride.carName || 'Car'} 
                                    className="ride-car-image" 
                                />
                                <div className="ride-info">
                                    <h5>{ride.carName || 'Car'}</h5>
                                    <div className="ride-dates">
                                        <p>
                                            <strong>From:</strong> {formatDate(ride.startDate)}
                                        </p>
                                        <p>
                                            <strong>To:</strong> {formatDate(ride.endDate)}
                                        </p>
                                    </div>
                                    <p className="ride-price">
                                        <strong>Total Price:</strong> ${ride.totalPrice}
                                    </p>
                                    <span
                                        className="ride-status"
                                        style={{ backgroundColor: getStatusColor(ride.status) }}
                                    >
                                        {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyRides;
