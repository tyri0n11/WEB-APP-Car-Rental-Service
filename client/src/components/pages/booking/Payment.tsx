import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { PaymentProvider } from "../../../types/booking";
import { bookingApi } from "../../../apis/booking";
import StepNavigation from "./StepNavigation";
import "./Payment.css";

const Payment: React.FC = () => {
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    customerName,
    phoneNumber,
    startTime,
    endTime,
    pickupLocation,
    returnLocation,
    totalPrice,
    carId,
  } = state || {};
  
  const handleConfirmPayment = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      // Validate required data
      if (!carId || !startTime || !endTime || !pickupLocation) {
        const missingFields = [];
        if (!carId) missingFields.push("Car ID");
        if (!startTime) missingFields.push("Start Time");
        if (!endTime) missingFields.push("End Time");
        if (!pickupLocation) missingFields.push("Pickup Location");

        const error = `Missing required fields: ${missingFields.join(", ")}`;
        console.error(error);
        setErrorMessage(error);
        setIsLoading(false);
        return;
      }

      const bookingData = {
        carId,
        startDate: new Date(startTime).toISOString(),
        endDate: new Date(endTime).toISOString(),
        pickupAddress: pickupLocation,
        returnAddress: returnLocation || pickupLocation,
        paymentProvider: PaymentProvider.ZALOPAY,
        returnUrl: `${window.location.origin}/completed-booking`, // ZaloPay will append bookingCode and status
      };

      console.log("Creating booking with data:", bookingData);

      // Store booking data in localStorage before redirecting
      localStorage.setItem(
        "pendingBookingData",
        JSON.stringify({
          ...bookingData,
          totalPrice,
          customerName,
          phoneNumber,
          timestamp: new Date().toISOString(),
        })
      );

      const response = await bookingApi.create(bookingData);
      console.log("Received payment URL:", response.paymentUrl);

      if (response.paymentUrl) {
        // Redirect to payment gateway
        window.location.href = response.paymentUrl;
      } else {
        throw new Error("No payment URL provided in response");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to create booking"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <StepNavigation currentStep={2} />

      <h2 className="title">Payment Information</h2>
      {errorMessage && (
        <div
          className="error-message"
          style={{ color: "red", margin: "10px 0" }}
        >
          {errorMessage}
        </div>
      )}
      <div className="payment-info">
        <table className="payment-details">
          <tbody>
            <tr>
              <td>
                <strong>Full Name:</strong>
              </td>
              <td>
                <strong>{customerName}</strong>
              </td>
            </tr>
            <tr>
              <td>
                <strong>Phone Number:</strong>
              </td>
              <td>
                <strong>{phoneNumber}</strong>
              </td>
            </tr>
            <tr>
              <td>
                <strong>Pickup Date:</strong>
              </td>
              <td>
                <strong>{new Date(startTime).toLocaleString()}</strong>
              </td>
            </tr>
            <tr>
              <td>
                <strong>Return Date:</strong>
              </td>
              <td>
                <strong>{new Date(endTime).toLocaleString()}</strong>
              </td>
            </tr>
            <tr>
              <td>
                <strong>Pickup Location:</strong>
              </td>
              <td>
                <strong>{pickupLocation}</strong>
              </td>
            </tr>
            <tr className="total-price">
              <td>
                <strong>Total Price:</strong>
              </td>
              <td>{totalPrice?.toLocaleString()}₫</td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr />

      <button
        className="confirm-button"
        onClick={handleConfirmPayment}
        disabled={isLoading || !carId || !startTime || !endTime || !pickupLocation}
      >
        {isLoading ? "Processing..." : "Confirm Payment"}
      </button>

      <p className="terms">
        By proceeding with the payment, you agree to the{" "}
        <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>.
      </p>
    </div>
  );
};

export default Payment;
