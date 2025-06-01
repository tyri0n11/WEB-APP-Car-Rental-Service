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
        <p>Loading car details...</p>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="error-container">
        <p>{error || 'Car not found'}</p>
        <button onClick={() => navigate(ROUTES.ADMIN.DASHBOARD)}>Back to Cars</button>
      </div>
    );
  }

  return (
    <div className="admin-car-edit">
      <div className="edit-header">
        <h1>Edit Car Details</h1>
        <button className="back-button-edit" onClick={() => navigate(ROUTES.ADMIN.DASHBOARD)}>
          Back to Cars
        </button>
      </div>

      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="make">Make</label>
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
            <label htmlFor="model">Model</label>
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
            <label htmlFor="year">Year</label>
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
            <label htmlFor="kilometers">Kilometers</label>
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
            <label htmlFor="dailyPrice">Daily Price</label>
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
            <label htmlFor="licensePlate">License Plate</label>
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
            <label htmlFor="numSeats">Number of Seats</label>
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
            <label htmlFor="fuelType">Fuel Type</label>
            <select
              id="fuelType"
              name="fuelType"
              value={formData.fuelType}
              onChange={handleInputChange}
              required
            >
              <option value={FuelType.PETROL}>Petrol</option>
              <option value={FuelType.DIESEL}>Diesel</option>
              <option value={FuelType.ELECTRIC}>Electric</option>
              <option value={FuelType.HYBRID}>Hybrid</option>
            </select>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="autoGearbox"
                checked={formData.autoGearbox}
                onChange={handleInputChange}
              />
              Automatic Gearbox
            </label>
          </div>

          <div className="form-group full-width">
            <label htmlFor="address">Address</label>
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
            <label htmlFor="description">Description</label>
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
          <button type="submit" className="save-button">
            Save Changes
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate(ROUTES.ADMIN.DASHBOARD)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCarEdit;