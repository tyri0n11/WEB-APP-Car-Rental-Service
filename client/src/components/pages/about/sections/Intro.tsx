import images from "../../../../assets/images/images";

const styles = {
    container: {
        maxWidth: "1200px",
        margin: "4rem auto",
        padding: "0 1.5rem",
    },
    contentWrapper: {
        display: "flex",
        alignItems: "center",
        gap: "2rem",
    },
    textContainer: {
        flex: "60%",
        padding: "2rem",
    },
    heading: {
        fontSize: "3rem",
        fontWeight: "bold",
    },
    paragraph: {
        marginTop: "1rem",
        color: "#555",
        fontSize: "1rem",
    },
    imageContainer: {
        flex: "40%",
    },
    image: {
        width: "100%",
        borderRadius: "10px",
    },
};

const Intro = () => {
    return (
        <section style={styles.container}>
            <div style={styles.contentWrapper}>
                <div style={styles.textContainer}>
                    <h2 style={styles.heading}>About Us</h2>
                    <p style={styles.paragraph}>
                        At <strong>Cristiano Ronaldo Supachol (CRS) Car Rentals</strong>, we are dedicated to delivering exceptional car rental services tailored to your needs.
                        Whether you're exploring the city, embarking on a long journey, or require a premium ride for a special occasion, <strong>CRS</strong> ensures a seamless and hassle-free travel experience.
                    </p>
                    <p style={styles.paragraph}>
                        With a strong commitment to <strong>reliability, affordability, and customer satisfaction</strong>, we provide a diverse fleet of well-maintained vehicles, from economy options to luxury models.
                        Whether you prefer to drive yourself or enjoy the convenience of a professional chauffeur, <strong>CRS</strong> guarantees comfort, efficiency, and excellence in every ride.
                    </p>
                </div>
                <div style={styles.imageContainer}>
                    <img src={images.about_intro} alt="Car Rental Service" style={styles.image} />
                </div>
            </div>
        </section>
    );
};

export default Intro;
