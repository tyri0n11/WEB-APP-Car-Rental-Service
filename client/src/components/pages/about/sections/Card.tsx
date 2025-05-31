import { useState } from "react";

const styles = {
    container: {
        maxWidth: "1200px",
        margin: "4rem auto",
        padding: "0 1.5rem",
        fontFamily: "'Be Vietnam Pro', Arial, Helvetica, sans-serif",
    },
    gridContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "28px",
        marginTop: "20px",
    },
    card: {
        background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)",
        padding: "28px 22px 24px 22px",
        borderRadius: "18px",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.10)",
        textAlign: "center",
        transition: "transform 0.25s cubic-bezier(.4,2,.6,1), box-shadow 0.25s cubic-bezier(.4,2,.6,1)",
        borderBottom: "4px solid #4c84e5",
        minHeight: "260px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "12px", // Thêm khoảng cách giữa tiêu đề và đoạn văn
    },
    cardHover: {
        transform: "translateY(-10px) scale(1.04)",
        boxShadow: "0 12px 32px rgba(76, 132, 229, 0.18)",
        borderBottom: "4px solid #029cea",
    },
    cardTitle: {
        marginBottom: "8px",
        fontSize: "1.25rem",
        fontWeight: 600,
        letterSpacing: "0.5px",
    },
    cardText: {
        marginTop: "0",
        fontSize: "1rem",
        color: "#333",
        lineHeight: 1.6,
    },
};

const Card = () => {
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);

    return (
        <section style={styles.container}>
            <div style={styles.gridContainer}>
                {[
                    { title: "Hành Trình", text: "Xuất phát từ niềm đam mê khám phá, chúng tôi mong muốn giúp việc di chuyển trở nên đơn giản, liền mạch và không lo lắng." },
                    { title: "Cam Kết", text: "Minh bạch, tin cậy và dịch vụ hàng đầu—lời hứa của chúng tôi cho mọi khách hàng, mọi chuyến đi." },
                    { title: "Dịch Vụ", text: "Từ tự lái đến dịch vụ xe sang có tài xế, chúng tôi trao cho bạn quyền chủ động trên hành trình của mình." },
                    { title: "Đánh Giá", text: "Hơn 10.000 chuyến đi, vô số nụ cười. Hãy gia nhập cộng đồng khách hàng hài lòng ngày càng lớn mạnh." }
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
                        <h3 style={styles.cardTitle}>{item.title}</h3>
                        <p style={styles.cardText}>{item.text}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Card;
