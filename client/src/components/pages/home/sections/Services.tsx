import React from 'react';
import AnimatedButton from '../../../buttons/AnimatedButton';
import TitleContentCard from '../../../cards/TitleContentCard';
const styles: { [key: string]: React.CSSProperties } = {
  servicesContainer: {
    padding: '2rem',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
  },
  serviceCardContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: '2rem',
    gap: '3rem'
  },
  serviceTitle: {
    marginBottom: '1rem',
    fontSize: '3rem',
  },
  serviceDescription: {
    marginBottom: '1rem',
    fontSize: '1rem',
  },
  rentalPlans: {
    marginTop: '2rem',
    fontSize: '1.25rem',
  },
  viewAllButton: {
    marginTop: '1rem',
    padding: '10px 20px',
    fontSize: '1rem',
    color: 'white',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  viewAllButtonHover: {
    backgroundColor: '#0056b3',
  },
};

const Services: React.FC = () => {
  const services = [
    { title: 'Economy Cars', description: 'Budget-friendly and fuel-efficient' },
    { title: 'Sedans', description: 'Comfortable and stylish for business or family use' },
    { title: 'SUVs & 4x4s', description: 'Power and space for long trips and rough terrains' },
    { title: 'Luxury & Sports Cars', description: 'Drive in style with high-end vehicles' },
    { title: 'Vans & Minibuses', description: 'Perfect for group travels' },
  ];

  return (
    <div style={styles.servicesContainer}>
      <h4 style={styles.serviceTitle}>Choose Your Ride</h4>
      <p>We offer a diverse selection of vehicles to suit every journey</p>
      <div style={styles.serviceCardContainer}>
        {services.map((service, index) => (
          <TitleContentCard title={service.title} content={service.description} key={index} />
        ))}
      </div>
      <AnimatedButton text="View all cars" onClick={() => console.log("View all cars")} />
    </div>
  );
};

export default Services;