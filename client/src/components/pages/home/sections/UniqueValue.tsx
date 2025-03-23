import React from "react";

const styles: { [key: string]: React.CSSProperties } = {
  section: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "50px 20px",
    textAlign: "center",
  },
  title: {
    fontSize: "40px",
    fontWeight: "bold",
    color: "#1E3A8A",
    margin: "16px auto",
    textAlign: "center",
  },
  description: {
    fontSize: "18px",
    color: "#64748B",
    marginTop: "10px",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "40px",
    marginTop: "40px",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  image: {
    width: "110px",
    height: "110px",
  },
  cardTitle: {
    marginTop: "20px",
    fontSize: "22px",
    fontWeight: "600",
    color: "#334155",
  },
  cardDescription: {
    marginTop: "10px",
    fontSize: "16px",
    color: "#475569",
  },
};

const uniqueValues = [
  {
    id: 1,
    title: "Affordable Pricing",
    description:
      "We offer the best prices in the market with no hidden fees. Rent a car that fits your budget without compromising on quality and service.",
    image: "https://www.mioto.vn/static/media/thue_xe_co_tai_xe.a6f7dc54.svg",
  },
  {
    id: 2,
    title: "Flexible Booking",
    description:
      "Easily modify or cancel your booking with our flexible policies. Enjoy peace of mind knowing that your travel plans can adapt to unexpected changes.",
    image: "https://www.mioto.vn/static/media/dich_vu_thue_xe_tu_lai_hanoi.f177339e.svg",
  },
  {
    id: 3,
    title: "Well-Maintained Vehicles",
    description:
      "All our cars undergo regular maintenance and inspections to ensure a smooth and safe driving experience. Drive with confidence every time.",
    image: "https://www.mioto.vn/static/media/cho_thue_xe_tu_lai_tphcm.1e7cb1c7.svg",
  },
  {
    id: 4,
    title: "Diverse car line",
    description:
      "More than 100 car models for you to choose from: Mini, Sedan, CUV, SUV, MPV, Pickup...",
    image: "https://www.mioto.vn/static/media/thue_xe_tu_lai_gia_re_hanoi.4035317e.svg",
  },
  {
    id: 5,
    title: "Easy Payment",
    description:
      "Diverse payment methods: ATM, Visa card and e-wallet (Momo, VnPay, ZaloPay).",
    image: "https://www.mioto.vn/static/media/cho_thue_xe_tu_lai_hanoi.735438af.svg",
  },
];

const UniqueValue: React.FC = () => {
  return (
    <section style={styles.section}>
      <h2 style={styles.title}>Why choose Us?</h2>
      <p style={styles.description}>
        Features that make renting a car on CRS easier
      </p>
      <div style={styles.gridContainer}>
        {uniqueValues.map((item) => (
          <div key={item.id} style={styles.card}>
            <img src={item.image} alt={item.title} style={styles.image} />
            <h3 style={styles.cardTitle}>{item.title}</h3>
            <p style={styles.cardDescription}>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UniqueValue;
