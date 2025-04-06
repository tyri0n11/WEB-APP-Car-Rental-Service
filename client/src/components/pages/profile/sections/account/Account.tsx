import React, { useState, useEffect, useRef } from 'react';
import { FaUser, FaEdit, FaSave, FaTimes, FaUpload } from 'react-icons/fa';
import { useAuth } from '../../../../../contexts/AuthContext';
import { ExtendedUser, AccountFormData } from '../../../../../utils/profileTypes';
import { 
  fetchUserDetails, 
  uploadImage, 
  validateFormData, 
  updateUserDetails
} from '../../../../../utils/accountUtils';
import './Account.css';

const Account: React.FC = () => {
  const { accessToken } = useAuth();
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingBack, setUploadingBack] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [lastUploadedImageUrl, setLastUploadedImageUrl] = useState<string | null>(null);
  const frontLicenseInputRef = useRef<HTMLInputElement>(null);
  const backLicenseInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<AccountFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    profileImage: '',
    drivingLicence: {
      licenceNumber: '',
      expiryDate: '',
      drivingLicenseImages: []
    }
  });

  const loadUserDetails = async () => {
    try {
      setLoading(true);
      const details = await fetchUserDetails(accessToken || '');
      console.log('Loaded user details:', details);
      setUser(details);
      setFormData({
        firstName: details.firstName || '',
        lastName: details.lastName || '',
        email: details.email || '',
        phoneNumber: details.phoneNumber || '',
        profileImage: details.profileImage || '',
        drivingLicence: {
          licenceNumber: details.drivingLicence?.licenceNumber || '',
          expiryDate: details.drivingLicence?.expiryDate || '',
          drivingLicenseImages: details.drivingLicence?.drivingLicenseImages || []
        }
      });
      
      // Add debug info about the loaded details
      setDebugInfo(prev => `${prev || ''}\nLoaded user details: ${JSON.stringify(details, null, 2)}`);
    } catch (err) {
      console.error('Error loading user details:', err);
      setError(err instanceof Error ? err.message : 'Failed to load user details');
      setDebugInfo(prev => `${prev || ''}\nError loading user details: ${err instanceof Error ? err.message : String(err)}`);
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
        drivingLicence: {
          ...prev.drivingLicence,
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
      
      // Add debug info about the file being uploaded
      setDebugInfo(prev => `${prev || ''}\nUploading ${side} license image: ${file.name} (${file.size} bytes)`);
      
      // Upload the image using the image/upload endpoint
      const imageUrl = await uploadImage(file, accessToken);
      console.log(`Uploaded ${side} license image URL:`, imageUrl);
      
      // Store the uploaded image URL for immediate display
      setLastUploadedImageUrl(imageUrl);
      
      // Add debug info about the uploaded image URL
      setDebugInfo(prev => `${prev || ''}\nUploaded ${side} license image URL: ${imageUrl}`);
      
      // Get current license images
      const currentImages = user?.drivingLicence?.drivingLicenseImages || [];
      console.log('Current license images:', currentImages);
      
      // Update the user's driving license images
      if (user) {
        // Create a new array with the updated image
        let updatedImages = [...currentImages];
        
        // If we're uploading the front image (index 0)
        if (side === 'front') {
          if (updatedImages.length > 0) {
            updatedImages[0] = imageUrl;
          } else {
            updatedImages.push(imageUrl);
          }
        } 
        // If we're uploading the back image (index 1)
        else {
          if (updatedImages.length > 1) {
            updatedImages[1] = imageUrl;
          } else if (updatedImages.length === 1) {
            updatedImages.push(imageUrl);
          } else {
            // If we don't have any images yet, add a placeholder for the front
            updatedImages.push('');
            updatedImages.push(imageUrl);
          }
        }
        
        console.log('Updated license images array:', updatedImages);
        
        // Update the form data immediately to display the image
        setFormData(prev => ({
          ...prev,
          drivingLicence: {
            ...prev.drivingLicence,
            drivingLicenseImages: updatedImages
          }
        }));
        
        // Show success message with the image URL
        setSuccess(`${side === 'front' ? 'Front' : 'Back'} license image uploaded successfully. URL: ${imageUrl}`);
        
        // Prepare the update payload
        const updatePayload = {
          ...formData,
          drivingLicence: {
            ...formData.drivingLicence,
            drivingLicenseImages: updatedImages
          }
        };
        
        // Add debug info about the update payload
        setDebugInfo(prev => `${prev || ''}\nUpdate payload: ${JSON.stringify(updatePayload, null, 2)}`);
        
        // Update the user with the new images
        const updatedUser = await updateUserDetails(updatePayload, accessToken);
        console.log('User updated with new images:', updatedUser);
        
        // Add debug info about the update response
        setDebugInfo(prev => `${prev || ''}\nUpdate response: ${JSON.stringify(updatedUser, null, 2)}`);
        
        // Force a reload of the user details to ensure we have the latest data
        await loadUserDetails();
        
        setSuccess(`${side === 'front' ? 'Front' : 'Back'} license image updated successfully`);
      }
    } catch (err) {
      console.error(`Error uploading ${side} license image:`, err);
      setError(err instanceof Error ? err.message : `Failed to upload ${side} license image`);
      
      // Add debug info about the error
      setDebugInfo(prev => `${prev || ''}\nError uploading ${side} license image: ${err instanceof Error ? err.message : 'Unknown error'}`);
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
      
      // Include the current license images in the update
      const updatePayload = {
        ...formData,
        drivingLicence: {
          licenceNumber: formData.drivingLicence?.licenceNumber || '',
          expiryDate: formData.drivingLicence?.expiryDate || '',
          drivingLicenseImages: user?.drivingLicence?.drivingLicenseImages || []
        }
      };
      
      console.log('Form submit payload:', updatePayload);
      
      // Add debug info about the form submit payload
      setDebugInfo(prev => `${prev || ''}\nForm submit payload: ${JSON.stringify(updatePayload, null, 2)}`);
      
      const updatedUser = await updateUserDetails(updatePayload, accessToken);
      
      console.log('Form submit response:', updatedUser);
      
      // Add debug info about the form submit response
      setDebugInfo(prev => `${prev || ''}\nForm submit response: ${JSON.stringify(updatedUser, null, 2)}`);
      
      setUser(updatedUser);
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      
      // Add debug info about the error
      setDebugInfo(prev => `${prev || ''}\nError updating profile: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setError(null);
    setSuccess(null);
  };

  if (loading && initialLoad) {
    return (
      <div className="myaccount-root">
        <div className="content">
          <div className="section">
            <div className="skeleton-loader">
              <div className="skeleton-text"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="myaccount-root">
        <div className="content">
          <div className="section error-section">
            <p className="error-message">{error}</p>
            <button onClick={loadUserDetails} className="retry-button">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Get license images
  const licenseImages = user?.drivingLicence?.drivingLicenseImages || [];
  const frontLicenseImage = licenseImages[0] || '';
  const backLicenseImage = licenseImages[1] || '';
  
  console.log('Rendering with license images:', {
    allImages: licenseImages,
    frontImage: frontLicenseImage,
    backImage: backLicenseImage
  });

  // Force image refresh by adding a timestamp to the URL
  const getImageUrl = (url: string) => {
    if (!url) return '';
    // Add a timestamp to force browser to reload the image
    return `${url}?t=${new Date().getTime()}`;
  };

  return (
    <div className="myaccount-root">
      <div className="content">
        <div className="section">
          <div className="section-header">
            <h2>Personal Information</h2>
            {!isEditing ? (
              <button onClick={toggleEdit} className="edit-button">
                <FaEdit /> Edit
              </button>
            ) : (
              <button onClick={toggleEdit} className="cancel-button">
                <FaTimes /> Cancel
              </button>
            )}
          </div>
          
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          
          {lastUploadedImageUrl && (
            <div className="uploaded-image-preview">
              <h4>Last Uploaded Image</h4>
              <div className="image-preview-container">
                <img 
                  src={lastUploadedImageUrl} 
                  alt="Last Uploaded Image" 
                  className="preview-image" 
                />
              </div>
              <div className="image-url">
                <strong>Image URL:</strong> {lastUploadedImageUrl}
              </div>
            </div>
          )}
          
          {debugInfo && (
            <div className="debug-info">
              <h4>Debug Information</h4>
              <pre>{debugInfo}</pre>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="account-form">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
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
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
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
              />
            </div>
            
            <h3>Driving License Information</h3>
            
            <div className="form-group">
              <label htmlFor="licenceNumber">License Number</label>
              <input
                type="text"
                id="licenceNumber"
                name="licenceNumber"
                value={formData.drivingLicence?.licenceNumber}
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
                value={formData.drivingLicence?.expiryDate}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            
            <div className="license-images-section">
              <h4>License Images</h4>
              <div className="license-images-container">
                <div className="license-image-box">
                  <h5>Front of License</h5>
                  <div className="license-image-container">
                    {frontLicenseImage ? (
                      <img 
                        key={`front-${frontLicenseImage}`}
                        src={getImageUrl(frontLicenseImage)} 
                        alt="Front of Driving License" 
                        className="license-image" 
                        onError={(e) => {
                          console.error('Error loading front image:', e);
                          setDebugInfo(prev => `${prev}\nError loading front image: ${frontLicenseImage}`);
                          // Try to load the image directly from the URL
                          const img = e.target as HTMLImageElement;
                          img.src = frontLicenseImage;
                        }}
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
                    {backLicenseImage ? (
                      <img 
                        key={`back-${backLicenseImage}`}
                        src={getImageUrl(backLicenseImage)} 
                        alt="Back of Driving License" 
                        className="license-image" 
                        onError={(e) => {
                          console.error('Error loading back image:', e);
                          setDebugInfo(prev => `${prev}\nError loading back image: ${backLicenseImage}`);
                          // Try to load the image directly from the URL
                          const img = e.target as HTMLImageElement;
                          img.src = backLicenseImage;
                        }}
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
