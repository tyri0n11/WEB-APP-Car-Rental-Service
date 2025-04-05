import React, { useEffect, useState, useRef } from 'react';
import { FaUser, FaEdit, FaSave, FaTimes, FaUpload, FaImage } from 'react-icons/fa';
import { useAuth } from '../../../../../contexts/AuthContext';
import './MyAccount.css';

const API_BASE_URL = 'http://localhost:3000';

// Define the driving license interface
interface DrivingLicence {
  licenceNumber: string;
  drivingLicenseImages: string[];
  expiryDate: string;
}

// Define the extended user type that includes driving license details
type ExtendedUser = {
  drivingLicence?: DrivingLicence;
}

const MyAccount: React.FC = () => {
  const { user, accessToken } = useAuth();
  const [userDetails, setUserDetails] = useState<(typeof user & ExtendedUser) | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    licenceNumber: '',
    expiryDate: '',
  });

  useEffect(() => {
    if (accessToken) {
      fetchUserDetails();
    } else {
      setError('No authentication token available. Please log in.');
      setLoading(false);
    }
  }, [accessToken, user]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!accessToken) {
        throw new Error('No authentication token available. Please log in.');
      }

      // First get the user ID from /auth/me endpoint
      const meResponse = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!meResponse.ok) {
        if (meResponse.status === 401) {
          throw new Error('Authentication token expired. Please log in again.');
        }
        throw new Error('Failed to fetch user details from /auth/me');
      }

      const meResult = await meResponse.json();
      
      // Check if the response has the expected structure
      if (!meResult?.data) {
        throw new Error('Invalid response format from /auth/me');
      }
      
      const meData = meResult.data;
      
      // Then get detailed user info from /user/:id endpoint
      const userResponse = await fetch(`${API_BASE_URL}/user/${meData.id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!userResponse.ok) {
        if (userResponse.status === 401) {
          throw new Error('Authentication token expired. Please log in again.');
        }
        throw new Error('Failed to fetch user details from /user/:id');
      }

      const userResult = await userResponse.json();
      
      // Check if the response has the expected structure
      if (!userResult?.data) {
        throw new Error('Invalid response format from /user/:id');
      }
      
      const userData = userResult.data;
      
      // Combine the data
      const combinedData = {
        ...meData,
        ...userData,
      };
      
      setUserDetails(combinedData);
      setFormData({
        firstName: combinedData.firstName || '',
        lastName: combinedData.lastName || '',
        phoneNumber: combinedData.phoneNumber || '',
        licenceNumber: combinedData.drivingLicence?.licenceNumber || '',
        expiryDate: combinedData.drivingLicence?.expiryDate || '',
      });
    } catch (err) {
      console.error('Error fetching user details:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch user details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      setError('Phone number is required');
      return false;
    }
    return true;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      setError(null);

      if (!accessToken) {
        throw new Error('No authentication token available. Please log in.');
      }

      const formData = new FormData();
      formData.append('file', files[0]);

      // Add a delay before making the request to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Uploading image...');
      
      const response = await fetch(`${API_BASE_URL}/image/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (response.status === 429) { // Too Many Requests
        throw new Error('Server is busy. Please try again in a few moments.');
      }

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication token expired. Please log in again.');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload image');
      }

      const result = await response.json();
      
      if (!result?.data?.url) {
        throw new Error('Invalid response format from image upload');
      }

      // Update the user details with the new image URL
      if (userDetails) {
        const updatedUserDetails = { ...userDetails };
        if (!updatedUserDetails.drivingLicence) {
          updatedUserDetails.drivingLicence = {
            licenceNumber: '',
            expiryDate: '',
            drivingLicenseImages: [],
          };
        }
        
        // Ensure drivingLicence exists before accessing its properties
        const drivingLicence = updatedUserDetails.drivingLicence;
        if (drivingLicence) {
          // Add the image URL to the drivingLicenseImages array
          drivingLicence.drivingLicenseImages = [
            ...(drivingLicence.drivingLicenseImages || []),
            result.data.url
          ];
        }
        
        setUserDetails(updatedUserDetails);
      }
      
      console.log('Image uploaded successfully!');
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    if (!userDetails?.drivingLicence) return;
    
    const updatedUserDetails = { ...userDetails };
    const drivingLicence = updatedUserDetails.drivingLicence;
    
    if (drivingLicence) {
      drivingLicence.drivingLicenseImages = 
        drivingLicence.drivingLicenseImages.filter((_, i) => i !== index);
    }
    
    setUserDetails(updatedUserDetails);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    if (!userDetails?.id) {
      setError('No user ID available');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      if (!accessToken) {
        throw new Error('No authentication token available. Please log in.');
      }

      // Prepare the update data
      const updateData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
      };

      // Only include drivingLicence if either licenceNumber or expiryDate is provided
      if (formData.licenceNumber || formData.expiryDate || userDetails.drivingLicence?.drivingLicenseImages?.length) {
        // Create a new drivingLicence object with the updated values
        // Make sure to preserve any existing drivingLicenseImages
        const existingImages = userDetails.drivingLicence?.drivingLicenseImages || [];
        
        updateData.drivingLicence = {
          licenceNumber: formData.licenceNumber || userDetails.drivingLicence?.licenceNumber || '',
          expiryDate: formData.expiryDate || userDetails.drivingLicence?.expiryDate || '',
          drivingLicenseImages: existingImages
        };
      }

      console.log('Sending update data:', updateData);

      const response = await fetch(`${API_BASE_URL}/user/${userDetails.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication token expired. Please log in again.');
        }
        
        // Try to get more detailed error information
        let errorMessage = 'Failed to update user details';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
          console.error('Server error details:', errorData);
        } catch (parseError) {
          console.error('Could not parse error response:', parseError);
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      
      // Check if the response has the expected structure
      if (!result?.data) {
        throw new Error('Invalid response format from update request');
      }
      
      const updatedData = result.data;
      setUserDetails(updatedData);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating user details:', err);
      setError(err instanceof Error ? err.message : 'Failed to update user details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="my-account-container">
        <div className="loading">Loading your account information...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-account-container">
        <div className="error-message">
          <p><strong>Error:</strong> {error}</p>
          <p className="error-help">Please check your input and try again. If the problem persists, contact support.</p>
          <button onClick={fetchUserDetails}>Retry</button>
        </div>
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="my-account-container">
        <div className="empty-state">
          <FaUser size={48} />
          <p>No user data available</p>
          <button onClick={fetchUserDetails}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="myaccount-root">
      <div className="content">
        <div className="section">
          <h3>Personal Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Email</label>
              <p>{userDetails.email}</p>
            </div>
            <div className="info-item">
              <label>First Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              ) : (
                <p>{userDetails.firstName}</p>
              )}
            </div>
            <div className="info-item">
              <label>Last Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              ) : (
                <p>{userDetails.lastName}</p>
              )}
            </div>
            <div className="info-item">
              <label>Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              ) : (
                <p>{userDetails.phoneNumber}</p>
              )}
            </div>
          </div>
        </div>

        <div className="section">
          <h3>Driving License Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>License Number</label>
              {isEditing ? (
                <input
                  type="text"
                  name="licenceNumber"
                  value={formData.licenceNumber}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{userDetails.drivingLicence?.licenceNumber || 'Not provided'}</p>
              )}
            </div>
            <div className="info-item">
              <label>Expiry Date</label>
              {isEditing ? (
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{userDetails.drivingLicence?.expiryDate || 'Not provided'}</p>
              )}
            </div>
          </div>
          
          <div className="license-images-section">
            <h4>License Images</h4>
            <div className="license-images-container">
              {userDetails.drivingLicence?.drivingLicenseImages && 
               userDetails.drivingLicence.drivingLicenseImages.length > 0 ? (
                <div className="license-images-grid">
                  {userDetails.drivingLicence.drivingLicenseImages.map((imageUrl, index) => (
                    <div key={index} className="license-image-item">
                      <img src={imageUrl} alt={`License image ${index + 1}`} />
                      {isEditing && (
                        <button 
                          className="remove-image-btn"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-images">No license images uploaded</p>
              )}
              
              {isEditing && (
                <div className="upload-image-container">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="file-input"
                    disabled={uploading}
                  />
                  <button 
                    className="upload-image-btn"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : <><FaUpload /> Upload License Image</>}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="actions">
          {isEditing ? (
            <>
              <button className="save-button" onClick={handleSubmit}>
                <FaSave /> Save Changes
              </button>
              <button className="cancel-button" onClick={() => setIsEditing(false)}>
                <FaTimes /> Cancel
              </button>
            </>
          ) : (
            <button className="edit-button" onClick={() => setIsEditing(true)}>
              <FaEdit /> Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
