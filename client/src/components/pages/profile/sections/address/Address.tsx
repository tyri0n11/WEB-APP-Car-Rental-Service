import React, { useState, useEffect } from 'react';
import { FaEdit, FaSave, FaTimes, FaPlus, FaTrash, FaStar } from 'react-icons/fa';
import { useAddress, Address as AddressType } from '../../../../../contexts/AddressContext';
import { useNotification } from '../../../../../contexts/NotificationContext';
import './Address.css';

interface AddressFormData {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    isDefault: boolean;
}

const initialFormData: AddressFormData = {
    street: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    isDefault: false,
};

const Address: React.FC = () => {
    const { addresses, loading, error, fetchAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAddress();
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState<AddressFormData>(initialFormData);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<Partial<AddressFormData>>({});

    useEffect(() => {
        fetchAddresses();
    }, [fetchAddresses]);

    const validateForm = (): boolean => {
        const errors: Partial<AddressFormData> = {};
        if (!formData.street.trim()) errors.street = 'Street is required';
        if (!formData.city.trim()) errors.city = 'City is required';
        if (!formData.state.trim()) errors.state = 'State is required';
        if (!formData.country.trim()) errors.country = 'Country is required';
        if (!formData.postalCode.trim()) errors.postalCode = 'Postal code is required';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        try {
            if (editingId) {
                await updateAddress(editingId, formData);
                showNotification('success', 'Address updated successfully');
            } else {
                await addAddress(formData);
                showNotification('success', 'Address added successfully');
            }
            setFormData(initialFormData);
            setEditingId(null);
            setFormErrors({});
        } catch (error) {
            showNotification('error', 'Failed to save address');
        }
    };

    const handleCancel = () => {
        setFormData(initialFormData);
        setEditingId(null);
        setFormErrors({});
    };

    const handleEdit = (address: AddressType) => {
        setFormData({
            street: address.street,
            city: address.city,
            state: address.state,
            country: address.country,
            postalCode: address.postalCode,
            isDefault: address.isDefault,
        });
        setEditingId(address.id);
    };

    const handleAddNew = () => {
        setFormData(initialFormData);
        setEditingId(null);
        setFormErrors({});
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            try {
                await deleteAddress(id);
                showNotification('success', 'Address deleted successfully');
            } catch (error) {
                showNotification('error', 'Failed to delete address');
            }
        }
    };

    const handleSetDefault = async (id: string) => {
        try {
            await setDefaultAddress(id);
            showNotification('success', 'Default address updated successfully');
        } catch (error) {
            showNotification('error', 'Failed to set default address');
        }
    };

    const formatAddress = (address: AddressType): string => {
        return `${address.street}, ${address.city}, ${address.state}, ${address.country} ${address.postalCode}`;
    };

    return (
        <div className="address-section">
            <div className="address-section-header">
                <h2>My Addresses</h2>
                <button className="add-address-btn" onClick={handleAddNew}>
                    <FaPlus /> Add New Address
                </button>
            </div>

            {loading && <div className="loading">Loading addresses...</div>}
            {error && <div className="error">{error}</div>}

            <div className="address-list">
                {addresses.map((address) => (
                    <div key={address.id} className="address-card">
                        <div className="address-content">
                            <p className="address-text">{formatAddress(address)}</p>
                            {address.isDefault && <span className="default-badge">Default</span>}
                        </div>
                        <div className="address-actions">
                            <button
                                className="action-btn edit"
                                onClick={() => handleEdit(address)}
                                title="Edit"
                            >
                                <FaEdit />
                            </button>
                            <button
                                className="action-btn delete"
                                onClick={() => handleDelete(address.id)}
                                title="Delete"
                            >
                                <FaTrash />
                            </button>
                            {!address.isDefault && (
                                <button
                                    className="action-btn default"
                                    onClick={() => handleSetDefault(address.id)}
                                    title="Set as Default"
                                >
                                    <FaStar />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {(editingId !== null || addresses.length === 0) && (
                <div className="address-form">
                    <h3>{editingId ? 'Edit Address' : 'Add New Address'}</h3>
                    <div className="form-group">
                        <label htmlFor="street">Street Address</label>
                        <input
                            type="text"
                            id="street"
                            name="street"
                            value={formData.street}
                            onChange={handleInputChange}
                            className={formErrors.street ? 'error' : ''}
                        />
                        {formErrors.street && <span className="error-message">{formErrors.street}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="city">City</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className={formErrors.city ? 'error' : ''}
                        />
                        {formErrors.city && <span className="error-message">{formErrors.city}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="state">State</label>
                        <input
                            type="text"
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            className={formErrors.state ? 'error' : ''}
                        />
                        {formErrors.state && <span className="error-message">{formErrors.state}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="country">Country</label>
                        <input
                            type="text"
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className={formErrors.country ? 'error' : ''}
                        />
                        {formErrors.country && <span className="error-message">{formErrors.country}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="postalCode">Postal Code</label>
                        <input
                            type="text"
                            id="postalCode"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            className={formErrors.postalCode ? 'error' : ''}
                        />
                        {formErrors.postalCode && <span className="error-message">{formErrors.postalCode}</span>}
                    </div>

                    <div className="form-group checkbox">
                        <label>
                            <input
                                type="checkbox"
                                name="isDefault"
                                checked={formData.isDefault}
                                onChange={handleInputChange}
                            />
                            Set as default address
                        </label>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="save-btn" onClick={handleSave}>
                            <FaSave /> Save
                        </button>
                        <button type="button" className="cancel-btn" onClick={handleCancel}>
                            <FaTimes /> Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Address; 