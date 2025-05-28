import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { bookingApi } from "../../../apis/booking";
import { MembershipLevel } from "../../../types/membership";
import { useMembershipContext } from "../../../contexts/MembershipContext";
import { useAuth } from "../../../hooks/useAuth";
import { ROUTES } from "../../../routes/constants/ROUTES";
import StepNavigation from "./StepNavigation";
import { FaCheckCircle, FaStar } from "react-icons/fa";
import "./CompletedBooking.css";

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
  code?: string;
  car?: {
    id: string;
    make: string;
    model: string;
    year: number;
    dailyPrice: number;
    licensePlate: string;
    images?: { url: string; isMain: boolean }[];
  };
  pointsEarned?: number;
  membershipLevel?: MembershipLevel;
}

// Interface for ZaloPay payment return parameters
interface ZaloPayReturnParams {
  amount?: string;
  appid?: string;
  apptransid?: string;
  bankcode?: string;
  checksum?: string;
  discountamount?: string;
  pmcid?: string;
  status?: string;
  bookingCode?: string;
  pointsEarned?: number;
  membershipLevel?: MembershipLevel;
}

const CompletedBooking: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams<{ status: string; code: string }>();
  const { refreshMembership } = useMembershipContext();
  const { user } = useAuth();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<{
    status: string;
    transactionId: string | null;
    pointsEarned?: number;
    membershipLevel?: MembershipLevel;
  }>({
    status: "",
    transactionId: null,
    pointsEarned: 0,
    membershipLevel: undefined
  });

  const fetchBookingData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!params.status || !params.code) {
        throw new Error('Missing required URL parameters');
      }

      // Clean up session storage
      sessionStorage.removeItem("pendingBookingData");

      console.log('CompletedBooking: Starting data fetch:', { 
        status: params.status,
        code: params.code,
        search: location.search
      });

      // Validate payment status
      if (params.status !== "1") {
        throw new Error(`Payment was not successful (status: ${params.status})`);
      }

      const searchParams = new URLSearchParams(location.search);
      setPaymentInfo({
        status: params.status,
        transactionId: searchParams.get("apptransid") || null,
        pointsEarned: Number(searchParams.get("earnedPoints")) || 0,
        membershipLevel: searchParams.get("membershipLevel") as MembershipLevel || undefined
      });

      // Fetch booking details and refresh membership data in parallel
      const [bookingDetails] = await Promise.all([
        bookingApi.findByCode(params.code),
        refreshMembership()
      ]);

      if (!bookingDetails) {
        throw new Error("No booking data received from server");
      }

      setBooking({
        ...bookingDetails,
        startDate: bookingDetails.startDate.toString(),
        endDate: bookingDetails.endDate.toString(),
        pointsEarned: Number(searchParams.get("earnedPoints")) || 0,
        membershipLevel: searchParams.get("membershipLevel") as MembershipLevel || undefined
      });
    } catch (err) {
      console.error("Error fetching booking details:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [params.status, params.code, location.search, refreshMembership]);

  useEffect(() => {
    // Skip if we already have data or there's an error
    if (booking || error) {
      return;
    }

    // First handle auth restoration if needed
    const pendingDataStr = sessionStorage.getItem("pendingBookingData");
    if (pendingDataStr) {
      try {
        const pendingData = JSON.parse(pendingDataStr);
        const storedToken = pendingData?.accessToken;
        const currentToken = localStorage.getItem('accessToken');
        
        console.log('CompletedBooking: Auth state:', {
          hasStoredToken: !!storedToken,
          hasCurrentToken: !!currentToken
        });

        if (storedToken && !currentToken) {
          // Need to restore auth
          localStorage.setItem('accessToken', storedToken);
          window.location.reload();
          return;
        }
      } catch (parseError) {
        console.error('Error parsing pendingBookingData:', parseError);
      }
    }

    // Don't proceed without auth
    if (!user || !localStorage.getItem('accessToken')) {
      console.log('CompletedBooking: Waiting for auth');
      return;
    }

    // If we have auth, fetch the data
    fetchBookingData();
  }, [booking, error, user, fetchBookingData]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Processing your payment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          {error.includes("Payment was not successful") && (
            <button onClick={() => navigate(ROUTES.PROTECTED.PROFILE_SECTIONS.RIDES)} className="view-bookings-btn">
              View My Bookings
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h2>Booking Not Found</h2>
          <p>We couldn't find your booking details.</p>
          <button onClick={() => navigate(ROUTES.PROTECTED.PROFILE_SECTIONS.RIDES)} className="view-bookings-btn">
            View My Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="confirmation-container">
      <StepNavigation currentStep={3} />

      <div className="confirmation-success">
        <div className="success-icon">
          <FaCheckCircle size={48} color="#4CAF50" />
        </div>
        <h2>Payment Successful!</h2>
        <p className="transaction-id">
          Transaction ID: {paymentInfo.transactionId}
        </p>
        
        {paymentInfo.pointsEarned && paymentInfo.pointsEarned > 0 && (
          <div className="points-earned">
            <FaStar className="points-icon" />
            <p className="points-text">Congratulations! You earned {paymentInfo.pointsEarned} points!</p>
            {paymentInfo.membershipLevel && (
              <p className="membership-level">
                Current Membership Level: {paymentInfo.membershipLevel}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="confirmation-details">
        <h3>Booking Details</h3>
        <div className="booking-info">
          <div className="info-row">
            <span>Car:</span>
            <span>{booking.car?.make} {booking.car?.model} ({booking.car?.year})</span>
          </div>
          <div className="info-row">
            <span>Pickup:</span>
            <span>{booking.pickupAddress}</span>
          </div>
          <div className="info-row">
            <span>Return:</span>
            <span>{booking.returnAddress}</span>
          </div>
          <div className="info-row">
            <span>Duration:</span>
            <span>{new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</span>
          </div>
          <div className="info-row total">
            <span>Total Paid:</span>
            <span>{booking.totalPrice.toLocaleString()}đ</span>
          </div>
        </div>
      </div>      <div className="confirmation-actions">
        <button onClick={() => navigate("/profile/rides")} className="primary-button">
          View My Bookings
        </button>
        <button 
          onClick={() => navigate(ROUTES.PROTECTED.PROFILE_SECTIONS.MEMBERSHIP, { 
            state: { 
              fromCompletedBooking: true,
              earnedPoints: paymentInfo.pointsEarned 
            } 
          })}
          className="secondary-button"
        >
          View Membership & Points
        </button>
      </div>
    </div>
  );
};

export default CompletedBooking;
