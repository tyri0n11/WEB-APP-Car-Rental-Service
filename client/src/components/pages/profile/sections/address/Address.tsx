import React, { useState, useEffect } from 'react';
import { FaEdit, FaSave, FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import { useAuth } from '../../../../../hooks/useAuth';
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
    const { user, accessToken } = useAuth();
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
                // For now, use dummy data since the API is not ready
                // When the API is ready, uncomment this code
                /*
                const response = await fetch('/api/users/addresses', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch addresses');
                }
                const data = await response.json();
                setAddresses(data);
                */
                
                // Dummy data for testing
                const dummyAddresses: Address[] = [
                    {
                        id: '1',
                        street: '123 Main Street',
                        city: 'New York',
                        state: 'NY',
                        postalCode: '10001',
                        country: 'United States',
                        isDefault: true
                    },
                    {
                        id: '2',
                        street: '456 Park Avenue',
                        city: 'Los Angeles',
                        state: 'CA',
                        postalCode: '90001',
                        country: 'United States',
                        isDefault: false
                    }
                ];
                
                // Simulate API delay
                setTimeout(() => {
                    setAddresses(dummyAddresses);
                }, 1000);
                
            } catch (error) {
                console.error('Error fetching addresses:', error);
                setErrors({ fetch: 'Failed to load address information' });
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
            
            // For now, just update the local state
            // When the API is ready, uncomment this code
            /*
            const response = await fetch('/api/users/addresses', {
                method: editingAddress ? 'PUT' : 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editingAddress 
                    ? { ...addressInfo, id: editingAddress.id } 
                    : addressInfo
                ),
            });

            if (!response.ok) {
                throw new Error('Failed to update address');
            }

            const updatedAddress = await response.json();
            if (editingAddress) {
                setAddresses(addresses.map(addr => 
                    addr.id === editingAddress.id ? updatedAddress : addr
                ));
            } else {
                setAddresses([...addresses, updatedAddress]);
            }
            */
            
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
            console.error('Error updating address:', error);
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
            // For now, just update the local state
            // When the API is ready, uncomment this code
            /*
            const response = await fetch(`/api/users/addresses/${addressId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete address');
            }
            */
            
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
            console.error('Error deleting address:', error);
            setErrors({ delete: 'Failed to delete address. Please try again.' });
        }
    };

    const handleSetDefault = async (addressId: string) => {
        try {
            // For now, just update the local state
            // When the API is ready, uncomment this code
            /*
            const response = await fetch(`/api/users/addresses/${addressId}/default`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to set default address');
            }
            */
            
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
            console.error('Error setting default address:', error);
            setErrors({ default: 'Failed to set default address. Please try again.' });
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

                {successMessage && (
                    <div className="success-message">
                        {successMessage}
                    </div>
                )}

                {errors.fetch && (
                    <div className="error-message">
                        {errors.fetch}
                    </div>
                )}

                {errors.submit && (
                    <div className="error-message">
                        {errors.submit}
                    </div>
                )}

                {errors.delete && (
                    <div className="error-message">
                        {errors.delete}
                    </div>
                )}

                {errors.default && (
                    <div className="error-message">
                        {errors.default}
                    </div>
                )}

                {editMode ? (
                    <div className="address-form">
                        <div className="form-group">
                            <label htmlFor="street">Street Address</label>
                            <input
                                type="text"
                                id="street"
                                name="street"
                                value={addressInfo.street}
                                onChange={handleInputChange}
                                placeholder="Enter street address"
                                className={errors.street ? 'error' : ''}
                            />
                            {errors.street && <span className="error-text">{errors.street}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="city">City</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={addressInfo.city}
                                onChange={handleInputChange}
                                placeholder="Enter city"
                                className={errors.city ? 'error' : ''}
                            />
                            {errors.city && <span className="error-text">{errors.city}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="state">State/Province</label>
                            <input
                                type="text"
                                id="state"
                                name="state"
                                value={addressInfo.state}
                                onChange={handleInputChange}
                                placeholder="Enter state or province"
                                className={errors.state ? 'error' : ''}
                            />
                            {errors.state && <span className="error-text">{errors.state}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="postalCode">Postal Code</label>
                            <input
                                type="text"
                                id="postalCode"
                                name="postalCode"
                                value={addressInfo.postalCode}
                                onChange={handleInputChange}
                                placeholder="Enter postal code"
                                className={errors.postalCode ? 'error' : ''}
                            />
                            {errors.postalCode && <span className="error-text">{errors.postalCode}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="country">Country</label>
                            <input
                                type="text"
                                id="country"
                                name="country"
                                value={addressInfo.country}
                                onChange={handleInputChange}
                                placeholder="Enter country"
                                className={errors.country ? 'error' : ''}
                            />
                            {errors.country && <span className="error-text">{errors.country}</span>}
                        </div>

                        <div className="form-group checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="isDefault"
                                    checked={addressInfo.isDefault}
                                    onChange={handleInputChange}
                                />
                                Set as default address for car rentals
                            </label>
                        </div>

                        <div className="form-actions">
                            <button 
                                className="save-button" 
                                onClick={handleSave}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Saving...' : <><FaSave /> {editingAddress ? 'Update' : 'Save'}</>}
                            </button>
                            <button 
                                className="cancel-button" 
                                onClick={handleCancel}
                                disabled={isSubmitting}
                            >
                                <FaTimes /> Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="address-list">
                        {addresses.length > 0 ? (
                            addresses.map(address => (
                                <div key={address.id} className="address-card">
                                    {address.isDefault && (
                                        <span className="default-badge">Default Address</span>
                                    )}
                                    <div className="address-details">
                                        <p>{formatAddress(address)}</p>
                                    </div>
                                    <div className="address-actions">
                                        <button 
                                            className="edit-address-btn"
                                            onClick={() => handleEdit(address)}
                                        >
                                            <FaEdit /> Edit
                                        </button>
                                        <button 
                                            className="delete-address-btn"
                                            onClick={() => handleDelete(address.id)}
                                        >
                                            <FaTrash /> Delete
                                        </button>
                                        {!address.isDefault && (
                                            <button 
                                                className="set-default-btn"
                                                onClick={() => handleSetDefault(address.id)}
                                            >
                                                Set as Default
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="address-empty">
                                <p>No addresses saved yet.</p>
                                <button className="add-button" onClick={handleAddNew}>
                                    <FaPlus /> Add Address
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Address; 