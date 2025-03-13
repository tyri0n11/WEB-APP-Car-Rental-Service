import React from "react";
import images from "../../../../assets/images/images";

const styles: { [key: string]: React.CSSProperties } = {
    servicesContainer: {
        textAlign: "center",
        padding: "60px 20px",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
        position: "relative",
        background: "#f8f9fa",
        borderRadius: "50px 50px 0 0",
        boxShadow: "0 -10px 30px rgba(0, 0, 0, 0.1)",
    },
    title: {
        fontSize: "32px",
        fontWeight: "bold",
        color: "#333",
        marginBottom: "20px",
        textTransform: "uppercase",
    },
    cardsContainer: {
        display: "flex",
        justifyContent: "space-between",
        gap: "20px",
        flexWrap: "wrap",
    },
    card: {
        position: "relative",
        borderRadius: "20px",
        overflow: "hidden",
        flex: 1,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        maxWidth: "48%",
    },
    cardImage: {
        width: "100%",
        height: "500px",
        objectFit: "cover",
        display: "block",
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background:
            "linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.1))",
        zIndex: 1,
    },
    cardContent: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        zIndex: 2,
    },
    button: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "transparent",
        color: "white",
        border: "none",
        fontSize: "24px",
        fontWeight: "bold",
        cursor: "pointer",
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
        transition: "background-color 0.3s",
    },
    buttonHover: {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
    },
};

const Location: React.FC = () => {
    return (
        <div style={styles.servicesContainer}>
            <h1 style={styles.title}>Service Locations</h1>
            <div style={styles.cardsContainer}>
                {/* Left Card */}
                <div style={styles.card}>
                    <img
                        src={images.about_locations[1]}
                        alt="Steering Wheel"
                        style={styles.cardImage}
                    />
                    <div style={styles.overlay}></div>
                    <div style={styles.cardContent}>
                        <a
                            href="https://maps.app.goo.gl/5BrQEPAsiuhSkqiy6"
                            style={styles.button}
                            onMouseOver={(e) =>
                                (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor || "rgba(255, 255, 255, 0.2)")
                            }
                            onMouseOut={(e) =>
                                (e.currentTarget.style.backgroundColor = styles.button.backgroundColor || "transparent")
                            }
                        >
                            Click here
                        </a>
                    </div>
                </div>

                {/* Right Card */}
                <div style={styles.card}>
                    <img
                        src={images.about_locations[0]}
                        alt="Car with Person"
                        style={styles.cardImage}
                    />
                    <div style={styles.overlay}></div>
                    <div style={styles.cardContent}>
                        <a
                            href="https://maps.app.goo.gl/rbMsoJnmJQWPpbfn8"
                            style={styles.button}
                            onMouseOver={(e) =>
                                (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor || "rgba(255, 255, 255, 0.2)")
                            }
                            onMouseOut={(e) =>
                                (e.currentTarget.style.backgroundColor = styles.button.backgroundColor || "transparent")
                            }
                        >
                            Click here
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Location;