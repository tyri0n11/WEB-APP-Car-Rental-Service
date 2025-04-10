import React, { useState, useEffect, useRef } from 'react';
import { FaUser, FaEdit, FaSave, FaTimes, FaUpload, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../../../../../contexts/AuthContext';
import { useNotification } from '../../../../../contexts/NotificationContext';
import { uploadImage, validateImage } from '../../../../../utils/imageUtils';
import './Account.css';

const Account: React.FC = () => {
  const { user, updateProfile, accessToken } = useAuth();
  const { showNotification } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingBack, setUploadingBack] = useState(false);
  const [frontImage, setFrontImage] = useState<string>('');
  const [backImage, setBackImage] = useState<string>('');
  const frontLicenseInputRef = useRef<HTMLInputElement>(null);
  const backLicenseInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    drivingLicenceId: {
      id: '',
      licenceNumber: '',
      drivingLicenseImages: [] as string[],
      expiryDate: ''
    }
  });

  const loadUserDetails = async () => {
    try {
      setLoading(true);
      if (!user) {
        throw new Error('No user data available');
      }

      const licenseImages = user.drivingLicenceId?.drivingLicenseImages || [];
      setFrontImage(licenseImages[0] || '');
      setBackImage(licenseImages[1] || '');

      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        drivingLicenceId: {
          id: user.drivingLicenceId?.id || '',
          licenceNumber: user.drivingLicenceId?.licenceNumber || '',
          drivingLicenseImages: licenseImages,
          expiryDate: user.drivingLicenceId?.expiryDate || ''
        }
      });
    } catch (err) {
      showNotification('error', err instanceof Error ? err.message : 'Failed to load user details');
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadUserDetails();
    } else {
      setInitialLoad(false);
      setLoading(false);
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'licenceNumber' || name === 'expiryDate') {
      setFormData(prev => ({
        ...prev,
        drivingLicenceId: {
          ...prev.drivingLicenceId,
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleLicenseImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (side === 'front') {
        setUploadingFront(true);
      } else {
        setUploadingBack(true);
      }

      const validationError = validateImage(file);
      if (validationError) {
        showNotification('error', validationError);
        return;
      }

      // Upload the image directly
      const imageUrl = await uploadImage(
        file,
        accessToken || localStorage.getItem('access_token') || '',
        'license'
      );

      if (side === 'front') {
        setFrontImage(imageUrl);
      } else {
        setBackImage(imageUrl);
      }

      const updatedImages = [...formData.drivingLicenceId.drivingLicenseImages];
      if (side === 'front') {
        updatedImages[0] = imageUrl;
      } else {
        updatedImages[1] = imageUrl;
      }

      setFormData(prev => ({
        ...prev,
        drivingLicenceId: {
          ...prev.drivingLicenceId,
          drivingLicenseImages: updatedImages
        }
      }));

      showNotification('success', `${side === 'front' ? 'Front' : 'Back'} license image uploaded successfully`);
    } catch (err) {
      showNotification('error', err instanceof Error ? err.message : `Failed to upload ${side} license image`);
    } finally {
      if (side === 'front') {
        setUploadingFront(false);
      } else {
        setUploadingBack(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);

      // Prepare update data
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        drivingLicenceId: {
          id: formData.drivingLicenceId.id,
          licenceNumber: formData.drivingLicenceId.licenceNumber,
          drivingLicenseImages: [frontImage, backImage].filter(Boolean),
          expiryDate: formData.drivingLicenceId.expiryDate
        }
      };

      await updateProfile(updateData);
      await loadUserDetails();
      showNotification('success', 'Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      showNotification('error', err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing && user) {
      loadUserDetails();
    }
  };

  if (loading && initialLoad) {
    return (
      <div className="profile-section">
        <div className="profile-section-header">
          <h2>Account Information</h2>
        </div>
        <div className="profile-section-content">
          <div className="text-center p-8">
            <FaSpinner className="animate-spin mr-2" /> 
            <span>Loading account details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user && !initialLoad) {
    return (
      <div className="profile-section">
        <div className="profile-section-header">
          <h2>Account Information</h2>
        </div>
        <div className="profile-section-content">
          <p className="error-message text-center p-8">
            Please log in to view your account details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-section">
      <div className="profile-section-header">
        <h2>Account Information</h2>
        {!isEditing ? (
          <button className="profile-button profile-button-primary" onClick={toggleEdit}>
            <FaEdit className="mr-1" /> Edit
          </button>
        ) : (
          <button className="profile-button profile-button-secondary" onClick={toggleEdit}>
            <FaTimes className="mr-1" /> Cancel
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label htmlFor="firstName" className="form-label">First Name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleInputChange}
            className="form-input"
            disabled={!isEditing}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName" className="form-label">Last Name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleInputChange}
            className="form-input"
            disabled={!isEditing}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="form-input"
            disabled={!isEditing}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="licenceNumber" className="form-label">License Number</label>
          <input
            id="licenceNumber"
            name="licenceNumber"
            type="text"
            value={formData.drivingLicenceId.licenceNumber}
            onChange={handleInputChange}
            className="form-input"
            disabled={!isEditing}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="expiryDate" className="form-label">License Expiry Date</label>
          <input
            id="expiryDate"
            name="expiryDate"
            type="date"
            value={formData.drivingLicenceId.expiryDate}
            onChange={handleInputChange}
            className="form-input"
            disabled={!isEditing}
            required
          />
        </div>

        <div className="license-images">
          <div className="license-image-group">
            <label className="form-label">Front License Image</label>
            <div className="license-image-container">
              {frontImage ? (
                <img src={frontImage} alt="Front License" className="license-image" />
              ) : (
                <div className="license-image-placeholder">
                  <FaUser />
                </div>
              )}
              {isEditing && (
                <div className="license-image-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleLicenseImageUpload(e, 'front')}
                    ref={frontLicenseInputRef}
                    className="license-image-input"
                  />
                  <button
                    type="button"
                    className="license-image-button"
                    onClick={() => frontLicenseInputRef.current?.click()}
                    disabled={uploadingFront}
                  >
                    {uploadingFront ? <FaSpinner className="animate-spin mr-1" /> : <FaUpload className="mr-1" />} 
                    {uploadingFront ? 'Uploading...' : 'Upload Front'}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="license-image-group">
            <label className="form-label">Back License Image</label>
            <div className="license-image-container">
              {backImage ? (
                <img src={backImage} alt="Back License" className="license-image" />
              ) : (
                <div className="license-image-placeholder">
                  <FaUser />
                </div>
              )}
              {isEditing && (
                <div className="license-image-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleLicenseImageUpload(e, 'back')}
                    ref={backLicenseInputRef}
                    className="license-image-input"
                  />
                  <button
                    type="button"
                    className="license-image-button"
                    onClick={() => backLicenseInputRef.current?.click()}
                    disabled={uploadingBack}
                  >
                    {uploadingBack ? <FaSpinner className="animate-spin mr-1" /> : <FaUpload className="mr-1" />}
                    {uploadingBack ? 'Uploading...' : 'Upload Back'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="form-actions">
            <button type="submit" className="profile-button profile-button-primary" disabled={loading}>
              {loading ? <FaSpinner className="animate-spin mr-1" /> : <FaSave className="mr-1" />} 
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Account;
