import React from "react";
import styles from "./Banner.module.css";

const Banner: React.FC = () => {
  return (
    <div className={styles.banner}>
      <div className={styles.bannerContent}>
        <span>WELCOME TO WAP &nbsp; ● &nbsp; WELCOME TO WAP &nbsp; ● &nbsp; WELCOME TO WAP</span>
      </div>
    </div>
  );
};

export default Banner;
