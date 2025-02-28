import React from 'react';
import icons from '../../../../assets/icons/index';
import AnimatedButton from '../../../buttons/AnimatedButton';
import IconContentCard from '../../../cards/IconContentCard';

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5rem',
    margin: 'auto',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
  },
  header: {
    textAlign: 'center',
    fontSize: '2rem',
    marginBottom: '2rem',
  },
  cardContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '1rem',
    justifyContent: 'center',
    padding: '2rem',
  },
  cardWrapper: {
    width: '300px',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
  },
};

const UniqueValue: React.FC = () => {
  const content: { text: string; icon: string }[] = [
    { text: 'Affordable Pricing', icon: icons.price },
    { text: 'Well-Maintained Vehicles', icon: icons.maintenance },
    { text: 'Flexible Booking', icon: icons.flexible },
    { text: '24/7 Customer Support', icon: icons.allday },
    { text: 'Convenient Pickup & Drop-off', icon: icons.convenience },
  ];

  return (
    <div style={styles.container}>
      <h4 style={styles.header}>Why Choose Us?</h4>
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