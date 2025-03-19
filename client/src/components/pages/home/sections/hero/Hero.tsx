import React from "react";
import SearchBar from "./SearchBar";
/*import AnimatedButton from '../../../buttons/AnimatedButton';*/
const Hero: React.FC = () => {
  const description =
    "Looking for a reliable and affordable car rental service? At CRS, we offer a wide range of well-maintained vehicles to meet your travel needs.";
  return (
    <div style={styles.heroContainer}>
      <div style={styles.backgroundLayer} />
      <div style={styles.overlay} />
      <div style={styles.contentLayer}>
        <div style={styles.contentBox}>
          <h1 style={styles.heading}>CRS - Accompanying You on Every Ride</h1>
          <hr style={styles.divider} />
          <p style={styles.description}>{description}</p>
          {/*<AnimatedButton text="Get Started" onClick={() => console.log("Get Started")} />*/}
        </div>
        <SearchBar />
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  heroContainer: {
    position: "relative",
    width: "100%",
    height: "100vh",
    overflow: "hidden",
  },
  backgroundLayer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "100%",
    height: "100vh",
    transform: "translate(-50%, -50%)",
    backgroundImage:
      'url("https://s7d1.scene7.com/is/image/bridgestone/road-trip-blog-images-2022-07-jul-fcac-web-bsro?scl=1")',
    backgroundSize: "cover",
    backgroundPosition: "50% 50%",
    backgroundRepeat: "no-repeat",
    zIndex: -2,
    borderRadius: "15px",
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.76)",
    zIndex: -1,
  },

  contentLayer: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: "#fff",
    textAlign: "center",
    zIndex: 1,
  },
  contentBox: {
    maxWidth: "80%",
    padding: "5rem",
    borderRadius: "8px",
  },
  heading: {
    fontSize: "3rem",
    marginBottom: "2rem",
    color: "#FFD700",
    textShadow: "2px 2px 5px rgba(0, 0, 0, 0.7)",
  },
  divider: {
    width: "150px",
    height: "0.1px",
    backgroundColor: "#ffffff",
    margin: "30px auto",
    border: "none",
  },
  description: {
    fontSize: "1.25rem",
    marginBottom: "1.5rem",
    color: "#fff",
  },
  /*button: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "1.2rem",
    color: "white",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },*/
};

export default Hero;
