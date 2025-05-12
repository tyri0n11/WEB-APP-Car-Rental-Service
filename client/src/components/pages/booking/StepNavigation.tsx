import React from 'react';
import './StepNavigation.css';
import { useNavigate } from 'react-router-dom';

interface StepNavigationProps {
  currentStep: number; // Current step index (1-based)
}

const steps = [
  'Booking Confirmation',
  'Payment & Hold',
  'Complete booking',
];

const StepNavigation: React.FC<StepNavigationProps> = ({ currentStep }) => {
  const navigate = useNavigate(); // Initialize navigate

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page (CarDetail)
  };

  const handleStepClick = (step: number) => {
    // Navigate to the specific step's page
    if (step === 1) {
      navigate('/booking-confirmation'); // Navigate to Booking Confirm page (Step 1)
    } else if (step === 2) {
      navigate('/payment'); // Navigate to Payment & Hold page (Step 2)
    } 
  };

  return (
    <div className="step-navigation">
      {/* Go Back Button */}
      <button className="back-button" onClick={handleBackClick}>
        ← Go Back
      </button>

      {/* Step Navigation List */}
      <ul className="steps-list">
        {steps.map((step, index) => (
          <li
            key={index}
            className={`step ${currentStep === index + 1 ? 'active' : ''}`}
            onClick={() => handleStepClick(index + 1)} // Navigate to the clicked step
          >
            <div
              className={`circle ${currentStep >= index + 1 ? 'completed' : ''}`}
            >
              {currentStep > index ? '✔' : index + 1}
            </div>
            <span>{step}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StepNavigation;
