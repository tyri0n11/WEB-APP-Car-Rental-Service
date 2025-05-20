import React from "react";
import { BsFillFuelPumpDieselFill } from "react-icons/bs";
import { FaChargingStation, FaGasPump, FaMapMarkerAlt, FaStar, FaTachometerAlt, FaUsers } from "react-icons/fa";
import { TbAutomaticGearboxFilled, TbManualGearboxFilled } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { Car } from "../../../apis/cars";
import { FuelType } from "../../../types/car";
import "./CarCard.css";

const DEFAULT_CAR_IMAGE = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=60";

const getFuelTypeDisplay = (fuelType: FuelType) => {
  switch (fuelType) {
    case FuelType.PETROL:
      return (
        <span className="car-card-fuel car-card-gasoline">
          <FaGasPump className="car-card-icon" /> Xăng
        </span>
      );
    case FuelType.DIESEL:
      return (
        <span className="car-card-fuel car-card-diesel">
          <BsFillFuelPumpDieselFill className="car-card-icon" /> Dầu
        </span>
      );
    case FuelType.ELECTRIC:
      return (
        <span className="car-card-fuel car-card-electric">
          <FaChargingStation className="car-card-icon" /> Điện
        </span>
      );
    case FuelType.HYBRID:
      return (
        <span className="car-card-fuel car-card-hybrid">
          <FaChargingStation className="car-card-icon" /> Hybrid
        </span>
      );
    default:
      return <span className="car-card-fuel">Không xác định</span>;
  }
};

const CarCard: React.FC<{ car: Car }> = ({ car }) => {
  const navigate = useNavigate();
  const mainImage = car?.images?.find(img => img.isPrimary)?.url || car?.images?.[0]?.url || DEFAULT_CAR_IMAGE;

  return (
    <div className="car-card-container" onClick={() => navigate(`/cars/${car.id}`)}>
      <img
        src={mainImage}
        alt={`${car.make} ${car.model} ${car.year}`}
        className="car-card-image"
      />
      <div className="car-card-content">
        <h3 className="car-card-title">{`${car.make} ${car.model} - ${car.year}`}</h3>

        <div className="car-card-info-row">
          <div className="car-card-gear-box">
            {car.autoGearbox ? (
              <>
                <TbAutomaticGearboxFilled className="car-card-icon" /> Số tự động
              </>
            ) : (
              <>
                <TbManualGearboxFilled className="car-card-icon" /> Số sàn
              </>
            )}
          </div>

          <div className="car-card-fuel-type">{getFuelTypeDisplay(car.fuelType)}</div>
        </div>

        <div className="car-card-info-row">
          <div className="car-card-address">
            <FaMapMarkerAlt className="car-card-icon" /> {car.address}
          </div>
          <div className="car-card-seats">
            <FaUsers className="car-card-icon" /> {car.numSeats} chỗ
          </div>
        </div>

        <hr className="car-card-divider" />

        <div className="car-card-info-row">
          <div className="car-card-info">
            <div className="car-card-rating">
              <FaStar className="car-card-icon" /> {car.rating} điểm
            </div>
            <div className="car-card-kilometers">
              <FaTachometerAlt className="car-card-icon" /> {car.kilometers} km
            </div>
          </div>

          <div className="car-card-price-row">
            <span className="car-card-price">{car.dailyPrice.toLocaleString()} VND / ngày</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
