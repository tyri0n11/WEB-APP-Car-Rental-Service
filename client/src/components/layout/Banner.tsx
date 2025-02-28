import React from "react";
import styles from "./Banner.module.css";

const Banner: React.FC = () => {
  return (
    <div className={styles.banner}>
      <div className={styles.bannerTitle}>Yonko Uber</div>
      <div className={styles.bannerSubtitle}>The Emperor of Car Rentals</div>
      <div className={styles.contact}>
        <p><i className="fas fa-phone"></i> Hotline: +84 839 345 515 (Mr. Shanks)</p>
        <p><i className="fas fa-envelope"></i> Email: yonkouber@grandline.com</p>
      </div>
    </div>
  );
};

export default Banner;
