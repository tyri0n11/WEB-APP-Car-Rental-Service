import React from "react";
import { FaGasPump, FaMapMarkerAlt, FaStar, FaTachometerAlt, FaUsers, FaChargingStation } from "react-icons/fa";
import { TbAutomaticGearboxFilled, TbManualGearboxFilled } from "react-icons/tb";
import { BsFillFuelPumpDieselFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

interface Car {
  id: string;
  image: string;
  make: string;
  model: string;
  year: number;
  fuelType: string;
  autoGearbox: boolean;
  numSeats: number;
  status: CarStatus;
  address: string;
  rating: number;
  kilometers: number;
  dailyPrice: number;
  discountPrice?: number; 
  licensePlate: string;
  description: string;
}

export enum CarStatus {
  Available = "available",
  Unavailable = "unavailable",
}

const getFuelTypeDisplay = (fuelType: string) => {
  switch (fuelType) {
    case "Gasoline":
      return (
        <span className="fuel gasoline">
          <FaGasPump className="icon" /> Gasoline
        </span>
      );
    case "Diesel":
      return (
        <span className="fuel diesel">
          <BsFillFuelPumpDieselFill className="icon" /> Diesel
        </span>
      );
    case "Electric":
      return (
        <span className="fuel electric">
          <FaChargingStation className="icon" /> Electric
        </span>
      );
    default:
      return <span className="fuel">Unknown</span>;
  }
};

const CarCard: React.FC<{ car: Car }> = ({ car }) => {
  const navigate = useNavigate();

  const styles: { [key: string]: React.CSSProperties } = {
    card: {
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#fff",
      padding: "16px",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      maxWidth: "300px",
    },
    image: {
      width: "100%",
      height: "180px",
      objectFit: "cover",
      borderRadius: "8px",
    },
    title: {
      fontSize: "16px",
      fontWeight: "bold",
      color: "#222",
    },
    infoRow1: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      fontSize: "14px",
    },

    gearBox: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      color: "#666",
    },

    getFuel: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      color: "#666",
    },

    infoRow2: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      fontSize: "14px",
    },

    address: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      color: "#666",
    },

    numSeats: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      color: "#666",
    },

    hr: {
      border: "none",
      borderTop: "1px solid #ddd", 
      margin: "8px 0", 
    },

    infoRow3: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      fontSize: "14px",
    },

    info: {
      display: "flex",
      flexDirection: "column",
      alignItems: "left",
      justifyContent: "space-between",
      fontSize: "14px",
    },

    rate: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      color: "#666",
    },

    kilometers: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      color: "#666",
    },

    priceRow: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },

    price: {
      fontWeight: "bold",
      fontSize: "16px",
      color: "#FFD700",
    },
    
  };

  return (
    <div style={styles.card} onClick={() => navigate(`/car/${car.id}`)}>
      <img src={car.image} alt={`${car.make} ${car.model} ${car.year}`} style={styles.image} />
      <div>
        <h3 style={styles.title}>{`${car.make} ${car.model} - ${car.year}`}</h3>
        <div style={styles.infoRow1}>
          <div style={styles.gearBox}>
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

          <div style={styles.getFuel}>{getFuelTypeDisplay(car.fuelType)}</div>
        </div>
        
        <div style={styles.infoRow2}>
          <div style={styles.address}><FaMapMarkerAlt /> {car.address}</div>
          <div style={styles.numSeats}><FaUsers /> {car.numSeats} seats </div>
        </div>
        
        <hr style={styles.hr}/>

        <div style={styles.infoRow3}>
          <div style={styles.info}>
            <div style={styles.rate}><FaStar /> {car.rating} </div>
            <div style={styles.kilometers}><FaTachometerAlt /> {car.kilometers} km </div>
          </div>
     
          <div style={styles.priceRow}>
            <span style={styles.price}>{car.dailyPrice} VND/day</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
