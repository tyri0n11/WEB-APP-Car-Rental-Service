import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StepNavigation from './StepNavigation'; // Import StepNavigation component
import './BookingConfirmation.css'; // Import the updated CSS file

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
    carId
  } = state || {};

  // Editable states for customer details
  const [pickupLocationInput, setPickupLocationInput] = useState<string>(pickupLocation || ''); // Use initial pickupLocation from state
  const [returnLocationInput, setReturnLocationInput] = useState<string>(returnLocation || '');
  const [customerNameInput, setCustomerNameInput] = useState<string>(customerName || '');
  const [phoneNumberInput, setPhoneNumberInput] = useState<string>(phoneNumber || ''); // Editable phone number state
  const [currentStep, setCurrentStep] = useState<number>(1); // Set current step to 'Booking Confirm' (step 1)

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
    setPhoneNumberInput(e.target.value); // Update phone number state
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

    // Proceed with confirmation logic
    console.log('Booking confirmed:', { pickupLocationInput });
    console.log('Booking confirmed:', { returnLocationInput });
    console.log('Booking confirmed:', { phoneNumberInput });

    setCurrentStep(2);

    const paymentUrl = "https://example.com/payment";  // Example payment URL
    
    // Navigate to Payment & Hold (Step 2)
    navigate('/payment-hold', {
      state: {
        carId,
        customerName: customerNameInput, // Pass the updated customer name
        phoneNumber: phoneNumberInput, // Pass the updated phone number
        startTime,
        endTime,
        pickupLocation: pickupLocationInput,  // Pass the updated pickupLocation here
        returnLocation: returnLocationInput, // Pass the updated return location
        totalPrice,
        paymentUrl,
      },
    });
  };

  return (
    <div className="confirmation-container">
      <div className="confirmation-info">
        <StepNavigation currentStep={currentStep} /> {/* Dynamically set currentStep */}
        
        <h2 className="title">Contact Information</h2>

        {/* Form for Customer Info and Pickup Location */}
        <form className="booking-form">
          <div className="user-info">
            <label>
              <strong>Full Name:</strong>
              <input 
                type="text" 
                value={customerNameInput} 
                onChange={handleCustomerNameChange} // Update customer name
                placeholder="Enter your name"
              />
            </label>

            <label>
              <strong>Phone Number:</strong>
              <input 
                type="text" 
                value={phoneNumberInput} // Use phoneNumberInput state here
                onChange={handlePhoneNumberChange} // Update phone number
                placeholder="Enter your phone number"
              />
            </label>
          </div>

          <div className="location">
            <label>
              <strong>Pickup Location:</strong>
              <input
                type="text"
                value={pickupLocationInput}
                onChange={handlePickupLocationChange} // Update pickup location
                placeholder="Enter pickup location"
              />
            </label>

            <label>
              <strong>Return Location:</strong>
              <input
                type="text"
                value={returnLocationInput}
                onChange={handleReturnLocationChange} // Update return location
                placeholder="Enter return location"
              />
            </label>
          </div>

          <button className="confirm-button" onClick={handleConfirmBooking}>
            Confirm
          </button>

          <p className="terms">
            By reserving and renting a car, you agree to the <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>.
          </p>
        </form>
      </div>

      <div className="confirmation-summary">
        <h2 className="title">Booking Information</h2>

        {/* Booking Details in Table */}
        <table className="booking-details-table">
          <tbody>
            <tr><strong>Full Name:</strong></tr>
            <tr><td>{customerNameInput}</td></tr>

            <tr><strong>Phone Number:</strong></tr>
            <tr><td>{phoneNumberInput}</td></tr>

            <tr><strong>Pickup Date:</strong></tr>
            <tr><td>{new Date(startTime).toLocaleString()}</td></tr>

            <tr><strong>Return Date:</strong></tr>
            <tr><td>{new Date(endTime).toLocaleString()}</td></tr>

            <tr><strong>Pickup Location:</strong></tr>
            <tr><td>{pickupLocationInput}</td></tr>

            <tr><strong>Return Location:</strong></tr>
            <tr><td>{returnLocationInput}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingConfirmation;
