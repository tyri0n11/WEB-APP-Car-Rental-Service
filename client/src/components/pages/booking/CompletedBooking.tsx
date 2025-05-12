import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBooking } from '../../../contexts/BookingContext';
import StepNavigation from './StepNavigation';
import './CompletedBooking.css';

interface BookingDetails {
  id: string;
  userId: string;
  carId: string;
  startDate: string;
  endDate: string;
  pickupAddress: string;
  returnAddress: string;
  totalPrice: number;
  status: string;
  code?: string; // Making code optional since it might not be present in the API response
  car?: {
    id: string;
    make: string;
    model: string;
    year: number;
    dailyPrice: number;
    licensePlate: string;
    images?: { url: string; isMain: boolean }[];
  };
}

const CompletedBooking: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();  const { fetchBookingByCode } = useBooking();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<{ 
    status: string; 
    transactionId: string | null;
  }>({ 
    status: '', 
    transactionId: null 
  });

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get URL parameters
        const params = new URLSearchParams(location.search);
        const bookingCode = params.get('bookingCode');
        const paymentStatus = params.get('status');
        const transactionId = params.get('transactionId');
        
        // Log the URL and parameters for debugging
        console.log('Current URL:', location.pathname + location.search);
        console.log('Params:', { bookingCode, paymentStatus, transactionId });

        if (!bookingCode) {
          console.error('Missing bookingCode parameter');
          throw new Error('No booking code provided. Invalid access to this page.');
        }

        if (!paymentStatus) {
          console.error('Missing status parameter');
          throw new Error('No payment status provided. Invalid access to this page.');
        }

        if (paymentStatus !== 'success') {
          throw new Error(`Payment was not successful. Status: ${paymentStatus}`);
        }

        setPaymentInfo({ 
          status: paymentStatus, 
          transactionId
        });        // Fetch booking details using the code
        console.log('Fetching booking details for code:', bookingCode);
        const bookingDetails = await fetchBookingByCode(bookingCode);
        
        if (!bookingDetails) {
          throw new Error('No booking data received from server');
        }
        
        // Map the API response to our BookingDetails interface
        const mappedBooking: BookingDetails = {
          ...bookingDetails,
          code: bookingCode,
          startDate: bookingDetails.startDate.toString(),
          endDate: bookingDetails.endDate.toString(),
        };
        
        setBooking(mappedBooking);
      } catch (err) {
        console.error('Error in CompletedBooking:', err);
        setError(err instanceof Error ? err.message : 'Failed to load booking details');
        
        // If payment failed or we're missing parameters, redirect to payment page after a delay
        if (err instanceof Error && 
           (err.message.includes('Payment was not successful') || 
            err.message.includes('Invalid access'))) {
          console.log('Redirecting to payment page...');
          setTimeout(() => {
            navigate('/payment');
          }, 3000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();  }, [location, fetchBookingByCode, navigate]);

  const handleViewBookings = () => {
    navigate('/profile/rides');
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading booking details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h2>Error</h2>
        <p>{error}</p>
        {error.includes('Payment was not successful') && (
          <p>Redirecting to payment page...</p>
        )}
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="error">
        <h2>Booking Not Found</h2>
        <p>No booking information was found. Please try again or contact support.</p>
      </div>
    );
  }

  return (
    <div className="confirmation-container">
      <StepNavigation currentStep={3} />
      
      <div className="confirmation-success">
        <h1>🎉 Booking Completed Successfully!</h1>
        <p>Your payment has been processed and your booking is confirmed.</p>
        {paymentInfo.transactionId && (
          <p className="transaction-id">Transaction ID: {paymentInfo.transactionId}</p>
        )}
      </div>

      <div className="confirmation-details">
        <h2>Booking Information</h2>
        <div className="details-grid">
          <div className="detail-item">
            <label>Booking Code:</label>
            <span>{booking.code}</span>
          </div>
          
          {booking.car && (
            <div className="detail-item">
              <label>Car:</label>
              <span>{booking.car.year} {booking.car.make} {booking.car.model}</span>
            </div>
          )}

          <div className="detail-item">
            <label>Pickup Date:</label>
            <span>{new Date(booking.startDate).toLocaleString()}</span>
          </div>

          <div className="detail-item">
            <label>Return Date:</label>
            <span>{new Date(booking.endDate).toLocaleString()}</span>
          </div>

          <div className="detail-item">
            <label>Pickup Location:</label>
            <span>{booking.pickupAddress}</span>
          </div>

          <div className="detail-item">
            <label>Return Location:</label>
            <span>{booking.returnAddress}</span>
          </div>

          <div className="detail-item">
            <label>Total Price:</label>
            <span>{booking.totalPrice.toLocaleString()}₫</span>
          </div>

          <div className="detail-item">
            <label>Status:</label>
            <span className={`status status-${booking.status.toLowerCase()}`}>
              {booking.status}
            </span>
          </div>
        </div>

        <div className="booking-actions">
          <button className="primary-button" onClick={handleViewBookings}>
            View My Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletedBooking;