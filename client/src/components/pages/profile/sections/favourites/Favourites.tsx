import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../../hooks/useAuth";
import { useNotification } from "../../../../../contexts/NotificationContext";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaCalendarAlt, FaSpinner } from "react-icons/fa";
import { carApi } from "../../../../../apis/car";
import { Car } from "../../../../../types/car";
import './Favourites.css';

const Favourites: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState<Car[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedDates, setSelectedDates] = useState<{ startDate: string; endDate: string }>({
        startDate: '',
        endDate: ''
    });
    const [bookingCarId, setBookingCarId] = useState<string | null>(null);
    const [isBookingLoading, setIsBookingLoading] = useState(false);

    const fetchFavorites = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const favoriteCars = await carApi.findFavorites();
            setFavorites(favoriteCars);
        } catch (err) {
            setError('Không thể tải danh sách yêu thích');
            showNotification('error', 'Không thể tải danh sách yêu thích');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchFavorites();
        }
    }, [isAuthenticated]);

    const handleRemoveFavorite = async (carId: string) => {
        try {
            await carApi.removeFavorite(carId);
            setFavorites(prev => prev.filter(car => car.id !== carId));
            showNotification('success', 'Đã xóa xe khỏi danh sách yêu thích');
        } catch (err) {
            showNotification('error', 'Không thể xóa xe khỏi danh sách yêu thích');
        }
    };

    const handleBookCar = (car: Car) => {
        if (!selectedDates.startDate || !selectedDates.endDate) {
            showNotification('error', 'Vui lòng chọn ngày nhận và trả xe');
            return;
        }

        if (typeof car.pricePerDay !== 'number' || car.pricePerDay <= 0) {
            showNotification('error', 'Thông tin giá xe không hợp lệ hoặc không có sẵn.');
            return;
        }

        const startDate = new Date(selectedDates.startDate);
        const endDate = new Date(selectedDates.endDate);

        if (endDate <= startDate) {
            showNotification('error', 'Ngày trả xe phải sau ngày nhận xe.');
            return;
        }

        const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (days <= 0) { // Should be caught by endDate <= startDate, but as an extra safeguard
            showNotification('error', 'Số ngày thuê không hợp lệ.');
            return;
        }
        const totalPrice = days * car.pricePerDay;

        // Navigate to booking confirmation with all necessary data
        navigate('/user/booking-confirmation', {
            state: {
                carId: car.id,
                carDetails: car,
                startTime: startDate.toISOString(),
                endTime: endDate.toISOString(),
                totalPrice,
                customerName: '',
                phoneNumber: '',
                pickupLocation: '',
                returnLocation: ''
            }
        });
    };

    if (isLoading) {
        return (
            <div className="favourites-loading">
                <FaSpinner className="spinner" />
                <p>Đang tải danh sách yêu thích...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="favourites-error">
                <p>{error}</p>
                <button onClick={() => fetchFavorites()}>Thử lại</button>
            </div>
        );
    }

    if (!favorites || favorites.length === 0) {
        return (
            <div className="favourites-empty">
                <FaHeart className="empty-icon" />
                <p>Chưa có xe yêu thích nào.</p>
            </div>
        );
    }

    return (
        <div className="favourites-root">
            <div className="favourites-section">
                <div className="favourites-grid">
                    {favorites.map((car) => (
                        <div key={car.id} className="favourite-card">
                            <div className="car-image-container">
                                <img
                                    className="car-image"
                                    src={car.images && car.images.length > 0 ? car.images[0]?.url : '/placeholder-car.jpg'}
                                    alt={`${car.brand} ${car.model}`}
                                />
                                <div className="price-badge">
                                    {typeof car.pricePerDay === 'number' && car.pricePerDay > 0 
                                        ? car.pricePerDay.toLocaleString() + '₫/ngày' 
                                        : 'N/A'}
                                </div>
                            </div>
                            <div className="car-info">
                                <h5 className="car-name">{car.brand} {car.model}</h5>
                                <div className="car-details">
                                    <div className="car-detail">
                                        <span>Năm: {car.year}</span>
                                    </div>
                                    <div className="car-detail">
                                        <span>Nhiên liệu: {car.fuelType as string}</span>
                                    </div>
                                    <div className="car-detail">
                                        <span>Số chỗ: {car.seats}</span>
                                    </div>
                                </div>
                                {bookingCarId === car.id ? (
                                    <div className="booking-form">
                                        <div className="date-inputs">
                                            <input
                                                type="date"
                                                value={selectedDates.startDate}
                                                onChange={(e) => setSelectedDates(prev => ({ ...prev, startDate: e.target.value }))}
                                                min={new Date().toISOString().split('T')[0]}
                                                placeholder="Ngày nhận"
                                            />
                                            <input
                                                type="date"
                                                value={selectedDates.endDate}
                                                onChange={(e) => setSelectedDates(prev => ({ ...prev, endDate: e.target.value }))}
                                                min={selectedDates.startDate || new Date().toISOString().split('T')[0]}
                                                placeholder="Ngày trả"
                                            />
                                        </div>
                                        <div className="booking-actions">
                                            <button
                                                className="cancel-button"
                                                onClick={() => setBookingCarId(null)}
                                            >
                                                Hủy
                                            </button>
                                            <button
                                                className="confirm-button"
                                                onClick={() => handleBookCar(car)}
                                                disabled={isBookingLoading}
                                            >
                                                {isBookingLoading ? (
                                                    <FaSpinner className="spinner" />
                                                ) : (
                                                    'Tiếp tục đặt xe'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="car-actions">
                                        <button
                                            className="remove-favourite"
                                            onClick={() => handleRemoveFavorite(car.id)}
                                        >
                                            <FaHeart className="icon" />
                                            Bỏ yêu thích
                                        </button>
                                        <button
                                            className="book-car"
                                            onClick={() => setBookingCarId(car.id)}
                                        >
                                            <FaCalendarAlt className="icon" />
                                            Đặt xe
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Favourites;
