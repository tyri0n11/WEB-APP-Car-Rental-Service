import React from 'react';
import { FaCalendarAlt, FaCar, FaFilter, FaGasPump, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import { CarQueryParams, CarSortBy } from '../../apis/cars';
import useLocalStorage from '../../hooks/useLocalStorage';
import { FuelType } from '../../types/car';
import './CarSearchFilter.css';

interface CarSearchFilterProps {
  onSearch: (params: CarQueryParams | undefined) => void;
}

const STORAGE_KEY = 'car_search_params';

const CarSearchFilter: React.FC<CarSearchFilterProps> = ({ onSearch }) => {
  const [searchParams, setSearchParams, removeSearchParams] = useLocalStorage<CarQueryParams>(STORAGE_KEY, {
    q: '',
    sortBy: CarSortBy.NEWEST,
    priceFrom: undefined,
    priceTo: undefined,
    make: '',
    model: '',
    fuelType: undefined,
    yearFrom: undefined,
    yearTo: undefined,
    address: '',
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredParams: Partial<CarQueryParams> = {};
    
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== '' && value !== undefined && value !== null) {
        filteredParams[key as keyof CarQueryParams] = value as any;
      }
    });
    
    if (Object.keys(filteredParams).length === 0) {
      onSearch(undefined);
    } else {
      onSearch(filteredParams as CarQueryParams);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newParams = {
      ...searchParams,
      [name]: value === '' ? undefined : value
    };
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    const defaultParams = {
      q: '',
      sortBy: CarSortBy.NEWEST,
      priceFrom: undefined,
      priceTo: undefined,
      make: '',
      model: '',
      fuelType: undefined,
      yearFrom: undefined,
      yearTo: undefined,
      address: '',
    };
    setSearchParams(defaultParams);
    onSearch(undefined);
  };

  return (
    <div className="car-search-filter">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-group">
          <div className="search-input">
            <FaSearch className="icon" />
            <input
              type="text"
              name="q"
              placeholder="Seeking for a car..."
              value={searchParams.q}
              onChange={handleInputChange}
            />
          </div>

          <div className="search-input">
            <FaMapMarkerAlt className="icon" />
            <input
              type="text"
              name="address"
              placeholder="Location"
              value={searchParams.address}
              onChange={handleInputChange}
            />
          </div>

          <div className="search-input">
            <FaCalendarAlt className="icon" />
            <input
              type="date"
              name="pickupDate"
              value={searchParams.pickupDate || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="search-input">
            <FaCalendarAlt className="icon" />
            <input
              type="date"
              name="returnDate"
              value={searchParams.returnDate || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="filter-group">
          <div className="filter-input">
            <FaCar className="icon" />
            <select
              name="make"
              value={searchParams.make}
              onChange={handleInputChange}
            >
              <option value="">All brands</option>
              <option value="Toyota">Toyota</option>
              <option value="Honda">Honda</option>
              <option value="Ford">Ford</option>
              <option value="BMW">BMW</option>
              <option value="Mercedes">Mercedes</option>
            </select>
          </div>

          <div className="filter-input">
            <FaGasPump className="icon" />
            <select
              name="fuelType"
              value={searchParams.fuelType || ''}
              onChange={handleInputChange}
            >
              <option value="">All fuel types</option>
              <option value={FuelType.PETROL}>Gasoline</option>
              <option value={FuelType.DIESEL}>Diesel</option>
              <option value={FuelType.ELECTRIC}>Electric</option>
              <option value={FuelType.HYBRID}>Hybrid</option>
            </select>
          </div>

          <div className="filter-input">
            <FaFilter className="icon" />
            <select
              name="sortBy"
              value={searchParams.sortBy}
              onChange={handleInputChange}
            >
              <option value={CarSortBy.NEWEST}>Mới nhất</option>
              <option value={CarSortBy.PRICE_ASC}>Giá tăng dần</option>
              <option value={CarSortBy.PRICE_DESC}>Giá giảm dần</option>
              <option value={CarSortBy.RATING}>Đánh giá cao nhất</option>
            </select>
          </div>
        </div>

        <div className="button-group">
          <button type="submit" className="search-button">
            Tìm kiếm
          </button>
          <button type="button" className="clear-button" onClick={handleClearFilters}>
            Xóa bộ lọc
          </button>
        </div>
      </form>
    </div>
  );
};

export default CarSearchFilter; 