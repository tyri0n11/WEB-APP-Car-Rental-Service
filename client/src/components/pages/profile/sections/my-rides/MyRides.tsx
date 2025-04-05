import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../../hooks/useAuth';
import './MyRides.css';

interface Ride {
    carId: string;
    startDate: string;
    endDate: string;
    pickupAddress: string;
    returnAddress: String;
    totalPrice: number;
    status: 'completed' | 'cancelled' | 'upcoming';
}

const MyRides: React.FC = () => {
    const { user } = useAuth();
    const [rides, setRides] = useState<Ride[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'completed' | 'cancelled' | 'upcoming'>('all');

    useEffect(() => {
        const fetchRides = async () => {
            try {
                const response = await fetch('/api/users/rides');
                if (!response.ok) {
                    throw new Error('Failed to fetch rides');
                }
                const data = await response.json();
                setRides(data);
            } catch (err) {
                setError('Failed to load ride history');
                console.error('Error fetching rides:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRides();
    }, []);

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
                                <img src={ride.carImage} alt={ride.carName} className="ride-car-image" />
                                <div className="ride-info">
                                    <h5>{ride.carName}</h5>
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
