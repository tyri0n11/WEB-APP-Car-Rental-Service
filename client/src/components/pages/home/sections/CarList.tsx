import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import carsData from "../../../.././utils/dummy/cars.json";
import CarCard from "../../../cards/CarCard";

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
  }
};

const CarList: React.FC = () => {
  const [cars, setCars] = useState<any[]>([]);

  useEffect(() => {
    setCars(carsData);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      style={styles.container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
      <motion.h2 
        style={styles.sectionTitle}
        variants={itemVariants}
      >
        Car for you
      </motion.h2>
      <motion.div 
        style={styles.gridContainer}
        variants={containerVariants}
      >
        {cars.map((car) => (
          <motion.div
            key={car.id}
            style={styles.gridItem}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
              transition: {
                duration: 0.2,
                ease: "easeOut"
              }
            }}
          >
            <CarCard car={car} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default CarList;
