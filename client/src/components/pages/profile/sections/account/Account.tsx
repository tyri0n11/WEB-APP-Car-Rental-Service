import React, { useState, useEffect, useRef } from 'react';
import { FaIdCard, FaUser, FaEdit, FaSave, FaTimes, FaUpload } from 'react-icons/fa';
import { useAuth } from '../../../../../contexts/AuthContext';
import { useUser } from '../../../../../contexts/UserContext';
import type { UpdateProfileInput, UpdateDrivingLicenseInput } from '../../../../../types/user';
import { uploadImage } from '../../../../../utils/image';
import './Account.css';

const styles = {
  section: {
    fontFamily: "'Be Vietnam Pro', Arial, Helvetica, sans-serif",
  },
};

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
  const [debugPayload] = useState<string | null>(null);
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

      // Định dạng ngày hết hạn sang YYYY-MM-DD cho input
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

      setSuccess(`Tải ảnh mặt ${side === 'front' ? 'trước' : 'sau'} giấy phép lái xe thành công`);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Tải ảnh mặt ${side === 'front' ? 'trước' : 'sau'} thất bại`);
      // Xóa file input
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

      // Cập nhật thông tin cá nhân
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        avatar: formData.avatar
      });

      // Cập nhật giấy phép lái xe với ảnh
      await updateDrivingLicense({
        licenceNumber: formData.licenceNumber,
        expiryDate: new Date(formData.expiryDate).toISOString(),
        imageUrls: [frontImage, backImage].filter(Boolean)
      });

      setSuccess('Cập nhật thông tin thành công');
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cập nhật thông tin thất bại');
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
    return <div className="loading">Đang tải dữ liệu người dùng...</div>;
  }

  if (apiError) {
    return <div className="error">{apiError}</div>;
  }

  if (!user) {
    return <div className="error">Không có dữ liệu người dùng</div>;
  }

  return (
    <div className="account-section" style={styles.section}>
      <div className="section-header">
        <h2><FaUser /> Thông tin tài khoản</h2>
        <button onClick={toggleEdit} className="edit-button">
          {isEditing ? <FaTimes /> : <FaEdit />}
          {isEditing ? 'Hủy' : 'Chỉnh sửa'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Họ</label>
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
          <label>Tên</label>
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
          <label>Số điện thoại</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            disabled={!isEditing}
            required
            pattern="[0-9]{10}"
            title="Vui lòng nhập số điện thoại 10 chữ số hợp lệ"
          />
        </div>

        <div className="license-section">
          <h2><FaIdCard /> Thông tin giấy phép lái xe</h2>

          <div className="form-group">
            <label>Số Giấy Phép Lái Xe</label>
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
            <label htmlFor="expiryDate">Ngày hết hạn</label>
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
              <label>Ảnh mặt trước GPLX</label>
              {frontImage && (
                <div className="preview-image">
                  <img src={frontImage} alt="Mặt trước GPLX" />
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
                <FaUpload /> {uploadingFront ? 'Đang tải...' : 'Tải ảnh trước'}
              </button>
            </div>

            <div className="image-upload">
              <label>Ảnh mặt sau GPLX</label>
              {backImage && (
                <div className="preview-image">
                  <img src={backImage} alt="Mặt sau GPLX" />
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
                <FaUpload /> {uploadingBack ? 'Đang tải...' : 'Tải ảnh sau'}
              </button>
            </div>
          </div>
        </div>

        {
          isEditing && (
            <button type="submit" className="save-button" disabled={loading}>
              <FaSave /> Lưu thay đổi
            </button>
          )
        }
      </form >

      {debugPayload && (
        <div className="debug-section">
          <h4>Debug Payload:</h4>
          <pre>{debugPayload}</pre>
        </div>
      )}
    </div >
  );
};

export default Account;
