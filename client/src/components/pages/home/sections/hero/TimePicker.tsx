import React, { useState } from "react";
import Modal from "react-modal";
//import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


Modal.setAppElement("#root");

interface TimePickerModalProps {
  onConfirm: (timeRange: string) => void;
}

const TimePickerModal: React.FC<TimePickerModalProps> = ({ onConfirm }) => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

  const quickSelect = (days: number) => {
    const now = new Date();
    setStartDate(now);
    setEndDate(new Date(now.getTime() + days * 24 * 60 * 60 * 1000));
  };

  const handleConfirm = () => {
    if (startDate && endDate) {
      const timeRange = `${startDate.toLocaleString()} - ${endDate.toLocaleString()}`;
      onConfirm(timeRange);
    }
  };

  return (
    <Modal isOpen onRequestClose={handleConfirm} contentLabel="Choose Time">
      <h2>Pickup Time</h2>

      <div>
        <button onClick={() => quickSelect(1)}>📅 1 day</button>
        <button onClick={() => quickSelect(2)}>📅 2 days</button>
        <button onClick={() => quickSelect(7)}>📅 1 weeks</button>
      </div>

      <div>
        <label>:</label>
{/*<DatePicker
  selected={startDate}
  onChange={(date: Date | null) => setStartDate(date)}
  showTimeSelect
  dateFormat="Pp"
/>*/}

      </div>

      <div>
        <label>Trả xe:</label>
        {/*<DatePicker selected={endDate} onChange={(date) => setEndDate(date)} showTimeSelect />*/}

      </div>

      <button onClick={handleConfirm}>Confirm</button>
    </Modal>
  );
};

export default TimePickerModal;
