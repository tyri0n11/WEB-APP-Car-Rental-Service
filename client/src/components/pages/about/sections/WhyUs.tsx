import React from "react";

const WhyUs: React.FC = () => {
    return (
        <section
            style={{
                background: "#fff",
                color: "#212529",
                padding: "40px",
                borderRadius: "12px",
                textAlign: "center",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                maxWidth: "900px",
                margin: "30px auto",
                border: "1px solid #ddd"
            }}
        >
            <h2 style={{ fontSize: "2.2rem", marginBottom: "20px", color: "#e63946", fontWeight: "bold" }}>Why Choose Us?</h2>
            <ul style={{ listStyle: "none", padding: "0", fontSize: "1.2rem", lineHeight: "1.8", textAlign: "left", maxWidth: "700px", margin: "auto" }}>
                <li style={{ marginBottom: "12px", display: "flex", alignItems: "center" }}>
                    ✅ <span style={{ marginLeft: "10px", fontWeight: "bold", color: "#28a745" }}>Siuuuu-fast bookings</span> – No delays, just quick access!
                </li>
                <li style={{ marginBottom: "12px", display: "flex", alignItems: "center" }}>
                    ✅ <span style={{ marginLeft: "10px", fontWeight: "bold", color: "#17a2b8" }}>Affordable prices</span> – More value than a last-minute CR7 header.
                </li>
                <li style={{ marginBottom: "12px", display: "flex", alignItems: "center" }}>
                    ✅ <span style={{ marginLeft: "10px", fontWeight: "bold", color: "#ffcc00" }}>Legendary fleet</span> – From economic whips to luxury goal-scoring machines.
                </li>
                <li style={{ marginBottom: "12px", display: "flex", alignItems: "center" }}>
                    ✅ <span style={{ marginLeft: "10px", fontWeight: "bold", color: "#fd7e14" }}>Customer service so good</span>, it feels like a Supachok assist.
                </li>
                <li style={{ marginBottom: "12px", display: "flex", alignItems: "center" }}>
                    ✅ <span style={{ marginLeft: "10px", fontWeight: "bold", color: "#6f42c1" }}>No hidden fees</span> – Just like Supachok, we keep it clean & fair.
                </li>
            </ul>
        </section>
    );
};

export default WhyUs;
