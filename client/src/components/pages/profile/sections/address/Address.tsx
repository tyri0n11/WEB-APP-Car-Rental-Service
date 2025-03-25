import React, { useState, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';
import { useAuth } from '../../../../../hooks/useAuth';
import './Address.css';

interface Address {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

const Address: React.FC = () => {
    const { user } = useAuth();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [currentAddress, setCurrentAddress] = useState<Address | null>(null);
    const [addressInfo, setAddressInfo] = useState<Address>({
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
    });

    // Fetch current address from database
    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const response = await fetch('/api/users/address');
                if (!response.ok) {
                    throw new Error('Failed to fetch address');
                }
                const data = await response.json();
                setCurrentAddress(data);
            } catch (error) {
                console.error('Error fetching address:', error);
                setErrors({ fetch: 'Failed to load address information' });
            }
        };

        fetchAddress();
    }, []);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!addressInfo.street) {
            newErrors.street = 'Street address is required';
        }

        if (!addressInfo.city) {
            newErrors.city = 'City is required';
        }

        if (!addressInfo.state) {
            newErrors.state = 'State is required';
        }

        if (!addressInfo.postalCode) {
            newErrors.postalCode = 'Postal code is required';
        }

        if (!addressInfo.country) {
            newErrors.country = 'Country is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddressInfo((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        try {
            setIsSubmitting(true);
            const response = await fetch('/api/users/address', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(addressInfo),
            });

            if (!response.ok) {
                throw new Error('Failed to update address');
            }

            const updatedAddress = await response.json();
            setCurrentAddress(updatedAddress);
            setEditMode(false);
        } catch (error) {
            console.error('Error updating address:', error);
            setErrors({ submit: 'Failed to update address. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setErrors({});
        setAddressInfo({
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: '',
        });
        setEditMode(false);
    };

    return (
        <div className="address-root">
            {/* Section 1: Display Current Address */}
            <div className="address-section">
                <div className="address-header">
                    <h4>Address Information</h4>
                    <button
                        className="edit-btn"
                        onClick={() => {
                            if (currentAddress) {
                                setAddressInfo(currentAddress);
                            }
                            setEditMode(true);
                        }}
                        disabled={isSubmitting}
                    >
                        <FaEdit /> Edit Address
                    </button>
                </div>

                {errors.fetch && (
                    <div className="error-message fetch-error">{errors.fetch}</div>
                )}

                {currentAddress ? (
                    <div className="current-address">
                        <div className="address-details">
                            <p><strong>Street:</strong> {currentAddress.street}</p>
                            <p><strong>City:</strong> {currentAddress.city}</p>
                            <p><strong>State:</strong> {currentAddress.state}</p>
                            <p><strong>Postal Code:</strong> {currentAddress.postalCode}</p>
                            <p><strong>Country:</strong> {currentAddress.country}</p>
                        </div>
                    </div>
                ) : (
                    <div className="no-address">
                        <p>No address information available</p>
                    </div>
                )}
            </div>

            {/* Section 2: Update Address Form */}
            {editMode && (
                <div className="address-section update-section">
                    <div className="address-header">
                        <h4>Update Address</h4>
                    </div>

                    <div className="edit-form">
                        <div className="form-field">
                            <label>Street Address:</label>
                            <input
                                type="text"
                                name="street"
                                value={addressInfo.street}
                                onChange={handleInputChange}
                                placeholder="Enter your street address"
                                className={errors.street ? 'error' : ''}
                            />
                            {errors.street && (
                                <span className="error-message">{errors.street}</span>
                            )}
                        </div>

                        <div className="form-field">
                            <label>City:</label>
                            <input
                                type="text"
                                name="city"
                                value={addressInfo.city}
                                onChange={handleInputChange}
                                placeholder="Enter your city"
                                className={errors.city ? 'error' : ''}
                            />
                            {errors.city && (
                                <span className="error-message">{errors.city}</span>
                            )}
                        </div>

                        <div className="form-field">
                            <label>State:</label>
                            <input
                                type="text"
                                name="state"
                                value={addressInfo.state}
                                onChange={handleInputChange}
                                placeholder="Enter your state"
                                className={errors.state ? 'error' : ''}
                            />
                            {errors.state && (
                                <span className="error-message">{errors.state}</span>
                            )}
                        </div>

                        <div className="form-field">
                            <label>Postal Code:</label>
                            <input
                                type="text"
                                name="postalCode"
                                value={addressInfo.postalCode}
                                onChange={handleInputChange}
                                placeholder="Enter your postal code"
                                className={errors.postalCode ? 'error' : ''}
                            />
                            {errors.postalCode && (
                                <span className="error-message">{errors.postalCode}</span>
                            )}
                        </div>

                        <div className="form-field">
                            <label>Country:</label>
                            <input
                                type="text"
                                name="country"
                                value={addressInfo.country}
                                onChange={handleInputChange}
                                placeholder="Enter your country"
                                className={errors.country ? 'error' : ''}
                            />
                            {errors.country && (
                                <span className="error-message">{errors.country}</span>
                            )}
                        </div>

                        {errors.submit && (
                            <div className="error-message submit-error">{errors.submit}</div>
                        )}

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
                                {isSubmitting ? 'Saving...' : 'Save Address'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Address; 