import { useState } from "react";
import styles from "./AddressForm.module.css";

const AddressForm = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [defaultAddress, setDefaultAddress] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState({
        nickname: "",
        city: "",
        district: "",
        ward: "",
        street: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setAddresses([...addresses, newAddress]);
        if (!defaultAddress) setDefaultAddress(newAddress); // Set as default if no default exists
        setNewAddress({ nickname: "", city: "", district: "", ward: "", street: "" }); // Reset form
        setIsOpen(false); // Close modal
    };

    const handleSetDefault = (index: number) => {
        setDefaultAddress(addresses[index]);
    };

    return (
        <div className={styles.container}>
            <button className={styles.addButton} onClick={() => setIsOpen(true)}>
                Thêm địa chỉ mới
            </button>

            <h2 className={styles.title}>Địa chỉ đã lưu</h2>

            {defaultAddress ? (
                <div className={styles.defaultContainer}>
                    <h3 className={styles.defaultTitle}>Địa chỉ mặc định</h3>
                    <p className={styles.defaultAddress}>
                        <strong>{defaultAddress.nickname}</strong>: {defaultAddress.street}, {defaultAddress.ward}, {defaultAddress.district}, {defaultAddress.city}
                    </p>
                </div>
            ) : (
                <p className={styles.noDefaultAddress}>Chưa có địa chỉ mặc định</p>
            )}

            {addresses.length > 0 && (
                <ul className={styles.addressList}>
                    {addresses.map((address, index) => (
                        <li key={index} className={styles.addressItem}>
                            <div>
                                <strong>{address.nickname}</strong>: {address.street}, {address.ward}, {address.district}, {address.city}
                            </div>
                            <button
                                className={styles.setDefaultButton}
                                onClick={() => handleSetDefault(index)}
                            >
                                Đặt làm mặc định
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {isOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h3>Thêm địa chỉ mới</h3>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.field}>
                                <label>Tên gọi nhỏ</label>
                                <input
                                    type="text"
                                    name="nickname"
                                    value={newAddress.nickname}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.field}>
                                <label>Thành phố</label>
                                <select
                                    name="city"
                                    value={newAddress.city}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Chọn thành phố</option>
                                    <option value="HCMC">TP Hồ Chí Minh</option>
                                    <option value="HN">Hà Nội</option>
                                </select>
                            </div>
                            <div className={styles.field}>
                                <label>Quận / Huyện</label>
                                <select
                                    name="district"
                                    value={newAddress.district}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Chọn quận huyện</option>
                                    <option value="District 1">Quận 1</option>
                                    <option value="District 2">Quận 2</option>
                                </select>
                            </div>
                            <div className={styles.field}>
                                <label>Phường / Xã</label>
                                <select
                                    name="ward"
                                    value={newAddress.ward}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Chọn phường xã</option>
                                    <option value="Ward 1">Phường 1</option>
                                    <option value="Ward 2">Phường 2</option>
                                </select>
                            </div>
                            <div className={styles.field}>
                                <label>Địa chỉ</label>
                                <input
                                    type="text"
                                    name="street"
                                    value={newAddress.street}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.actions}>
                                <button
                                    type="button"
                                    className={styles.cancelButton}
                                    onClick={() => setIsOpen(false)}
                                >
                                    Hủy
                                </button>
                                <button type="submit" className={styles.confirmButton}>
                                    Xác nhận
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddressForm;
