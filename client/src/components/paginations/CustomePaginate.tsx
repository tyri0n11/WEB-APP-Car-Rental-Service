import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// Unused imports: updateCar, updateCarStatus
import { Car, CarQueryParams, getCars, deleteCar } from '../../apis/cars';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../routes/constants/ROUTES';
import { CarStatus, FuelType } from '../../types/car';
import CarCard from '../cards/car/CarCard';
import CarSearchFilter from '../filters/CarSearchFilter';
import AddCarModal from '../modals/AddCarModal';
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
  isAdmin?: boolean;
}

const CustomePaginate: React.FC<CustomePaginateProps> = ({
  itemsPerPage = 12,
  defaultCarImage = "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&auto=format&fit=crop&q=60",
  showFilter = true,
  showPagination = true,
  limit,
  isAdmin = false
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
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
  const [deletingCarId, setDeletingCarId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const addDefaultImage = (car: any): Car => ({
    ...car,
    fuelType: FuelType[car.fuelType.toUpperCase() as keyof typeof FuelType],
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
          fetchedCars = fetchedCars.slice(0, limit);
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
        throw new Error('Dữ liệu trả về không hợp lệ');
      }
    } catch (err) {
      console.error('Lỗi khi tải xe:', err);
      setError('Không thể tải danh sách xe. Vui lòng thử lại.');
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

  const handleCarClick = (carId: string) => {
    if (user?.role === 'ADMIN') {
      navigate(`/admin/cars/${carId}/edit`);
    } else {
      navigate(ROUTES.PUBLIC.CAR_DETAIL(carId));
    }
  };

  const handleDelete = async (carId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa xe này?')) return;
    setDeletingCarId(carId);
    try {
      await deleteCar(carId);
      fetchCars(); // Refetch cars to update the list
    } catch (err) {
      alert('Xóa xe thất bại!');
      console.error('Error deleting car:', err);
    } finally {
      setDeletingCarId(null);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Đang tải xe...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => fetchCars()}>Thử lại</button>
      </div>
    );
  }

  return (
    <div className="paginate-container">
      {isAdmin && (
        <div style={{ marginBottom: 16 }}>
          <button
            style={{
              padding: '8px 20px',
              borderRadius: 20,
              border: '1px solid #22c55e',
              background: '#22c55e',
              color: '#fff',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
              marginRight: 8
            }}
            onClick={() => setShowAddModal(true)}
          >
            ➕ Thêm xe
          </button>
        </div>
      )}
      <AddCarModal 
        show={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onCarAdded={() => {
          fetchCars();
        }}
      />
      
      {showFilter && <CarSearchFilter onSearch={handleSearch} />}

      {cars.length === 0 ? (
        <div className="empty-container">
          <p>Hiện tại chưa có xe nào.</p>
        </div>
      ) : (
        <>
          <div className="cars-grid">
            {cars.map((car) => (
              <div
                key={car.id}
                className="car-item"
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.closest('.admin-car-actions')) {
                    return;
                  }
                  handleCarClick(car.id);
                }}
                style={{ cursor: 'pointer' }} 
              >
                <CarCard car={car} />
                {isAdmin && (
                  <div className="admin-car-actions" style={{ marginTop: 8, display: 'flex', justifyContent: 'center', gap: 8 }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(car.id); }}
                      style={{
                        padding: '4px 12px',
                        borderRadius: 20,
                        border: '1px solid #dc2626',
                        background: '#dc2626',
                        color: '#fff',
                        fontWeight: 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        opacity: deletingCarId === car.id ? 0.7 : 1
                      }}
                      disabled={deletingCarId === car.id}
                    >
                      🗑️ {deletingCarId === car.id ? 'Đang xóa...' : 'Xóa'}
                    </button>
                  </div>
                )}
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
                Trước
              </button>

              <span className="page-info">
                Trang {pagination.currentPage} / {pagination.lastPage}
              </span>

              <button
                className={`pagination-button ${!pagination.next ? 'disabled' : ''}`}
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.next}
              >
                Tiếp
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CustomePaginate;
