import React from "react";
import { useParams } from "react-router-dom";
import carsData from "../../../../utils/dummy/cars.json";

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: "100vw",
    minHeight: "100vh",
    padding: "20px",
    backgroundColor: "#fff",
  },
  title: {
    textAlign: "center",
    color: "#1E3A8A",
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "16px",
  },
  imageContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  image: {
    width: "90%",
    maxHeight: "500px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  infoContainer: {
    width: "80%",
    margin: "20px auto",
    fontSize: "18px",
    color: "#333",
    lineHeight: "1.6",
  },
  infoRow: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    fontSize: "16px",
    color: "#333",
  },
  strongText: {
    fontWeight: "bold",
    color: "#1E3A8A",
  },
  notFound: {
    textAlign: "center",
    marginTop: "50px",
    color: "red",
    fontSize: "24px",
  },
};

const CarDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const car = carsData.find((c) => c.id === id);

  if (!car) {
    return <h2 style={styles.notFound}>Car not found!</h2>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{`${car.make} ${car.model} - ${car.year}`}</h1>
      <img src={car.image} alt={`${car.make} ${car.model}`} style={styles.image} />
      
      <div style={styles.infoRow}>
        <p><span style={styles.strongText}>License Plate:</span> {car.licensePlate}</p>
        <p><span style={styles.strongText}>Fuel Type:</span> {car.fuelType}</p>
        <p><span style={styles.strongText}>Transmission:</span> {car.autoGearbox ? "Automatic" : "Manual"}</p>
        <p><span style={styles.strongText}>Seats:</span> {car.numSeats}</p>
        <p><span style={styles.strongText}>Daily Price:</span> {car.dailyPrice.toLocaleString()} VND/day</p>
        <p><span style={styles.strongText}>Location:</span> {car.address}</p>
        <p><span style={styles.strongText}>Description:</span> {car.description}</p>
      </div>
    </div>
  );
};

export default CarDetail;
