import React, { useState } from "react";
import LocationSearchModal from "./LocationSearch";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa6";
import AnimatedButton from '../../../../buttons/AnimatedButton';

const SearchBar: React.FC = () => {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>("Search Locations");

  const handleLocationConfirm = (location: string) => {
    setSelectedLocation(location);
    setIsLocationModalOpen(false);
  };

  return (
    <div style={styles.formContainer}>
      <form style={styles.form}>
        <div style={styles.inputBox1} onClick={() => setIsLocationModalOpen(true)}>
          <label style={styles.search}>Locations</label>
          <div style={styles.locationContainer}>
            <FaMapMarkerAlt style={styles.icon} />
            <span style={styles.locationText}>{selectedLocation}</span>
            <FaChevronDown style={styles.arrowIcon} />
          </div>
        </div>

        <div style={styles.inputBox2}>
          <label style={styles.pickupDate}>Pickup Date</label>
          <div style={styles.dateContainer}>
            <input type="date" style={styles.input1} />
          </div>
        </div>

        <div style={styles.inputBox3}>
          <label style={styles.returnDate}>Return Date</label>
          <div style={styles.dateContainer}>
            <input type="date" style={styles.input2} />
          </div>
        </div>

        <AnimatedButton text="Find" onClick={() => alert('Find Clicked!')} />
      </form>

      <LocationSearchModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onConfirm={handleLocationConfirm}
      />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  formContainer: {
    width: "85%",
    height: "auto",
    marginBottom: "20px",
    overflow: "hidden",
    padding: "0 8%",
    borderRadius: "15px",
    backgroundColor: "#fff",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    zIndex: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  form: {
    width: "100%",
    display: "flex",
    flexDirection: "row", 
    gap: "20px", 
    alignItems: "center",
    justifyContent: "center",
  },

  inputBox1: {
    width: "100%",
    margin: "20px auto",
    cursor: "pointer",
    alignItems: "center",
    flex: "1",

  },

  search: {
    fontSize: "16px",
    color: "#333",
    fontWeight: "500",
    marginBottom: "5px",
    display: "block",
    textAlign: "left",
  },

  locationContainer: {
    width: "100%",
    minWidth: "200px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: "15px 10px",
    borderRadius: "10px",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
    height: "50px",
  },

  locationText: {
    fontSize: "15px",
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },

  inputBox2: {
    width: "100%",
    margin: "20px auto",
    cursor: "pointer",
    alignItems: "center",
    flex: "1",
  },

  pickupDate: {
    fontSize: "16px",
    color: "#333",
    fontWeight: "500",
    marginBottom: "5px",
    display: "block",
    textAlign: "left",
  },

  dateContainer: {
    width: "100%",
    minWidth: "200px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: "15px 10px",
    borderRadius: "10px",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
  },

  input1: {
    width: "100%",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    
  },

  inputBox3: {
    width: "100%",
    margin: "20px auto",
    cursor: "pointer",
    alignItems: "center",
    flex: "1",
  },

  returnDate: {
    fontSize: "16px",
    color: "#333",
    fontWeight: "500",
    marginBottom: "5px",
    display: "block",
    textAlign: "left",
  },

  input2: {
    width: "100%",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  
  icon: {
    fontSize: "16px",
    color: "#999",
  },
  
  arrowIcon: {
    fontSize: "14px",
    color: "#999",
  },
  
  /*btn: {
    flex: "1",
    width: "100%",
    minWidth: "100px",
    padding: "10px",
    backgroundColor: "#FFD700",
    color: "white",
    borderRadius: "5px",
    textAlign: "center",
    cursor: "pointer",
    border: "none",
  },*/
};

export default SearchBar;