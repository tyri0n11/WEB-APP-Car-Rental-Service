import images from "../../../../assets/images/images";

const styles = {
    container: {
        maxWidth: "1200px",
        margin: "4rem auto",
        padding: "0 1.5rem",
        fontFamily: "'Be Vietnam Pro', Arial, Helvetica, sans-serif",
    },
    contentWrapper: {
        display: "flex",
        alignItems: "center",
        gap: "2.5rem", // tăng khoảng cách giữa text và ảnh
        fontFamily: "'Be Vietnam Pro', Arial, Helvetica, sans-serif",
    },
    textContainer: {
        flex: "60%",
        padding: "2.5rem 2rem 2.5rem 0", // thêm padding phải
        fontFamily: "'Be Vietnam Pro', Arial, Helvetica, sans-serif",
    },
    heading: {
        fontSize: "3rem",
        fontWeight: "bold",
        marginBottom: "1.5rem", // thêm khoảng cách dưới heading
        fontFamily: "'Be Vietnam Pro', Arial, Helvetica, sans-serif",
    },
    paragraph: {
        marginTop: "1.2rem",
        color: "#555",
        fontSize: "1rem",
        lineHeight: "1.7", // tăng line-height cho dễ đọc
        fontFamily: "'Be Vietnam Pro', Arial, Helvetica, sans-serif",
    },
    imageContainer: {
        flex: "40%",
        paddingLeft: "1rem", // thêm padding trái cho ảnh
    },
    image: {
        width: "100%",
        borderRadius: "10px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)", // thêm bóng nhẹ cho ảnh
    },
};

const Intro = () => {
    return (
        <section style={styles.container}>
            <div style={styles.contentWrapper}>
                <div style={styles.textContainer}>
                    <h2 style={styles.heading}>Về Chúng Tôi</h2>
                    <p style={styles.paragraph}>
                        Tại <strong>Cristiano Ronaldo Supachol (CRS) Car Rentals</strong>, chúng tôi cam kết mang đến dịch vụ cho thuê xe xuất sắc, phù hợp với mọi nhu cầu của bạn.
                        Dù bạn đang khám phá thành phố, bắt đầu một hành trình dài hay cần một chiếc xe sang cho dịp đặc biệt, <strong>CRS</strong> luôn đảm bảo trải nghiệm di chuyển liền mạch và không lo lắng.
                    </p>
                    <p style={styles.paragraph}>
                        Với cam kết mạnh mẽ về <strong>độ tin cậy, giá cả hợp lý và sự hài lòng của khách hàng</strong>, chúng tôi cung cấp đa dạng các dòng xe được bảo dưỡng kỹ lưỡng, từ xe tiết kiệm đến xe sang trọng.
                        Dù bạn muốn tự lái hay tận hưởng sự tiện lợi với tài xế chuyên nghiệp, <strong>CRS</strong> luôn đảm bảo sự thoải mái, hiệu quả và chất lượng trong từng chuyến đi.
                    </p>
                </div>
                <div style={styles.imageContainer}>
                    <img src={images.about_intro} alt="Car Rental Service" style={styles.image} />
                </div>
            </div>
        </section>
    );
};

export default Intro;
