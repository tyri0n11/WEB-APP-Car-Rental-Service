import { useState } from "react";

const styles = {
    container: {
        maxWidth: "1200px",
        margin: "4rem auto",
        padding: "0 1.5rem",
    },
    gridContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px",
        marginTop: "20px",
    },
    card: {
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
    },
    cardHover: {
        transform: "translateY(-5px)",
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
    }
};

const Card = () => {
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);

    return (
        <section style={styles.container}>
            <div style={styles.gridContainer}>
                {[
                    { title: "Our Journey", text: "Born from a love of adventure, we set out to make travel simple, seamless, and stress-free." },
                    { title: "Our Commitment", text: "Transparency, trust, and top-tier service—our promise to every customer, every trip." },
                    { title: "What We Offer", text: "From self-drive to luxury chauffeur services, we put you in the driver’s seat of your journey." },
                    { title: "Happy Travelers", text: "10,000+ journeys, countless smiles. Join a growing community of satisfied travelers." }
                ].map((item, index) => (
                    <div
                        key={index}
                        style={{
                            ...styles.card,
                            ...(hoverIndex === index ? styles.cardHover : {}),
                        }}
                        onMouseEnter={() => setHoverIndex(index)}
                        onMouseLeave={() => setHoverIndex(null)}
                    >
                        <h3>{item.title}</h3>
                        <p>{item.text}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Card;
