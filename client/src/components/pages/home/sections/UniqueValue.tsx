import React from 'react';
import icons from '../../../../assets/icons/index';
import AnimatedButton from '../../../buttons/AnimatedButton';
import IconContentCard from '../../../cards/IconContentCard';

const styles = {
  container: {
    padding: '2rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
  },
  cardContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1rem',
    justifyContent: 'center',
  },
  cardWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
};

const UniqueValue: React.FC = () => {
  const content: { text: string; icon: string }[] = [
    { text: 'Affordable Pricing – Competitive rates with no hidden fees', icon: icons.price },
    { text: 'Well-Maintained Vehicles – Regularly serviced and in top condition', icon: icons.maintenance },
    { text: 'Flexible Booking – Easy online reservation or walk-in rentals', icon: icons.flexible },
    { text: '24/7 Customer Support – Assistance whenever you need it', icon: icons.allday },
    { text: 'Convenient Pickup & Drop-off – Hassle-free locations & delivery options', icon: icons.convenience },
  ];

  return (
    <div style={styles.container}>
      <h4>Why Choose Us?</h4>
      <div style={styles.cardContainer}>
        {content.map((item, index) => (
          <div key={index} style={styles.cardWrapper}>
            <IconContentCard text={item.text} icon={item.icon} />
          </div>
        ))}
      </div>
      <AnimatedButton text="Book Now" onClick={() => alert('Button Clicked!')} />
    </div>
  );
};

export default UniqueValue;