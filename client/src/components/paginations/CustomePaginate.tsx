import React, { useEffect, useState } from 'react';
import { Car, CarQueryParams, getCars } from '../../apis/cars';
import { CarStatus, FuelType } from '../../types/car';
import CarCard from '../cards/car/CarCard';
import CarSearchFilter from '../filters/CarSearchFilter';
import './CustomePaginate.css';

interface Pagination {
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
  prev: number | null;
  next: number | null;
}

interface CustomePaginateProps {
  itemsPerPage?: number;
  defaultCarImage?: string;
  showFilter?: boolean;
  showPagination?: boolean;
  limit?: number;
}

const CustomePaginate: React.FC<CustomePaginateProps> = ({
  itemsPerPage = 12, // Default value
  defaultCarImage = "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&auto=format&fit=crop&q=60", // Default value
  showFilter = true, // Default value
  showPagination = true, // Default value
  limit // Optional limit for the number of cars
}) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<CarQueryParams>({
    page: 1,
    perPage: itemsPerPage,
  });
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    lastPage: 1,
    currentPage: 1,
    perPage: limit || itemsPerPage,
    prev: null,
    next: null
  });

  const addDefaultImage = (car: any): Car => ({
    ...car,
    fuelType: car.fuelType as FuelType,
    status: car.status as CarStatus,
    images: car.images?.length ? car.images : [{
      id: 'default',
      url: defaultCarImage,
      isMain: true
    }]
  });

  const handleSearch = (params: CarQueryParams | undefined) => {
    if (!params) {
      setSearchParams({
        page: 1,
        perPage: itemsPerPage,
      });
    } else {
      const filteredParams: CarQueryParams = {
        page: 1,
        perPage: itemsPerPage,
      };

      Object.entries(params).forEach(([key, value]) => {
        if (value !== '' && value !== undefined && value !== null) {
          filteredParams[key as keyof CarQueryParams] = value as any;
        }
      });

      setSearchParams(filteredParams);
    }
  };

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCars(searchParams);

      if (response) {
        let fetchedCars = response.data?.cars?.map(addDefaultImage) || [];
        if (limit) {
          fetchedCars = fetchedCars.slice(0, limit); // Apply limit if provided
        }
        setCars(fetchedCars);
        setPagination({
          total: response.data?.pagination?.total || 0,
          lastPage: response.data?.pagination?.lastPage || 1,
          currentPage: response.data?.pagination?.currentPage || 1,
          perPage: response.data?.pagination?.perPage || itemsPerPage,
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
  }, [searchParams]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.lastPage) {
      setSearchParams(prev => ({ ...prev, page: newPage }));
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

  return (
    <div className="paginate-container">
      {showFilter && <CarSearchFilter onSearch={handleSearch} />}

      {cars.length === 0 ? (
        <div className="empty-container">
          <p>No cars available at the moment.</p>
        </div>
      ) : (
        <>
          <div className="cars-grid">
            {cars.map((car) => (
              <div key={car.id} className="car-item">
                <CarCard car={car} />
              </div>
            ))}
          </div>

          {showPagination && (
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
          )}
        </>
      )}
    </div>
  );
};

export default CustomePaginate;
