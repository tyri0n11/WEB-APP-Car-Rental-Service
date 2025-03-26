import React from "react";
import { BsFillFuelPumpDieselFill } from "react-icons/bs";
import { FaChargingStation, FaGasPump, FaMapMarkerAlt, FaStar, FaTachometerAlt, FaUsers } from "react-icons/fa";
import { TbAutomaticGearboxFilled, TbManualGearboxFilled } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { Car } from "../../apis/cars";
import { FuelType } from "../../types/car";
import "./CarCard.css";

const DEFAULT_CAR_IMAGE = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=60";

const getFuelTypeDisplay = (fuelType: FuelType) => {
  switch (fuelType) {
    case FuelType.PETROL:
      return (
        <span className="fuel gasoline">
          <FaGasPump className="icon" /> Gasoline
        </span>
      );
    case FuelType.DIESEL:
      return (
        <span className="fuel diesel">
          <BsFillFuelPumpDieselFill className="icon" /> Diesel
        </span>
      );
    case FuelType.ELECTRIC:
      return (
        <span className="fuel electric">
          <FaChargingStation className="icon" /> Electric
        </span>
      );
    case FuelType.HYBRID:
      return (
        <span className="fuel hybrid">
          <FaChargingStation className="icon" /> Hybrid
        </span>
      );
    default:
      return <span className="fuel">Unknown</span>;
  }
};

const CarCard: React.FC<{ car: Car }> = ({ car }) => {
  const navigate = useNavigate();
  const mainImage = car?.images?.find(img => img.isPrimary)?.url || car?.images?.[0]?.url || DEFAULT_CAR_IMAGE;

  return (
    <div className="car-card" onClick={() => navigate(`/cars/${car.id}`)}>
      <img 
        src={mainImage} 
        alt={`${car.make} ${car.model} ${car.year}`} 
        className="car-image" 
      />
      <div className="car-content">
        <h3 className="car-title">{`${car.make} ${car.model} - ${car.year}`}</h3>
        
        <div className="info-row">
          <div className="gear-box">
            {car.autoGearbox ? (
              <>
                <TbAutomaticGearboxFilled className="icon" /> Automatic
              </>
            ) : (
              <>
                <TbManualGearboxFilled className="icon" /> Manual
              </>
            )}
          </div>

          <div className="fuel-type">{getFuelTypeDisplay(car.fuelType)}</div>
        </div>
        
        <div className="info-row">
          <div className="address">
            <FaMapMarkerAlt className="icon" /> {car.address}
          </div>
          <div className="seats">
            <FaUsers className="icon" /> {car.numSeats} seats
          </div>
        </div>
        
        <hr className="divider" />

        <div className="info-row">
          <div className="car-info">
            <div className="rating">
              <FaStar className="icon" /> {car.rating}
            </div>
            <div className="kilometers">
              <FaTachometerAlt className="icon" /> {car.kilometers} km
            </div>
          </div>
     
          <div className="price-row">
            <span className="price">{car.dailyPrice} USD/day</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
