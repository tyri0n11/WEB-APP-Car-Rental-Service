import React from 'react';

const UniqueValue: React.FC = () => {


  return (
    <div style={styles.containerStyle}>
      <h4>Why Choose Us?</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
        {[
          'Affordable Pricing – Competitive rates with no hidden fees',
          'Well-Maintained Vehicles – Regularly serviced and in top condition',
          'Flexible Booking – Easy online reservation or walk-in rentals',
          '24/7 Customer Support – Assistance whenever you need it',
          'Convenient Pickup & Drop-off – Hassle-free locations & delivery options',
        ].map((text, index) => (
          <div style={{ flex: '1 1 calc(50% - 1rem)', maxWidth: 'calc(50% - 1rem)' }} key={index}>
            <div style={styles.cardStyle}>
              <span style={styles.iconStyle}>✔️</span>
              <div>
                <p>{text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button style={styles.buttonStyle}>Book Now</button>
    </div>
  );
};
const styles = {
    containerStyle :{
        padding: '2rem',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        textAlign: 'center' as 'center',
      },
    
      cardStyle : {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1rem',
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    
      iconStyle: {
        marginRight: '1rem',
        fontSize: '1.5rem',
        color: '#007bff',
      },
    
      buttonStyle: {
        marginTop: '1rem',
        padding: '0.5rem 1rem',
        fontSize: '1rem',
        color: 'white',
        backgroundColor: '#007bff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
      },
}
export default UniqueValue;