import React from 'react';
import AnimatedButton from '../../../buttons/AnimatedButton';
const Hero: React.FC = () => {
  const description = "Looking for a reliable and affordable car rental service? At CRS, we offer a wide range of well-maintained vehicles to meet your travel needs.";
  return (
    <div style={styles.heroContainer}>
      <div style={styles.backgroundLayer} />
      <div style={styles.contentLayer}>
        <div style={styles.contentBox}>
          <h1 style={styles.heading}>Drive with Confidence, Rent with Ease!</h1>
          <p style={styles.description}>{description}</p>
          <AnimatedButton text="Get Started" onClick={() => console.log("Get Started")} />
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  heroContainer: {
    height: "100vh",
    overflow: "hidden",
    position: "relative",
  },
  backgroundLayer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "100%",
    height: "100vh",
    transform: "translate(-50%, -50%)",
    backgroundImage:
      'url("https://static.wixstatic.com/media/c54d35_10dddcb64dc84f3ba1d610c0344bc59a~mv2.jpg/v1/fill/w_1612,h_1390,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/c54d35_10dddcb64dc84f3ba1d610c0344bc59a~mv2.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "50% 50%",
    zIndex: -1,
  },
  contentLayer: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: "#007bff",
    textAlign: "center",
    zIndex: 1,
  },
  contentBox: {
    maxWidth: "70%",
    padding: "5rem",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: "8px",
  },
  heading: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
  },
  description: {
    fontSize: "1.25rem",
    marginBottom: "1.5rem",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "1.2rem",
    color: "white",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Hero;
