import React from 'react';

interface IconContentCardProps {
  icon: string;
  text: string;
}

const styles = {
  card: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
    padding: '1rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    gap: '1rem',
  },
  icon: {
    width: '40px',
    height: '40px', 
  },
};

const IconContentCard: React.FC<IconContentCardProps> = ({ icon, text }) => {
  return (
    <div style={styles.card}>
      <img src={icon} alt='icon' style={styles.icon} />
      <div>
        <p>{text}</p>
      </div>
    </div>
  );
};

export default IconContentCard;