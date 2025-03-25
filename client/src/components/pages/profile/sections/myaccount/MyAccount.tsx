import React, { useState, useEffect } from 'react';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaUserCircle,
  FaEdit,
} from 'react-icons/fa';
import { useAuth } from '../../../../../hooks/useAuth';
import { User } from '../../../../../types';
import './MyAccount.css';

const MyAccount: React.FC = () => {
  const { user, updateUser } = useAuth();

  const defaultProfilePic: string =
    'https://via.placeholder.com/150?text=Profile';
  const defaultLicensePic: string =
    'https://via.placeholder.com/150x100?text=License';

  // State for editing personal info and validation
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [personalInfo, setPersonalInfo] = useState({
    dobDay: '',
    dobMonth: '',
    dobYear: '',
    gender: '',
    phoneNumber: '',
    email: '',
  });

  // When user changes, initialize personalInfo fields
  useEffect(() => {
    if (user) {
      if (user.dob) {
        const [year, month, day] = user.dob.split('-');
        setPersonalInfo({
          dobDay: day,
          dobMonth: month,
          dobYear: year,
          gender: user.gender || '',
          phoneNumber: user.phoneNumber || '',
          email: user.email || '',
        });
      } else {
        setPersonalInfo({
          dobDay: '',
          dobMonth: '',
          dobYear: '',
          gender: user.gender || '',
          phoneNumber: user.phoneNumber || '',
          email: user.email || '',
        });
      }
    }
  }, [user]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate email
    if (personalInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate phone number (basic validation)
    if (personalInfo.phoneNumber && !/^\+?[\d\s-]{10,}$/.test(personalInfo.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    // Validate date of birth
    if ((personalInfo.dobDay || personalInfo.dobMonth || personalInfo.dobYear) &&
      !(personalInfo.dobDay && personalInfo.dobMonth && personalInfo.dobYear)) {
      newErrors.dob = 'Please complete all date fields';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      // Format the date of birth
      const formattedDob = personalInfo.dobYear && personalInfo.dobMonth && personalInfo.dobDay
        ? `${personalInfo.dobYear}-${personalInfo.dobMonth}-${personalInfo.dobDay}`
        : '';

      // Update user data
      if (user) {
        await updateUser({
          ...user,
          dob: formattedDob || undefined,
          gender: personalInfo.gender || undefined,
          phoneNumber: personalInfo.phoneNumber || undefined,
          email: personalInfo.email || user.email,
        });
      }
      setEditMode(false);
    } catch (error) {
      console.error('Error updating user:', error);
      setErrors({ submit: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Reset errors
    setErrors({});
    // Revert changes to original values from user data
    if (user?.dob) {
      const [year, month, day] = user.dob.split('-');
      setPersonalInfo({
        dobDay: day,
        dobMonth: month,
        dobYear: year,
        gender: user.gender || '',
        phoneNumber: user.phoneNumber || '',
        email: user.email || '',
      });
    }
    setEditMode(false);
  };

  // Format date for display
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return 'Not provided';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  // Options for DOB selects
  const days = Array.from({ length: 31 }, (_, i) =>
    (i + 1).toString().padStart(2, '0')
  );
  const months = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, '0')
  );
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) =>
    (currentYear - i).toString()
  );

  return (
    <div className="myaccount-root">
      {/* General Profile Section */}
      <div className="general-profile">
        {/* Left Column: Profile Picture and Full Name */}
        <div className="profile-left">
          <div className="profile-picture-container">
            <img
              src={user?.profilePic || defaultProfilePic}
              alt="Profile"
              className="profile-picture"
            />
          </div>
          <h3 className="full-name">
            {user?.firstName} {user?.lastName}
          </h3>
        </div>
        {/* Right Column: Personal Information */}
        <div className="profile-right">
          <div className="profile-header">
            <h4>General Profile</h4>
            <button
              className="edit-btn"
              onClick={() => setEditMode(true)}
              disabled={isSubmitting}
            >
              <FaEdit />
            </button>
          </div>
          {editMode ? (
            <div className="edit-form">
              <div className="form-field dob-field">
                <label>Date of Birth:</label>
                <div className="dob-selects">
                  <select
                    name="dobDay"
                    value={personalInfo.dobDay}
                    onChange={handleInputChange}
                    aria-label="Day"
                  >
                    <option value="">Day</option>
                    {days.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                  <select
                    name="dobMonth"
                    value={personalInfo.dobMonth}
                    onChange={handleInputChange}
                    aria-label="Month"
                  >
                    <option value="">Month</option>
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <select
                    name="dobYear"
                    value={personalInfo.dobYear}
                    onChange={handleInputChange}
                    aria-label="Year"
                  >
                    <option value="">Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.dob && <span className="error-message">{errors.dob}</span>}
              </div>
              <div className="form-field">
                <label>Gender:</label>
                <select
                  name="gender"
                  value={personalInfo.gender}
                  onChange={handleInputChange}
                  aria-label="Gender"
                >
                  <option value="">Select</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              <div className="form-field">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={personalInfo.email}
                  onChange={handleInputChange}
                  aria-label="Email"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              <div className="form-field">
                <label>Phone:</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={personalInfo.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="+1 234 567 8900"
                  aria-label="Phone number"
                />
                {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
              </div>
              {errors.submit && <div className="error-message">{errors.submit}</div>}
              <div className="form-actions">
                <button
                  className="cancel-btn"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  className="save-btn"
                  onClick={handleSave}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          ) : (
            <div className="display-info">
              <p>
                <strong>Date of Birth:</strong>{' '}
                {formatDateForDisplay(user?.dob || '')}
              </p>
              <p>
                <strong>Gender:</strong>{' '}
                {user?.gender || 'Not provided'}
              </p>
              <p>
                <strong>Email:</strong>{' '}
                {user?.email || 'Not provided'}
              </p>
              <p>
                <strong>Phone:</strong>{' '}
                {user?.phoneNumber || 'Not provided'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* License Section */}
      <div className="license-section">
        <h4>License</h4>
        <div className="license-content">
          <img
            src={user?.licensePic || defaultLicensePic}
            alt="License"
            className="license-picture"
          />
          <div className="license-status">
            {user?.licensePic ? (
              <FaCheckCircle className="verified-icon" />
            ) : (
              <FaTimesCircle className="not-verified-icon" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
