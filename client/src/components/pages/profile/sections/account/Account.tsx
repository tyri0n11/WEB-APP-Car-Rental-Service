import React, { useState, useEffect, useRef } from 'react';
import { FaUser, FaEdit, FaSave, FaTimes, FaUpload } from 'react-icons/fa';
import { useAuth } from '../../../../../contexts/AuthContext';
import { useUser } from '../../../../../contexts/UserContext';
import type { User } from '../../../../../types/user';
import type { UpdateProfileInput, UpdateDrivingLicenseInput } from '../../../../../types/user';
import { uploadImage } from '../../../../../utils/image';
import './Account.css';

const Account: React.FC = () => {
  const { user: authUser } = useAuth();
  const { user, updateProfile, updateDrivingLicense, isLoading, error: apiError } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingBack, setUploadingBack] = useState(false);
  const [frontImage, setFrontImage] = useState<string>('');
  const [backImage, setBackImage] = useState<string>('');
  const [debugPayload, setDebugPayload] = useState<string | null>(null);
  const frontLicenseInputRef = useRef<HTMLInputElement>(null);
  const backLicenseInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<UpdateProfileInput & UpdateDrivingLicenseInput>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    avatar: '',
    licenceNumber: '',
    expiryDate: '',
    imageUrls: []
  });

  useEffect(() => {
    if (user) {
      const licenseImages = user.drivingLicence?.drivingLicenseImages || [];
      setFrontImage(licenseImages[0] || '');
      setBackImage(licenseImages[1] || '');
      
      // Format the expiry date to YYYY-MM-DD for the input
      const expiryDate = user.drivingLicence?.expiryDate 
        ? new Date(user.drivingLicence.expiryDate).toISOString().split('T')[0]
        : '';
      
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber || '',
        licenceNumber: user.drivingLicence?.licenceNumber || '',
        expiryDate,
        imageUrls: licenseImages
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
    setSuccess(null);
  };

  const handleLicenseImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    const accessToken = localStorage.getItem('accessToken');
    if (!file || !accessToken) return;

    try {
      if (side === 'front') {
        setUploadingFront(true);
      } else {
        setUploadingBack(true);
      }
      setError(null);

      const imageUrl = await uploadImage(file, accessToken, 'license');

      if (side === 'front') {
        setFrontImage(imageUrl);
        setFormData(prev => ({
          ...prev,
          imageUrls: [imageUrl, prev.imageUrls[1]].filter(Boolean)
        }));
      } else {
        setBackImage(imageUrl);
        setFormData(prev => ({
          ...prev,
          imageUrls: [prev.imageUrls[0], imageUrl].filter(Boolean)
        }));
      }

      setSuccess(`${side === 'front' ? 'Front' : 'Back'} license image uploaded successfully`);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to upload ${side} license image`);
      // Clear the file input
      if (side === 'front') {
        if (frontLicenseInputRef.current) frontLicenseInputRef.current.value = '';
      } else {
        if (backLicenseInputRef.current) backLicenseInputRef.current.value = '';
      }
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

    try {
      setLoading(true);
      setError(null);

      // Update profile
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        avatar: formData.avatar
      });

      // Update driving license with image URLs
      await updateDrivingLicense({
        licenceNumber: formData.licenceNumber,
        expiryDate: new Date(formData.expiryDate).toISOString(),
        imageUrls: [frontImage, backImage].filter(Boolean)
      });

      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setError(null);
    setSuccess(null);
  };

  if (isLoading) {
    return <div className="loading">Loading user data...</div>;
  }

  if (apiError) {
    return <div className="error">{apiError}</div>;
  }

  if (!user) {
    return <div className="error">No user data available</div>;
  }

  return (
    <div className="account-section">
      <div className="section-header">
        <h2><FaUser /> Account Information</h2>
        <button onClick={toggleEdit} className="edit-button">
          {isEditing ? <FaTimes /> : <FaEdit />}
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            disabled={!isEditing}
            required
          />
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            disabled={!isEditing}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={authUser?.email || ''}
            disabled
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            disabled={!isEditing}
            required
            pattern="[0-9]{10}"
            title="Please enter a valid 10-digit phone number"
          />
        </div>

        <div className="license-section">
          <h3>Driving License Information</h3>
          
          <div className="form-group">
            <label>License Number</label>
            <input
              type="text"
              name="licenceNumber"
              value={formData.licenceNumber}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date</label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
            />
          </div>

          <div className="license-images">
            <div className="image-upload">
              <label>Front License Image</label>
              {frontImage && (
                <div className="preview-image">
                  <img src={frontImage} alt="Front License" />
                </div>
              )}
              <input
                type="file"
                ref={frontLicenseInputRef}
                onChange={(e) => handleLicenseImageUpload(e, 'front')}
                disabled={!isEditing || uploadingFront}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => frontLicenseInputRef.current?.click()}
                disabled={!isEditing || uploadingFront}
                className="upload-button"
              >
                <FaUpload /> {uploadingFront ? 'Uploading...' : 'Upload Front'}
              </button>
            </div>

            <div className="image-upload">
              <label>Back License Image</label>
              {backImage && (
                <div className="preview-image">
                  <img src={backImage} alt="Back License" />
                </div>
              )}
              <input
                type="file"
                ref={backLicenseInputRef}
                onChange={(e) => handleLicenseImageUpload(e, 'back')}
                disabled={!isEditing || uploadingBack}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => backLicenseInputRef.current?.click()}
                disabled={!isEditing || uploadingBack}
                className="upload-button"
              >
                <FaUpload /> {uploadingBack ? 'Uploading...' : 'Upload Back'}
              </button>
            </div>
          </div>
        </div>

        {isEditing && (
          <button type="submit" className="save-button" disabled={loading}>
            <FaSave /> Save Changes
          </button>
        )}
      </form>

      {debugPayload && (
        <div className="debug-section">
          <h4>Debug Payload:</h4>
          <pre>{debugPayload}</pre>
        </div>
      )}
    </div>
  );
};

export default Account;
