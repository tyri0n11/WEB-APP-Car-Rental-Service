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
        fontFamily: "'Be Vietnam Pro', Arial, Helvetica, sans-serif",
    },
    heading: {
        fontSize: "2rem",
        fontWeight: "bold",
        color: "#222",
        fontFamily: "'Be Vietnam Pro', Arial, Helvetica, sans-serif",
    },
    paragraph: {
        marginTop: "1rem",
        color: "#444",
        maxWidth: "600px",
        lineHeight: "1.6",
        fontFamily: "'Be Vietnam Pro', Arial, Helvetica, sans-serif",
    },
};

const Value = () => {
    return (
        <section style={styles.section}>
            <h2 style={styles.heading}>Giá Trị Cốt Lõi</h2>
            <p style={styles.paragraph}>
                Không chỉ là một chuyến đi—mà còn là hành trình, sự tự do và những kỷ niệm khó quên.
                Chúng tôi mang đến cho bạn giải pháp di chuyển tiện lợi, đáng tin cậy và tiết kiệm để bạn có thể an tâm tận hưởng từng chặng đường phía trước.
            </p>
        </section>
    );
};

export default Value;
