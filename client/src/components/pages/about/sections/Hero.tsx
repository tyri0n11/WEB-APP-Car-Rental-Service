import { useEffect, useState } from "react";
import images from "../../../../assets/images/images";

const hero_images = images.about_hero;
const Hero = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const updateImage = () => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % hero_images.length);
        };

        const interval = setInterval(updateImage, 5000);
        return () => clearInterval(interval);
    }, []);

    const heroImage = hero_images[currentImageIndex];

    return (
        <section style={{ ...styles.heroSection, backgroundImage: `url(${heroImage})` }}>
            <div style={styles.overlay}>
                <div style={styles.textContainer}>
                    <h1>
                        Cristiano <br />
                        Ronaldo <br />
                        Supachok.
                    </h1>
                </div>
            </div>
        </section>
    );
};

export default Hero;

const styles: { [key: string]: React.CSSProperties } = {
    heroSection: {
        width: "100vw",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "white",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        transition: "background-image 0.5s ease-in-out",
    },
    overlay: {
        padding: "2rem",
        borderRadius: "8px",
    },
    textContainer: {
        fontSize: "2rem",
        lineHeight: 1.5,
        color: "lightblue",
    },
};
