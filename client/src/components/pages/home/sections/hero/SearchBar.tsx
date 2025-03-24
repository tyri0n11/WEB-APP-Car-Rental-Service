import React, { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa6";
import AnimatedButton from '../../../../buttons/AnimatedButton';
import LocationSearchModal from "./LocationSearch";
import styles from './SearchBar.module.css';

const SearchBar: React.FC = () => {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>("Search Locations");

  const handleLocationConfirm = (location: string) => {
    setSelectedLocation(location);
    setIsLocationModalOpen(false);
  };

  return (
    <div className={styles.formContainer}>
      <form className={styles.form}>
        <div className={styles.inputBox} onClick={() => setIsLocationModalOpen(true)}>
          <label className={styles.label}>Locations</label>
          <div className={styles.locationContainer}>
            <FaMapMarkerAlt className={styles.icon} />
            <span className={styles.locationText}>{selectedLocation}</span>
            <FaChevronDown className={styles.arrowIcon} />
          </div>
        </div>

        <div className={styles.inputBox}>
          <label className={styles.label}>Pickup Date</label>
          <div className={styles.container}>
            <input type="date" className={styles.input} />
          </div>
        </div>

        <div className={styles.inputBox}>
          <label className={styles.label}>Return Date</label>
          <div className={styles.container}>
            <input type="date" className={styles.input} />
          </div>
        </div>

        <div className={styles.buttonWrapper}>
          <AnimatedButton text="Find" onClick={() => alert('Find Clicked!')} />
        </div>
      </form>

      <LocationSearchModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onConfirm={handleLocationConfirm}
      />
    </div>
  );
};

export default SearchBar;