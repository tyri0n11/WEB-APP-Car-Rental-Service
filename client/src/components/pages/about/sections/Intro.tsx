import "../about.css"

const Intro = () => {
    return (
        <section className="container">
            <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                <div style={{ flex: "60%", padding: "2rem" }}>
                    <h2 style={{ fontSize: "3rem", fontWeight: "bold" }}>About Us</h2>
                    <p style={{ marginTop: "1rem", color: "#555", fontSize: "1rem" }}>
                        At <strong>Cristiano Ronaldo Supachol (CRS) Car Rentals</strong>, we are didicated to delivering exceptional car rental services tailored to your needs.
                        Whether you're exploring the city, embarking on a long journey, or require a premium ride for a special occasion, <strong>CRS</strong> ensures a seamless and hassle-free travel experience.
                    </p>
                    <p style={{ marginTop: "1rem", color: "#555", fontSize: "1rem" }}>
                        With a strong commitment to <strong>reliability, affordability, and customer satisfaction</strong>, we provide a diverse fleet of well-maintained vehicles, from economy options to luxury models.
                        Whether you prefer to drive yourself or enjoy the convenience of a professional chauffeur, <strong>CRS</strong> guarantees comfort, efficiency, and excellence in every ride.
                    </p>

                </div>

                <div style={{ flex: "40%" }}>
                    <img
                        src="../about/about6.jpg"
                        alt="Car Rental Service"
                        style={{ width: "100%", borderRadius: "10px" }}
                    />
                </div>
            </div>
        </section >
    )
}
export default Intro;
