import React, { useState, useRef, useEffect } from 'react';
import { FuelType } from '../../types/car';
import { createCar } from '../../apis/cars'; // Assuming createCar API is in this path
import { useCategory } from '../../contexts/CategoryContext';
import './AddCarModal.css'; // We will create this CSS file later

interface AddCarModalProps {
  show: boolean;
  onClose: () => void;
  onCarAdded: () => void; // Callback to refresh the car list
}

const AddCarModal: React.FC<AddCarModalProps> = ({ show, onClose, onCarAdded }) => {
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
    autoGearbox: false,
  });
  const [adding, setAdding] = useState(false);
  const modalFormRef = useRef<HTMLFormElement | null>(null);

  // Category context
  const { categories, getAllCategories, isLoading: isLoadingCategories } = useCategory();
  useEffect(() => {
    if (show) getAllCategories();
  }, [show, getAllCategories]);

  const handleAddCar = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      await createCar({ ...addForm, fuelType: addForm.fuelType as FuelType });
      setAddForm({ // Reset form
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
        autoGearbox: false,
      });
      onCarAdded(); // Call the callback to refresh car list
      onClose(); // Close modal
    } catch (err) {
      alert('Thêm xe thất bại!');
      console.error('Error adding car:', err);
    } finally {
      setAdding(false);
    }
  };

  // Close modal on ESC key press
  useEffect(() => {
    if (!show) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [show, onClose]);

  // Close modal on overlay click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalFormRef.current && !modalFormRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className="add-car-modal-overlay" onMouseDown={handleOverlayClick}>
      <div className="add-car-modal-container">
        <form ref={modalFormRef} onSubmit={handleAddCar} className="add-car-modal-form" onMouseDown={(e) => e.stopPropagation()}>
          <button type="button" className="add-car-modal-close" onClick={onClose} aria-label="Đóng modal">
            ×
          </button>
          <h2 className="add-car-modal-title">Thêm xe mới</h2>
          <div className="add-car-modal-fields">
            
            <label className="add-car-modal-label">
              Hãng xe
              <input
                className="add-car-modal-input"
                placeholder="VD: Toyota"
                value={addForm.make}
                onChange={(e) => setAddForm((f) => ({ ...f, make: e.target.value }))}
                required
              />
            </label>
            <label className="add-car-modal-label">
              Dòng xe
              <input
                className="add-car-modal-input"
                placeholder="VD: Camry"
                value={addForm.model}
                onChange={(e) => setAddForm((f) => ({ ...f, model: e.target.value }))}
                required
              />
            </label>
            <label className="add-car-modal-label">
              Năm
              <input
                className="add-car-modal-input"
                placeholder="VD: 2025"
                type="number"
                value={addForm.year}
                onChange={(e) => setAddForm((f) => ({ ...f, year: Number(e.target.value) }))}
                required
              />
            </label>
            <label className="add-car-modal-label">
              Km đã đi
              <input
                className="add-car-modal-input"
                placeholder="VD: 10000"
                type="number"
                value={addForm.kilometers || ''}
                onChange={(e) => setAddForm((f) => ({ ...f, kilometers: Number(e.target.value) }))}
                required
              />
            </label>
            <label className="add-car-modal-label">
              Biển số
              <input
                className="add-car-modal-input"
                placeholder="VD: 30A-123.45"
                value={addForm.licensePlate}
                onChange={(e) => setAddForm((f) => ({ ...f, licensePlate: e.target.value }))}
                required
              />
            </label>
            <label className="add-car-modal-label">
              Giá/ngày (VND)
              <input
                className="add-car-modal-input"
                placeholder="VD: 800000"
                type="number"
                value={addForm.dailyPrice || ''}
                onChange={(e) => setAddForm((f) => ({ ...f, dailyPrice: Number(e.target.value) }))}
                required
              />
            </label>
            <label className="add-car-modal-label">
              Địa chỉ
              <input
                className="add-car-modal-input"
                placeholder="VD: 123 Lê Lợi, Hà Nội"
                value={addForm.address}
                onChange={(e) => setAddForm((f) => ({ ...f, address: e.target.value }))}
                required
              />
            </label>
            <label className="add-car-modal-label">
              Số chỗ
              <input
                className="add-car-modal-input"
                placeholder="VD: 5"
                type="number"
                value={addForm.numSeats}
                onChange={(e) => setAddForm((f) => ({ ...f, numSeats: Number(e.target.value) }))}
                required
              />
            </label>
            <label className="add-car-modal-label">
              Mô tả
              <input
                className="add-car-modal-input"
                placeholder="VD: Xe mới, nội thất da, tiết kiệm nhiên liệu"
                value={addForm.description}
                onChange={(e) => setAddForm((f) => ({ ...f, description: e.target.value }))}
              />
            </label>
            <label className="add-car-modal-label">
              URL ảnh (cách nhau bởi dấu phẩy)
              <input
                className="add-car-modal-input"
                placeholder="VD: https://img1.jpg, https://img2.jpg"
                value={addForm.imageUrls.join(',')}
                onChange={(e) => setAddForm((f) => ({ ...f, imageUrls: e.target.value.split(',').map((s) => s.trim()) }))}
              />
            </label>
            <label className="add-car-modal-label">
              Loại nhiên liệu
              <select
                className="add-car-modal-select"
                value={addForm.fuelType}
                onChange={(e) => setAddForm((f) => ({ ...f, fuelType: e.target.value }))}
                required
              >
                <option value="">Chọn loại nhiên liệu</option>
                <option value="PETROL">Xăng</option>
                <option value="DIESEL">Dầu</option>
                <option value="ELECTRIC">Điện</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </label>
            <label className="add-car-modal-label">
              Danh mục
              <select
                className="add-car-modal-select"
                value={addForm.categoryIds[0] || ''}
                onChange={e => setAddForm(f => ({ ...f, categoryIds: [e.target.value] }))}
                required
                disabled={isLoadingCategories}
              >
                <option value="">Chọn danh mục</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </label>
            <label className="add-car-modal-checkbox-label">
              <input
                type="checkbox"
                checked={addForm.autoGearbox}
                onChange={(e) => setAddForm((f) => ({ ...f, autoGearbox: e.target.checked }))}
              />
              Số tự động
            </label>
          </div>
          <div className="add-car-modal-actions">
            <button type="submit" disabled={adding} className="add-car-modal-submit">
              {adding ? 'Đang thêm...' : 'Thêm xe'}
            </button>
            <button type="button" onClick={onClose} className="add-car-modal-cancel">
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCarModal; 