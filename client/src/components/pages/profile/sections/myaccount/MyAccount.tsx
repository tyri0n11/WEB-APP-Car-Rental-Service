import { FaCheckCircle, FaTimesCircle, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../../../../hooks/useAuth';
import './myaccount.css';

const MyAccount = () => {
  const {user} = useAuth();

  return (
    <div className="myaccount-root">
      <div className="myaccount-card">
        <div className="myaccount-header">
          <FaUserCircle className="myaccount-avatar" />
          <div className="myaccount-info">
            <h5>{user?.firstName} {user?.lastName}</h5>
            <p>{user?.email}</p>
            <p>
            {user?.isVerified ? <FaCheckCircle className="verified-icon" /> : <FaTimesCircle className="not-verified-icon" />}
            </p>
          </div>
        </div>
        <div className="myaccount-details">
          <p>Phone Number: {user?.phoneNumber}</p>
          <p>Driving Licence ID: {user?.drivingLicenceId}</p>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
