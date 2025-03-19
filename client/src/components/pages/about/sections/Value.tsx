import { CSSProperties } from 'react';

const styles: { [key: string]: CSSProperties } = {
    section: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        backgroundColor: "#f3f4f6",
        padding: "3rem 1.5rem",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    },
    heading: {
        fontSize: "2rem",
        fontWeight: "bold",
        color: "#222",
    },
    paragraph: {
        marginTop: "1rem",
        color: "#444",
        maxWidth: "600px",
        lineHeight: "1.6",
    },
};

const Value = () => {
    return (
        <section style={styles.section}>
            <h2 style={styles.heading}>What Drives Us</h2>
            <p style={styles.paragraph}>
                More than just a ride—it's about the journey, the freedom, and the unforgettable memories.
                We bring you hassle-free, reliable, and affordable travel solutions so you can focus on the road ahead.
            </p>
        </section>
    );
};

export default Value;
