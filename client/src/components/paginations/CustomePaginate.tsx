import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, CarQueryParams, getCars, updateCar, deleteCar, updateCarStatus, createCar } from '../../apis/cars';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../routes/constants/ROUTES';
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
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    imageUrls: [''],
    categoryIds: [''],
    make: '',
    model: '',
    year: new Date().getFullYear(),
    kilometers: 0,
    description: '',
    dailyPrice: 0,
    licensePlate: '',
    fuelType: '',
    address: '',
    numSeats: 1,
    autoGearbox: false
  });
  const [adding, setAdding] = useState(false);
  const modalFormRef = useRef<HTMLFormElement | null>(null);

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

  const handleEdit = (carId: string) => {
    navigate(`/admin/cars/${carId}/edit`);
  };

  const handleDelete = async (carId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa xe này?')) return;
    setDeletingCarId(carId);
    try {
      await deleteCar(carId);
      fetchCars();
    } catch (err) {
      alert('Xóa xe thất bại!');
    } finally {
      setDeletingCarId(null);
    }
  };

  const handleAddCar = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      await createCar({ ...addForm, fuelType: addForm.fuelType as FuelType });
      setShowAddModal(false);
      setAddForm({
        imageUrls: [''],
        categoryIds: [''],
        make: '',
        model: '',
        year: new Date().getFullYear(),
        kilometers: 0,
        description: '',
        dailyPrice: 0,
        licensePlate: '',
        fuelType: '',
        address: '',
        numSeats: 1,
        autoGearbox: false
      });
      fetchCars();
    } catch (err) {
      alert('Thêm xe thất bại!');
    } finally {
      setAdding(false);
    }
  };

  // Đóng modal khi bấm ESC
  useEffect(() => {
    if (!showAddModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowAddModal(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAddModal]);

  // Đóng modal khi click ngoài form
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalFormRef.current && !modalFormRef.current.contains(e.target as Node)) {
      setShowAddModal(false);
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
      {showAddModal && (
        <div className="add-car-modal-overlay" onMouseDown={handleOverlayClick}>
          <div className="add-car-modal-container">
            <form ref={modalFormRef} onSubmit={handleAddCar} className="add-car-modal-form" onMouseDown={e => e.stopPropagation()}>
              <button type="button" className="add-car-modal-close" onClick={() => setShowAddModal(false)} aria-label="Đóng modal">×</button>
              <h2 className="add-car-modal-title">Thêm xe mới</h2>
              <div className="add-car-modal-fields">
                <label className="add-car-modal-label">Hãng xe
                  <input className="add-car-modal-input" placeholder="VD: Toyota" value={addForm.make} onChange={e => setAddForm(f => ({ ...f, make: e.target.value }))} required />
                </label>
                <label className="add-car-modal-label">Dòng xe
                  <input className="add-car-modal-input" placeholder="VD: Camry" value={addForm.model} onChange={e => setAddForm(f => ({ ...f, model: e.target.value }))} required />
                </label>
                <label className="add-car-modal-label">Năm
                  <input className="add-car-modal-input" placeholder="VD: 2025" type="number" value={addForm.year} onChange={e => setAddForm(f => ({ ...f, year: Number(e.target.value) }))} required />
                </label>
                <label className="add-car-modal-label">Km đã đi
                  <input className="add-car-modal-input" placeholder="VD: 10000" type="number" value={addForm.kilometers} onChange={e => setAddForm(f => ({ ...f, kilometers: Number(e.target.value) }))} required />
                </label>
                <label className="add-car-modal-label">Biển số
                  <input className="add-car-modal-input" placeholder="VD: 30A-123.45" value={addForm.licensePlate} onChange={e => setAddForm(f => ({ ...f, licensePlate: e.target.value }))} required />
                </label>
                <label className="add-car-modal-label">Giá/ngày (VND)
                  <input className="add-car-modal-input" placeholder="VD: 800000" type="number" value={addForm.dailyPrice} onChange={e => setAddForm(f => ({ ...f, dailyPrice: Number(e.target.value) }))} required />
                </label>
                <label className="add-car-modal-label">Địa chỉ
                  <input className="add-car-modal-input" placeholder="VD: 123 Lê Lợi, Hà Nội" value={addForm.address} onChange={e => setAddForm(f => ({ ...f, address: e.target.value }))} required />
                </label>
                <label className="add-car-modal-label">Số chỗ
                  <input className="add-car-modal-input" placeholder="VD: 5" type="number" value={addForm.numSeats} onChange={e => setAddForm(f => ({ ...f, numSeats: Number(e.target.value) }))} required />
                </label>
                <label className="add-car-modal-label">Mô tả
                  <input className="add-car-modal-input" placeholder="VD: Xe mới, nội thất da, tiết kiệm nhiên liệu" value={addForm.description} onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))} />
                </label>
                <label className="add-car-modal-label">URL ảnh (cách nhau bởi dấu phẩy)
                  <input className="add-car-modal-input" placeholder="VD: https://img1.jpg, https://img2.jpg" value={addForm.imageUrls.join(',')} onChange={e => setAddForm(f => ({ ...f, imageUrls: e.target.value.split(',').map(s => s.trim()) }))} />
                </label>
                <label className="add-car-modal-label">ID danh mục (cách nhau bởi dấu phẩy)
                  <input className="add-car-modal-input" placeholder="VD: 123, 456" value={addForm.categoryIds.join(',')} onChange={e => setAddForm(f => ({ ...f, categoryIds: e.target.value.split(',').map(s => s.trim()) }))} />
                </label>
                <label className="add-car-modal-label">Loại nhiên liệu
                  <select className="add-car-modal-select" value={addForm.fuelType} onChange={e => setAddForm(f => ({ ...f, fuelType: e.target.value }))} required>
                    <option value="">Chọn loại nhiên liệu</option>
                    <option value="PETROL">Xăng</option>
                    <option value="DIESEL">Dầu</option>
                    <option value="ELECTRIC">Điện</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </label>
                <label className="add-car-modal-checkbox-label">
                  <input type="checkbox" checked={addForm.autoGearbox} onChange={e => setAddForm(f => ({ ...f, autoGearbox: e.target.checked }))} />
                  Số tự động
                </label>
              </div>
              <div className="add-car-modal-actions">
                <button type="submit" disabled={adding} className="add-car-modal-submit">{adding ? 'Đang thêm...' : 'Thêm xe'}</button>
                <button type="button" onClick={() => setShowAddModal(false)} className="add-car-modal-cancel">Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
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
                onClick={() => !isAdmin && handleCarClick(car.id)}
                style={{ cursor: isAdmin ? 'default' : 'pointer' }}
              >
                <CarCard car={car} />
                {isAdmin && (
                  <div className="admin-car-actions" style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => handleEdit(car.id)}
                      style={{
                        padding: '4px 12px',
                        borderRadius: 20,
                        border: '1px solid #2563eb',
                        background: '#2563eb',
                        color: '#fff',
                        fontWeight: 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(car.id)}
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
