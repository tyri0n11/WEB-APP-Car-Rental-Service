import React from "react";

const Intro: React.FC = () => {
    return (
        <section
            style={{
                background: "linear-gradient(135deg, #1a1a2e, #16213e)",
                color: "white",
                padding: "40px",
                textAlign: "center",
                borderRadius: "12px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                maxWidth: "800px",
                margin: "0 auto"
            }}
        >
            <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "10px" }}>
                Cristiano Ronaldo Supachok Car Rentals
            </h1>
            <p style={{ fontStyle: "italic", fontSize: "1.2rem", marginBottom: "20px" }}>
                "Drive Like Ronaldo, Dribble Through Traffic Like Supachok!" 🚗💨
            </p>
            <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
                Welcome to <strong>Cristiano Ronaldo Supachok Car Rentals</strong>, where renting a car isn’t just a
                transaction—it’s a{" "}
                <span style={{ color: "#f5a623", fontWeight: "bold" }}>Champions League experience</span>. Inspired by
                the GOAT mentality of Cristiano Ronaldo and the elite dribbling of Supachok Sarachat, we provide{" "}
                <strong>fast, reliable, and game-changing</strong> car rentals.
            </p>
        </section>
    );
};

export default Intro;
