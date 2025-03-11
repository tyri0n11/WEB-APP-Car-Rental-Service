import React from "react";

const Mission: React.FC = () => {
    return (
        <section
            style={{
                background: "#1c1c1c",
                color: "#ffffff",
                padding: "50px",
                borderRadius: "12px",
                textAlign: "center",
                boxShadow: "0 6px 15px rgba(0, 0, 0, 0.3)",
                maxWidth: "900px",
                margin: "30px auto"
            }}
        >
            <h2 style={{ fontSize: "2rem", marginBottom: "15px", color: "#ffcc00", fontWeight: "bold" }}>Our Mission</h2>
            <p style={{ fontSize: "1.2rem", maxWidth: "700px", margin: "auto", lineHeight: "1.7" }}>
                At <strong style={{ color: "#f8c102" }}>Cristiano Ronaldo Supachok Car Rentals</strong>, we don’t just rent cars—we{" "}
                <span style={{ color: "#e63946", fontWeight: "bold" }}>deliver greatness</span>.
                Our goal is to give you a smooth, stress-free rental experience, just like a{" "}
                <span style={{ color: "#ffcc00", fontWeight: "bold" }}>Supachok through ball landing perfectly at Ronaldo’s feet.</span>
            </p>
            <div
                style={{
                    background: "#ffcc00",
                    padding: "15px",
                    borderRadius: "8px",
                    marginTop: "20px",
                    display: "inline-block",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    color: "#1c1c1c",
                    boxShadow: "0 3px 10px rgba(255, 204, 0, 0.5)"
                }}
            >
                🚀 Drive like a champion. Rent with the GOATs. 🚀
            </div>
        </section>
    );
};

export default Mission;
