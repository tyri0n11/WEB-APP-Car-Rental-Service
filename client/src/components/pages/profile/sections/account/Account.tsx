import React, { useState, useEffect, useRef } from 'react';
import { FaUser, FaEdit, FaSave, FaTimes, FaUpload } from 'react-icons/fa';
import { useAuth, User } from '../../../../../contexts/AuthContext';
import {
  fetchUserDetails,
  uploadImage,
  validateFormData,
  updateUserDetails
} from '../../../../../utils/accountUtils';
import './Account.css';

const Account: React.FC = () => {
  const { accessToken, user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingBack, setUploadingBack] = useState(false);
  const [frontImage, setFrontImage] = useState<string>('');
  const [backImage, setBackImage] = useState<string>('');
  const [debugPayload, setDebugPayload] = useState<string | null>(null);
  const frontLicenseInputRef = useRef<HTMLInputElement>(null);
  const backLicenseInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<User>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: '',
    id: '',
    isVerified: false,
    drivingLicenceId: {
      licenceNumber: '',
      drivingLicenseImages: [],
      expiryDate: ''
    }
  });

  const loadUserDetails = async () => {
    try {
      setLoading(true);
      const details = await fetchUserDetails(accessToken || '');

      // Set front and back images from user details
      const licenseImages = details.drivingLicenceId?.drivingLicenseImages || [];
      setFrontImage(licenseImages[0] || '');
      setBackImage(licenseImages[1] || '');

      setFormData({
        ...details,
        drivingLicenceId: {
          licenceNumber: details.drivingLicenceId?.licenceNumber || '',
          drivingLicenseImages: licenseImages,
          expiryDate: details.drivingLicenceId?.expiryDate || ''
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user details');
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      loadUserDetails();
    } else {
      setError('No authentication token available');
      setLoading(false);
    }
  }, [accessToken]);

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
    setError(null);
    setSuccess(null);
  };

  const handleLicenseImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (!file || !accessToken) return;

    try {
      if (side === 'front') {
        setUploadingFront(true);
      } else {
        setUploadingBack(true);
      }
      setError(null);

      // Upload the image using the image/upload endpoint
      const imageUrl = await uploadImage(file, accessToken, 'license');

      // Update the appropriate image state
      if (side === 'front') {
        setFrontImage(imageUrl);
      } else {
        setBackImage(imageUrl);
      }

      // Create the images array with both images
      const images = [frontImage, backImage];
      if (side === 'front') {
        images[0] = imageUrl;
      } else {
        images[1] = imageUrl;
      }

      // Update formData with both images
      setFormData(prev => ({
        ...prev,
        drivingLicenceId: {
          ...prev.drivingLicenceId,
          drivingLicenseImages: images
        }
      }));

      // Show success message
      setSuccess(`${side === 'front' ? 'Front' : 'Back'} license image uploaded successfully`);

      // Prepare the update payload with the correct structure
      const updatePayload = {
        ...formData,
        drivingLicenceId: {
          licenceNumber: formData.drivingLicenceId?.licenceNumber || '',
          drivingLicenseImages: images,
          expiryDate: formData.drivingLicenceId?.expiryDate || ''
        }
      };

      // Update the user with the new images
      await updateUserDetails(updatePayload, accessToken);
      await loadUserDetails(); // Reload user details to get the updated data
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to upload ${side} license image`);
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
    if (!accessToken) return;

    // Validate form data
    const validationErrors = validateFormData(formData);
    if (validationErrors) {
      setError(Object.values(validationErrors)[0]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create the images array with both images
      const images = [frontImage, backImage];

      // Update the formData with the new images
      const updatedFormData = {
        ...formData,
        drivingLicenceId: {
          ...formData.drivingLicenceId,
          drivingLicenseImages: images
        }
      };

      // Set the debug payload
      setDebugPayload(JSON.stringify(updatedFormData, null, 2));

      await updateUserDetails(updatedFormData, accessToken);
      await loadUserDetails(); // Reload user details to get the updated data
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
    if (!isEditing) {
      // Reset form data and images when entering edit mode
      setFormData({
        ...user!,
        drivingLicenceId: {
          licenceNumber: user?.drivingLicenceId?.licenceNumber || '',
          drivingLicenseImages: [frontImage, backImage],
          expiryDate: user?.drivingLicenceId?.expiryDate || ''
        }
      });
    }
  };

  if (loading && initialLoad) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="myaccount-root">
      <div className="content">
        <div className="section">
          <div className="section-header">
            <h2>Account Information</h2>
            {!isEditing ? (
              <button className="edit-button" onClick={toggleEdit}>
                <FaEdit /> Edit
              </button>
            ) : (
              <button className="cancel-button" onClick={toggleEdit}>
                <FaTimes /> Cancel
              </button>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {debugPayload && (
            <div className="debug-section">
              <h4>Debug Information</h4>
              <div className="debug-payload">
                <pre>{debugPayload}</pre>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="account-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={error && !formData.firstName ? 'error' : ''}
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={error && !formData.lastName ? 'error' : ''}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={true}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={error && !formData.phoneNumber ? 'error' : ''}
                />
              </div>
            </div>

            <h3>Driving License Information</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="licenceNumber">License Number</label>
                <input
                  type="text"
                  id="licenceNumber"
                  name="licenceNumber"
                  value={formData.drivingLicenceId?.licenceNumber || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label htmlFor="expiryDate">Expiry Date</label>
                <input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.drivingLicenceId?.expiryDate || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="license-images-section">
              <h4>License Images</h4>
              <div className="license-images-container">
                <div className="license-image-box">
                  <h5>Front of License</h5>
                  <div className="license-image-container">
                    {frontImage ? (
                      <img
                        src={frontImage}
                        alt="Front of Driving License"
                        className="license-image"
                      />
                    ) : (
                      <div className="image-placeholder">
                        <FaUser />
                        <span>No front image</span>
                      </div>
                    )}

                    {isEditing && (
                      <div className="upload-button-container">
                        <button
                          type="button"
                          className="upload-button"
                          onClick={() => frontLicenseInputRef.current?.click()}
                          disabled={uploadingFront}
                        >
                          {uploadingFront ? 'Uploading...' : <><FaUpload /> Upload Front</>}
                        </button>
                        <input
                          type="file"
                          id="frontLicenseImage"
                          ref={frontLicenseInputRef}
                          accept="image/*"
                          onChange={(e) => handleLicenseImageUpload(e, 'front')}
                          className="hidden-input"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="license-image-box">
                  <h5>Back of License</h5>
                  <div className="license-image-container">
                    {backImage ? (
                      <img
                        src={backImage}
                        alt="Back of Driving License"
                        className="license-image"
                      />
                    ) : (
                      <div className="image-placeholder">
                        <FaUser />
                        <span>No back image</span>
                      </div>
                    )}

                    {isEditing && (
                      <div className="upload-button-container">
                        <button
                          type="button"
                          className="upload-button"
                          onClick={() => backLicenseInputRef.current?.click()}
                          disabled={uploadingBack}
                        >
                          {uploadingBack ? 'Uploading...' : <><FaUpload /> Upload Back</>}
                        </button>
                        <input
                          type="file"
                          id="backLicenseImage"
                          ref={backLicenseInputRef}
                          accept="image/*"
                          onChange={(e) => handleLicenseImageUpload(e, 'back')}
                          className="hidden-input"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {isEditing && (
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Saving...' : <><FaSave /> Save Changes</>}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Account;
