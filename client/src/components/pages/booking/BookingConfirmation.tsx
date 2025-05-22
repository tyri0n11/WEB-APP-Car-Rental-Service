import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StepNavigation from './StepNavigation'; // Import StepNavigation component
import './BookingConfirmation.css'; // Import the updated CSS file
import { ROUTES } from '../../../routes/constants/ROUTES';

const BookingConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation(); // Get the passed state data
  const {
    customerName,
    phoneNumber,
    startTime,
    endTime,
    pickupLocation,
    returnLocation,
    totalPrice,
    carId,
    carDetails
  } = state || {};

  // Editable states for customer details
  const [pickupLocationInput, setPickupLocationInput] = useState<string>(pickupLocation || '');
  const [returnLocationInput, setReturnLocationInput] = useState<string>(returnLocation || pickupLocation || '');
  const [customerNameInput, setCustomerNameInput] = useState<string>(customerName || '');
  const [phoneNumberInput, setPhoneNumberInput] = useState<string>(phoneNumber || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Handle Input Changes
  const handlePickupLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPickupLocationInput(e.target.value);
  };

  const handleReturnLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReturnLocationInput(e.target.value);
  };

  const handleCustomerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerNameInput(e.target.value);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumberInput(e.target.value);
  };

  // Handle Booking Confirmation
  const handleConfirmBooking = () => {
    if (!pickupLocationInput) {
      alert('Please enter a pickup location!');
      return;
    }
    if (!returnLocationInput) {
      alert('Please enter a return location!');
      return;
    }
    if (!customerNameInput) {
      alert('Please enter your name!');
      return;
    }
    if (!phoneNumberInput) {
      alert('Please enter your phone number!');
      return;
    }

    setIsSubmitting(true);

    // Navigate to Payment (Step 2)
    navigate(ROUTES.PROTECTED.PAYMENT, {
      state: {
        carId,
        carDetails,
        customerName: customerNameInput,
        phoneNumber: phoneNumberInput,
        startTime,
        endTime,
        pickupLocation: pickupLocationInput,
        returnLocation: returnLocationInput,
        totalPrice
      },
    });
  };

  return (
    <div className="confirmation-container">
      <div className="confirmation-info">
        <StepNavigation currentStep={1} />

        <h2 className="title">Contact Information</h2>

        <form className="booking-form">
          <div className="user-info">
            <label>
              <strong>Full Name:</strong>
              <input
                type="text"
                value={customerNameInput}
                onChange={handleCustomerNameChange}
                placeholder="Enter your name"
                required
              />
            </label>

            <label>
              <strong>Phone Number:</strong>
              <input
                type="text"
                value={phoneNumberInput}
                onChange={handlePhoneNumberChange}
                placeholder="Enter your phone number"
                required
              />
            </label>
          </div>

          <div className="location">
            <label>
              <strong>Pickup Location:</strong>
              <input
                type="text"
                value={pickupLocationInput}
                onChange={handlePickupLocationChange}
                placeholder="Enter pickup location"
                required
              />
            </label>

            <label>
              <strong>Return Location:</strong>
              <input
                type="text"
                value={returnLocationInput}
                onChange={handleReturnLocationChange}
                placeholder="Enter return location"
                required
              />
            </label>
          </div>

          <button
            type="button"
            className="confirm-button"
            onClick={handleConfirmBooking}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Continue to Payment'}
          </button>

          <p className="terms">
            By reserving and renting a car, you agree to the <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>.
          </p>
        </form>
      </div>

      <div className="confirmation-summary">
        <h2 className="title">Booking Information</h2>

        <table className="booking-details-table">
          <tbody>
            <tr>
              <td><strong>Full Name:</strong></td>
              <td>{customerNameInput}</td>
            </tr>
            <tr>
              <td><strong>Phone Number:</strong></td>
              <td>{phoneNumberInput}</td>
            </tr>
            <tr>
              <td><strong>Pickup Date:</strong></td>
              <td>{new Date(startTime).toLocaleString()}</td>
            </tr>
            <tr>
              <td><strong>Return Date:</strong></td>
              <td>{new Date(endTime).toLocaleString()}</td>
            </tr>
            <tr>
              <td><strong>Pickup Location:</strong></td>
              <td>{pickupLocationInput}</td>
            </tr>
            <tr>
              <td><strong>Return Location:</strong></td>
              <td>{returnLocationInput}</td>
            </tr>
            <tr>
              <td><strong>Total Price:</strong></td>
              <td>${totalPrice?.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingConfirmation;
