import React, { useState, useEffect } from 'react';
import { FaEdit, FaSave, FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import { useAuth } from '../../../../../hooks/useAuth';
import addressesDummyData from '../../../../../utils/dummy/addresses.json';
import './Address.css';

interface Address {
    id: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault?: boolean;
}

const Address: React.FC = () => {
    const { accessToken } = useAuth();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [addressInfo, setAddressInfo] = useState<Omit<Address, 'id'>>({
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        isDefault: false
    });

    // Fetch addresses from database
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                // Use dummy data from separate JSON file
                const dummyAddresses: Address[] = addressesDummyData;
                
                // Simulate API delay
                setTimeout(() => {
                    setAddresses(dummyAddresses);
                }, 1000);
                
            } catch (err) {
                console.error('Error fetching addresses:', err);
            }
        };

        fetchAddresses();
    }, [accessToken]);

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
        const { name, value, type, checked } = e.target;
        setAddressInfo((prev) => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        try {
            setIsSubmitting(true);
            setSuccessMessage(null);
            
            // Simulate API delay
            setTimeout(() => {
                if (editingAddress) {
                    const updatedAddress = {
                        ...editingAddress,
                        ...addressInfo
                    };
                    setAddresses(addresses.map(addr => 
                        addr.id === editingAddress.id ? updatedAddress : addr
                    ));
                } else {
                    const newAddress = {
                        ...addressInfo,
                        id: Date.now().toString()
                    };
                    setAddresses([...addresses, newAddress]);
                }
                
                setEditMode(false);
                setEditingAddress(null);
                setIsSubmitting(false);
                setSuccessMessage(`Address ${editingAddress ? 'updated' : 'added'} successfully!`);
                
                // Clear success message after 5 seconds
                setTimeout(() => {
                    setSuccessMessage(null);
                }, 5000);
            }, 1000);
            
        } catch (error) {
            setErrors({ submit: 'Failed to update address. Please try again.' });
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
            isDefault: false
        });
        setEditMode(false);
        setEditingAddress(null);
    };

    const handleEdit = (address: Address) => {
        setEditingAddress(address);
        setAddressInfo({
            street: address.street,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country,
            isDefault: address.isDefault
        });
        setEditMode(true);
    };

    const handleAddNew = () => {
        setEditingAddress(null);
        setAddressInfo({
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: '',
            isDefault: false
        });
        setEditMode(true);
    };

    const handleDelete = async (addressId: string) => {
        try {
            // Simulate API delay
            setTimeout(() => {
                setAddresses(addresses.filter(addr => addr.id !== addressId));
                setSuccessMessage('Address deleted successfully!');
                
                // Clear success message after 5 seconds
                setTimeout(() => {
                    setSuccessMessage(null);
                }, 5000);
            }, 1000);
        } catch (error) {
            setErrors({ submit: 'Failed to delete address. Please try again.' });
        }
    };

    const handleSetDefault = async (addressId: string) => {
        try {
            // Simulate API delay
            setTimeout(() => {
                setAddresses(addresses.map(addr => ({
                    ...addr,
                    isDefault: addr.id === addressId
                })));
                setSuccessMessage('Default address updated successfully!');
                
                // Clear success message after 5 seconds
                setTimeout(() => {
                    setSuccessMessage(null);
                }, 5000);
            }, 1000);
        } catch (error) {
            setErrors({ submit: 'Failed to update default address. Please try again.' });
        }
    };

    const formatAddress = (address: Address) => {
        return `${address.street}, ${address.city}, ${address.state} ${address.postalCode}, ${address.country}`;
    };

    return (
        <div className="address-root">
            <div className="address-section">
                <div className="address-header">
                    <h4>My Addresses</h4>
                    {!editMode && (
                        <button className="add-button" onClick={handleAddNew}>
                            <FaPlus /> Add New Address
                        </button>
                    )}
                </div>

                {errors.fetch && (
                    <div className="error-message">{errors.fetch}</div>
                )}

                {successMessage && (
                    <div className="success-message">{successMessage}</div>
                )}

                {editMode ? (
                    <div className="address-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="street">Street Address</label>
                                <input
                                    type="text"
                                    id="street"
                                    name="street"
                                    value={addressInfo.street}
                                    onChange={handleInputChange}
                                    className={errors.street ? 'error' : ''}
                                />
                                {errors.street && (
                                    <span className="error-message">{errors.street}</span>
                                )}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="city">City</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={addressInfo.city}
                                    onChange={handleInputChange}
                                    className={errors.city ? 'error' : ''}
                                />
                                {errors.city && (
                                    <span className="error-message">{errors.city}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="state">State</label>
                                <input
                                    type="text"
                                    id="state"
                                    name="state"
                                    value={addressInfo.state}
                                    onChange={handleInputChange}
                                    className={errors.state ? 'error' : ''}
                                />
                                {errors.state && (
                                    <span className="error-message">{errors.state}</span>
                                )}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="postalCode">Postal Code</label>
                                <input
                                    type="text"
                                    id="postalCode"
                                    name="postalCode"
                                    value={addressInfo.postalCode}
                                    onChange={handleInputChange}
                                    className={errors.postalCode ? 'error' : ''}
                                />
                                {errors.postalCode && (
                                    <span className="error-message">{errors.postalCode}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="country">Country</label>
                                <input
                                    type="text"
                                    id="country"
                                    name="country"
                                    value={addressInfo.country}
                                    onChange={handleInputChange}
                                    className={errors.country ? 'error' : ''}
                                />
                                {errors.country && (
                                    <span className="error-message">{errors.country}</span>
                                )}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group checkbox">
                                <input
                                    type="checkbox"
                                    id="isDefault"
                                    name="isDefault"
                                    checked={addressInfo.isDefault}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="isDefault">Set as default address</label>
                            </div>
                        </div>

                        {errors.submit && (
                            <div className="error-message">{errors.submit}</div>
                        )}

                        <div className="form-actions">
                            <button
                                type="button"
                                className="save-button"
                                onClick={handleSave}
                                disabled={isSubmitting}
                            >
                                <FaSave /> {isSubmitting ? 'Saving...' : 'Save Address'}
                            </button>
                            <button
                                type="button"
                                className="cancel-button"
                                onClick={handleCancel}
                                disabled={isSubmitting}
                            >
                                <FaTimes /> Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="addresses-list">
                        {addresses.length === 0 ? (
                            <div className="no-addresses">
                                <p>No addresses found. Add your first address!</p>
                            </div>
                        ) : (
                            addresses.map((address) => (
                                <div key={address.id} className="address-card">
                                    <div className="address-content">
                                        <p className="address-text">{formatAddress(address)}</p>
                                        {address.isDefault && (
                                            <span className="default-badge">Default</span>
                                        )}
                                    </div>
                                    <div className="address-actions">
                                        <button
                                            className="edit-button"
                                            onClick={() => handleEdit(address)}
                                        >
                                            <FaEdit /> Edit
                                        </button>
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDelete(address.id)}
                                        >
                                            <FaTrash /> Delete
                                        </button>
                                        {!address.isDefault && (
                                            <button
                                                className="default-button"
                                                onClick={() => handleSetDefault(address.id)}
                                            >
                                                Set as Default
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Address; 