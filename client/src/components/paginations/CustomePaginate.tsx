import React, { useEffect, useState } from 'react';
import { Car, getCars } from '../../apis/cars';
import { CarStatus, FuelType } from '../../types/car';
import CarCard from '../cards/CarCard';
import './CustomePaginate.css';

const DEFAULT_CAR_IMAGE = "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&auto=format&fit=crop&q=60";

interface Pagination {
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
  prev: number | null;
  next: number | null;
}

const CustomePaginate: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    lastPage: 1,
    currentPage: 1,
    perPage: 12,
    prev: null,
    next: null
  });

  const addDefaultImage = (car: any): Car => ({
    ...car,
    fuelType: car.fuelType as FuelType,
    status: car.status as CarStatus,
    images: car.images?.length ? car.images : [{
      id: 'default',
      url: DEFAULT_CAR_IMAGE,
      isMain: true
    }]
  });

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCars({
        page: pagination.currentPage,
        perPage: pagination.perPage
      });
      console.log('API Response:', response);
      
      if (response) {
        setCars(response.data?.cars?.map(addDefaultImage) || []);
        setPagination({
          total: response.data?.pagination?.total || 0,
          lastPage: response.data?.pagination?.lastPage || 1,
          currentPage: response.data?.pagination?.currentPage || 1,
          perPage: response.data?.pagination?.perPage || 12,
          prev: response.data?.pagination?.prev,
          next: response.data?.pagination?.next
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching cars:', err);
      setError('Failed to load cars. Please try again.');
      setCars([]);
      setPagination(prev => ({
        ...prev,
        total: 0,
        lastPage: 1,
        currentPage: 1
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [pagination.currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.lastPage) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading cars...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => fetchCars()}>Try Again</button>
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="empty-container">
        <p>No cars available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="paginate-container">
      <div className="cars-grid">
        {cars.map((car) => (
          <div key={car.id} className="car-item">
            <CarCard car={car} />
          </div>
        ))}
      </div>

      <div className="pagination-controls">
        <button
          className={`pagination-button ${!pagination.prev ? 'disabled' : ''}`}
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={!pagination.prev}
        >
          Previous
        </button>

        <span className="page-info">
          Page {pagination.currentPage} of {pagination.lastPage}
        </span>

        <button
          className={`pagination-button ${!pagination.next ? 'disabled' : ''}`}
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={!pagination.next}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CustomePaginate;
