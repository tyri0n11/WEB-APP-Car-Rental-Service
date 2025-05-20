import { motion } from "framer-motion";
import React from "react";

const styles: { [key: string]: React.CSSProperties } = {
  section: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "50px 20px",
    textAlign: "center",
    fontFamily: "'Be Vietnam Pro', Arial, Helvetica, sans-serif",
  },
  title: {
    fontSize: "40px",
    fontWeight: "bold",
    color: "#1E3A8A",
    margin: "16px auto 8px auto",
    textAlign: "center",
    fontFamily: "'Be Vietnam Pro', Arial, Helvetica, sans-serif",
    letterSpacing: "0.5px",
  },
  description: {
    fontSize: "18px",
    color: "#64748B",
    marginTop: "10px",
    marginBottom: "24px",
    fontFamily: "'Be Vietnam Pro', Arial, Helvetica, sans-serif",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "40px",
    marginTop: "40px",
    fontFamily: "'Be Vietnam Pro', Arial, Helvetica, sans-serif",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 2px 12px rgba(30,58,138,0.07)",
    padding: "32px 18px 28px 18px",
    fontFamily: "'Be Vietnam Pro', Arial, Helvetica, sans-serif",
    gap: "10px",
  },
  image: {
    width: "110px",
    height: "110px",
    marginBottom: "12px",
  },
  cardTitle: {
    marginTop: "12px",
    fontSize: "22px",
    fontWeight: "600",
    color: "#334155",
    fontFamily: "'Be Vietnam Pro', Arial, Helvetica, sans-serif",
    letterSpacing: "0.2px",
  },
  cardDescription: {
    marginTop: "8px",
    fontSize: "16px",
    color: "#475569",
    fontFamily: "'Be Vietnam Pro', Arial, Helvetica, sans-serif",
    lineHeight: 1.6,
  },
};

const uniqueValues = [
  {
    id: 1,
    title: "Giá cả hợp lý",
    description:
      "Chúng tôi cung cấp mức giá tốt nhất trên thị trường, không phí ẩn. Thuê xe phù hợp ngân sách mà vẫn đảm bảo chất lượng và dịch vụ.",
    image: "https://www.mioto.vn/static/media/thue_xe_co_tai_xe.a6f7dc54.svg",
  },
  {
    id: 2,
    title: "Đặt xe linh hoạt",
    description:
      "Dễ dàng thay đổi hoặc hủy đặt xe với chính sách linh hoạt. Yên tâm khi kế hoạch di chuyển của bạn có thể thay đổi bất ngờ.",
    image: "https://www.mioto.vn/static/media/dich_vu_thue_xe_tu_lai_hanoi.f177339e.svg",
  },
  {
    id: 3,
    title: "Xe được bảo dưỡng tốt",
    description:
      "Tất cả xe đều được bảo dưỡng, kiểm tra định kỳ để đảm bảo trải nghiệm lái xe an toàn, mượt mà. Luôn tự tin trên mọi hành trình.",
    image: "https://www.mioto.vn/static/media/cho_thue_xe_tu_lai_tphcm.1e7cb1c7.svg",
  },
  {
    id: 4,
    title: "Đa dạng dòng xe",
    description:
      "Hơn 100 mẫu xe cho bạn lựa chọn: Mini, Sedan, CUV, SUV, MPV, Pickup...",
    image: "https://www.mioto.vn/static/media/thue_xe_tu_lai_gia_re_hanoi.4035317e.svg",
  },
  {
    id: 5,
    title: "Thanh toán dễ dàng",
    description:
      "Nhiều phương thức thanh toán: ATM, thẻ Visa và ví điện tử (Momo, VnPay, ZaloPay).",
    image: "https://www.mioto.vn/static/media/cho_thue_xe_tu_lai_hanoi.735438af.svg",
  },
];

const UniqueValue: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.section
      style={styles.section}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <motion.h2
        style={styles.title}
        variants={itemVariants}
      >
        Vì sao chọn chúng tôi?
      </motion.h2>
      <motion.p
        style={styles.description}
        variants={itemVariants}
      >
        Những điểm nổi bật giúp việc thuê xe trên CRS dễ dàng hơn
      </motion.p>
      <motion.div
        style={styles.gridContainer}
        variants={containerVariants}
      >
        {uniqueValues.map((item) => (
          <motion.div
            key={item.id}
            style={styles.card}
            variants={itemVariants}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
          >
            <motion.img
              src={item.image}
              alt={item.title}
              style={styles.image}
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
            <motion.h3
              style={styles.cardTitle}
              variants={itemVariants}
            >
              {item.title}
            </motion.h3>
            <motion.p
              style={styles.cardDescription}
              variants={itemVariants}
            >
              {item.description}
            </motion.p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default UniqueValue;
