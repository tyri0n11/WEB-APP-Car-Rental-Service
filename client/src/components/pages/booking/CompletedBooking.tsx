import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { bookingApi } from "../../../apis/booking";
import StepNavigation from "./StepNavigation";
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
}

const CompletedBooking: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<{
    status: string;
    transactionId: string | null;
  }>({
    status: "",
    transactionId: null,
  });

  // Memoize the parsing function to avoid unnecessary recalculations
  const parseZaloPayReturnParams = useCallback((): ZaloPayReturnParams => {
    const params = new URLSearchParams(location.search);
    const returnParams: ZaloPayReturnParams = {};

    // Extract all possible ZaloPay parameters
    returnParams.amount = params.get("amount") || undefined;
    returnParams.appid = params.get("appid") || undefined;
    returnParams.apptransid = params.get("apptransid") || undefined;
    returnParams.bankcode = params.get("bankcode") || undefined;
    returnParams.checksum = params.get("checksum") || undefined;
    returnParams.discountamount = params.get("discountamount") || undefined;
    returnParams.pmcid = params.get("pmcid") || undefined;
    returnParams.status = params.get("status") || undefined;

    // Get direct booking code if available
    returnParams.bookingCode = params.get("bookingCode") || undefined;

    // If no direct bookingCode but we have apptransid, extract from it
    if (!returnParams.bookingCode && returnParams.apptransid) {
      const parts = returnParams.apptransid.split("_");
      if (parts.length === 2) {
        returnParams.bookingCode = parts[1];
      }
    }

    return returnParams;
  }, [location.search]);

  // Fetch booking details only once
  useEffect(() => {
    // Don't make API calls if already loaded or errored
    if (booking || error) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Parse ZaloPay return parameters
        const zaloParams = parseZaloPayReturnParams();

        // Log the URL and parameters for debugging
        console.log("Current URL:", location.pathname + location.search);
        console.log("ZaloPay return params:", zaloParams);

        if (!zaloParams.bookingCode) {
          throw new Error(
            "No booking code found. Invalid access to this page."
          );
        }

        if (!zaloParams.status) {
          throw new Error(
            "No payment status provided. Invalid access to this page."
          );
        }

        if (zaloParams.status !== "1") {
          throw new Error(
            `Payment was not successful. Status: ${zaloParams.status}`
          );
        }

        // Set payment info
        setPaymentInfo({
          status: zaloParams.status,
          transactionId: zaloParams.apptransid || null,
        });

        // Only fetch if we have a booking code
        const bookingDetails = await bookingApi.findByCode(zaloParams.bookingCode);

        if (!bookingDetails) {
          throw new Error("No booking data received from server");
        }

        // Map the API response to our BookingDetails interface
        const mappedBooking: BookingDetails = {
          ...bookingDetails,
          code: zaloParams.bookingCode,
          startDate: bookingDetails.startDate.toString(),
          endDate: bookingDetails.endDate.toString(),
        };

        setBooking(mappedBooking);

        // Store successful payment in localStorage for reference
        localStorage.setItem(
          "lastSuccessfulPayment",
          JSON.stringify({
            bookingCode: zaloParams.bookingCode,
            status: zaloParams.status,
            amount: zaloParams.amount,
            timestamp: new Date().toISOString(),
          })
        );

        // Clean up pending booking data
        localStorage.removeItem("pendingBookingData");
      } catch (err) {
        console.error("Error in CompletedBooking:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load booking details"
        );

        // If payment failed or we're missing parameters, redirect to payment page after a delay
        if (
          err instanceof Error &&
          (err.message.includes("Payment was not successful") ||
            err.message.includes("Invalid access"))
        ) {
          console.log("Redirecting to payment page...");
          setTimeout(() => {
            navigate("/user/payment");
          }, 3000);
        }
      } finally {
        setLoading(false);
      }
    };

    // Execute only once and when dependencies are ready
    fetchData();

    // Return empty cleanup function to avoid memory leaks
    return () => { };
  }, [location.pathname, parseZaloPayReturnParams, navigate]);

  const handleViewBookings = () => {
    navigate("/profile/rides");
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
        {error.includes("Payment was not successful") && (
          <p>Redirecting to payment page...</p>
        )}
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="error">
        <h2>Booking Not Found</h2>
        <p>
          No booking information was found. Please try again or contact support.
        </p>
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
          <p className="transaction-id">
            Transaction ID: {paymentInfo.transactionId}
          </p>
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
              <span>
                {booking.car.make} {booking.car.model} ({booking.car.year})
              </span>
            </div>
          )}

          <div className="detail-item">
            <label>Status:</label>
            <span className={`status-${booking.status.toLowerCase()}`}>
              {booking.status}
            </span>
          </div>

          <div className="detail-item">
            <label>Pickup Date:</label>
            <span>{new Date(booking.startDate).toLocaleString()}</span>
          </div>

          <div className="detail-item">
            <label>Return Date:</label>
            <span>{new Date(booking.endDate).toLocaleString()}</span>
          </div>

          <div className="detail-item">
            <label>Pickup Address:</label>
            <span>{booking.pickupAddress}</span>
          </div>

          <div className="detail-item">
            <label>Return Address:</label>
            <span>{booking.returnAddress}</span>
          </div>

          <div className="detail-item">
            <label>Total Price:</label>
            <span className="total-price">${booking.totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="confirmation-actions">
        <button onClick={handleViewBookings} className="view-bookings-button">
          View All Bookings
        </button>
      </div>
    </div>
  );
};

export default CompletedBooking;
