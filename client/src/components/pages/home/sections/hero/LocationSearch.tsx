import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

interface LocationSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (location: string) => void;
}

const locations = ["Ha Noi", "Ho Chi Minh", "Da Nang"];

const LocationSearchModal: React.FC<LocationSearchModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Choose places"
      style={{ content: modalStyles.content }}
      overlayClassName="modal-overlay"
    >
      <h2 style={modalStyles.title}>Chọn địa điểm</h2>
      <ul style={modalStyles.list}>
        {locations.map((location) => (
          <li
            key={location}
            style={modalStyles.locationItem}
            onClick={() => onConfirm(location)}
          >
            {location}
          </li>
        ))}
      </ul>
      <button onClick={onClose} style={modalStyles.closeBtn}>
        Đóng
      </button>
    </Modal>
  );
};

const modalStyles: { [key: string]: React.CSSProperties } = {
  overlay: {
    zIndex: 1000,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center" as const,
    backgroundColor: "#fff",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    width: "300px",
    zIndex: 1001,
  },
  title: {
    fontSize: "18px",
    marginBottom: "10px",
    color: "#333",
  },
  list: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
  },
  locationItem: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    cursor: "pointer",
    textAlign: "left",
  },
  closeBtn: {
    marginTop: "10px",
    padding: "8px 12px",
    backgroundColor: "#d9534f",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer",
    border: "none",
    width: "100%",
  },
};

export default LocationSearchModal;
