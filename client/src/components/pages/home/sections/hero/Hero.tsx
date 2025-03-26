import { motion } from "framer-motion";
import React from "react";
// import SearchBar from "./SearchBar"; // Commented out since SearchBar component doesn't exist yet
/*import AnimatedButton from '../../../buttons/AnimatedButton';*/

const Hero: React.FC = () => {
  const description =
    "Looking for a reliable and affordable car rental service? At CRS, we offer a wide range of well-maintained vehicles to meet your travel needs.";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5, when: "beforeChildren" }
    }
  };

  const contentVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const backgroundVariants = {
    hidden: { scale: 1.2, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      style={styles.heroContainer}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        style={styles.backgroundLayer}
        variants={backgroundVariants}
      />
      <div style={styles.overlay} />
      <div style={styles.contentLayer}>
        <motion.div 
          style={styles.contentBox}
          variants={contentVariants}
        >
          <motion.h1 
            style={styles.heading}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            CRS - Accompanying You on Every Ride
          </motion.h1>
          <motion.hr 
            style={styles.divider}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
          <motion.p 
            style={styles.description}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            {description}
          </motion.p>
          {/*<AnimatedButton text="Get Started" onClick={() => console.log("Get Started")} />*/}
        </motion.div>
        <motion.div
          style={styles.searchBarWrapper}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
        </motion.div>
      </div>
    </motion.div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  heroContainer: {
    position: "relative",
    width: "100%",
    height: "100vh",
    minHeight: "600px",
    overflow: "hidden",
  },
  backgroundLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage:
      'url("https://s7d1.scene7.com/is/image/bridgestone/road-trip-blog-images-2022-07-jul-fcac-web-bsro?scl=1")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    zIndex: -2,
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
    width: "100%",
    padding: "20px",
    boxSizing: "border-box",
    gap: "2rem",
  },
  contentBox: {
    width: "100%",
    maxWidth: "800px",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontSize: "clamp(2rem, 5vw, 3rem)",
    marginBottom: "1rem",
    color: "#FFD700",
    textAlign: "center",
    textShadow: "2px 2px 5px rgba(0, 0, 0, 0.7)",
    width: "100%",
  },
  divider: {
    width: "150px",
    height: "2px",
    backgroundColor: "#ffffff",
    margin: "1.5rem auto",
    border: "none",
  },
  description: {
    fontSize: "clamp(1rem, 2vw, 1.25rem)",
    marginBottom: "1.5rem",
    color: "#fff",
    textAlign: "center",
    maxWidth: "600px",
    lineHeight: "1.6",
  },
  searchBarWrapper: {
    width: "100%",
    maxWidth: "1000px",
    margin: "0 auto",
  }
};

export default Hero;
