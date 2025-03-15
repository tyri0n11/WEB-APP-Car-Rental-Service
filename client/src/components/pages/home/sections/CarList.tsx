
import React, { useEffect, useState } from "react";
import CarCard from "./CarCard";
import carsData from "../../../.././utils/dummy/cars.json";

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: "1250px",
    margin: "0 auto",
    padding: "16px",
  },
  sectionTitle: {
    fontSize: "40px",
    fontWeight: "bold",
    color: "#1E3A8A",
    margin: "16px auto",
    textAlign: "center",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },

  gridItem: {
    transition: "box-shadow 0.3s ease-in-out, transform 0.2s ease-in-out",
    borderRadius: "12px",
    cursor: "pointer",
  },
  
  gridItemHover: {
    transform: "scale(1.05)",
    boxShadow: "0px calc(0.05 * 250px) calc(0.1 * 250px) rgba(0, 0, 0, 0.2)",
  }
};

const CarList: React.FC = () => {
  const [cars, setCars] = useState<any[]>([]);

  useEffect(() => {
    setCars(carsData);
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.sectionTitle}>Car for you</h2>
      <div style={styles.gridContainer}>
      {cars.map((car) => (
        <div
          key={car.id}
          style={styles.gridItem}
          onMouseEnter={(e) => {
            const width = e.currentTarget.clientWidth; // Lấy kích thước của card
            e.currentTarget.style.boxShadow = `0px ${width * 0.05}px ${width * 0.1}px rgba(0, 0, 0, 0.2)`;
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <CarCard car={car} />
        </div>
      ))}
      </div>
    </div>
  );
};

export default CarList;
