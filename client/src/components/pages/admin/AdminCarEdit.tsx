import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { carApi } from '../../../apis/car';
import { CAR_NOTIFICATIONS } from '../../../constants/notificationMessages';
import { useNotificationWithState } from '../../../contexts/NotificationContext';
import { ROUTES } from '../../../routes/constants/ROUTES';
import { Car, FuelType } from '../../../types/car';
import './AdminCarEdit.css';

const AdminCarEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { handleAsync } = useNotificationWithState();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    kilometers: 0,
    description: '',
    dailyPrice: 0,
    licensePlate: '',
    numSeats: 4,
    autoGearbox: true,
    fuelType: FuelType.PETROL,
    address: '',
  });

  useEffect(() => {
    const fetchCar = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const carData = await carApi.findOne(id);
        setCar(carData);
        
        // Type assertion to any to work around the type mismatch
        const carAny = carData as any;
        
        // Map the car data to form fields safely
        setFormData({
          make: carAny.make || carAny.brand || '',
          model: carAny.model || '',
          year: carAny.year || new Date().getFullYear(),
          kilometers: carAny.kilometers || 0,
          description: carAny.description || '',
          dailyPrice: carAny.dailyPrice || carAny.pricePerDay || 0,
          licensePlate: carAny.licensePlate || '',
          numSeats: carAny.numSeats || carAny.seats || 4,
          autoGearbox: carAny.autoGearbox || carAny.transmission === 'automatic' || true,
          fuelType: carAny.fuelType as FuelType || FuelType.PETROL,
          address: carAny.address || carAny.location || '',
        });
      } catch (err) {
        console.error('Error fetching car:', err);
        setError('Failed to load car details');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const result = await handleAsync(
      async () => {
        // Create update data with only fields that are allowed in the DTO
        const updateData = {
          make: formData.make,
          model: formData.model,
          year: formData.year,
          kilometers: formData.kilometers,
          description: formData.description,
          dailyPrice: formData.dailyPrice,
          licensePlate: formData.licensePlate,
          numSeats: formData.numSeats,
          autoGearbox: formData.autoGearbox,
          fuelType: formData.fuelType,
          address: formData.address
        };
        
        // Use the API update method with properly formatted data
        const updatedCar = await carApi.update(id, updateData);
        return updatedCar;
      },
      {
        loading: CAR_NOTIFICATIONS.update.loading,
        success: CAR_NOTIFICATIONS.update.success,
        error: CAR_NOTIFICATIONS.update.error,
      }
    );

    if (result) {
      navigate(ROUTES.ADMIN.DASHBOARD);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Đang tải thông tin xe...</p>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="error-container">
        <p>{error || 'Không tìm thấy xe'}</p>
        <button onClick={() => navigate(ROUTES.ADMIN.DASHBOARD)}>Trở về danh sách xe</button>
      </div>
    );
  }

  return (
    <div className="admin-car-edit">
      <div className="edit-header">
        <h1>Chỉnh Sửa Thông Tin Xe</h1>
        <button className="back-button-edit" onClick={() => navigate(ROUTES.ADMIN.DASHBOARD)}>
          Trở về danh sách xe
        </button>
      </div>

      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="make">Hãng xe</label>
            <input
              type="text"
              id="make"
              name="make"
              value={formData.make}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="model">Mẫu xe</label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="year">Năm sản xuất</label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              min={1900}
              max={new Date().getFullYear()}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="kilometers">Số KM đã đi</label>
            <input
              type="number"
              id="kilometers"
              name="kilometers"
              value={formData.kilometers}
              onChange={handleInputChange}
              min={0}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="dailyPrice">Giá thuê theo ngày</label>
            <input
              type="number"
              id="dailyPrice"
              name="dailyPrice"
              value={formData.dailyPrice}
              onChange={handleInputChange}
              min={0}
              step={0.01}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="licensePlate">Biển số xe</label>
            <input
              type="text"
              id="licensePlate"
              name="licensePlate"
              value={formData.licensePlate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="numSeats">Số ghế ngồi</label>
            <input
              type="number"
              id="numSeats"
              name="numSeats"
              value={formData.numSeats}
              onChange={handleInputChange}
              min={1}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="fuelType">Loại nhiên liệu</label>
            <select
              id="fuelType"
              name="fuelType"
              value={formData.fuelType}
              onChange={handleInputChange}
              required
            >
              <option value={FuelType.PETROL}>Xăng</option>
              <option value={FuelType.DIESEL}>Dầu diesel</option>
              <option value={FuelType.ELECTRIC}>Điện</option>
              <option value={FuelType.HYBRID}>Hybrid</option>
            </select>
          </div>

          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="autoGearbox"
              name="autoGearbox"
              checked={formData.autoGearbox}
              onChange={handleInputChange}
              className="modern-checkbox"
            />
            <label htmlFor="autoGearbox" className="modern-checkbox-label">
              Hộp số tự động
            </label>
          </div>          

          <div className="form-group full-width">
            <label htmlFor="address">Địa chỉ</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="description">Mô tả</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              required
            />
          </div>
        </div>
        

        <div className="form-actions">
          <button type="submit" className="save-button-action">
            Lưu thay đổi
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate(ROUTES.ADMIN.DASHBOARD)}
          >
            Hủy bỏ
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCarEdit;