import React from "react";
import { useParams } from "react-router-dom";
import carsData from "../../../../utils/dummy/cars.json";
import "./CarDetail.css";

const CarDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const car = carsData.find((c) => c.id === id);

  if (!car) {
    return <h2 className="carDetail-notFound">Car not found!</h2>;
  }

  return (
    <div className="carDetail-container">
      <div className="carDetail-imageContainer">
        <img
          src={car.image}
          alt={`${car.make} ${car.model}`}
          className="carDetail-image"
        />
        <h1 className="carDetail-title">{`${car.make} ${car.model} - ${car.year}`}</h1>
      </div>

      <div className="carDetail-infoContainer">
        <div className="carDetail-infoRow">
          <p>
            <span className="carDetail-strongText">License Plate:</span>{" "}
            {car.licensePlate}
          </p>
          <p>
            <span className="carDetail-strongText">Fuel Type:</span> {car.fuelType}
          </p>
          <p>
            <span className="carDetail-strongText">Transmission:</span>{" "}
            {car.autoGearbox ? "Automatic" : "Manual"}
          </p>
          <p>
            <span className="carDetail-strongText">Seats:</span> {car.numSeats}
          </p>
          <p>
            <span className="carDetail-strongText">Daily Price:</span>{" "}
            {car.dailyPrice.toLocaleString()} VND/day
          </p>
          <p>
            <span className="carDetail-strongText">Location:</span> {car.address}
          </p>
          <p>
            <span className="carDetail-strongText">Description:</span>{" "}
            {car.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;
