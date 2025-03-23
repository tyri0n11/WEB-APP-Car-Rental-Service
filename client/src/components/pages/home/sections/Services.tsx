import React from 'react';
import AnimatedButton from '../../../buttons/AnimatedButton';
import TitleContentCard from '../../../cards/TitleContentCard';
import ServicesFilter from '../../../filters/ServiceFilter';

const Services: React.FC = () => {
  const services = [
    { title: 'Economy Cars', description: 'Budget-friendly and fuel-efficient' },
    { title: 'Sedans', description: 'Comfortable and stylish for business or family use' },
    { title: 'SUVs & 4x4s', description: 'Power and space for long trips and rough terrains' },
    { title: 'Luxury & Sports Cars', description: 'Drive in style with high-end vehicles' },
    { title: 'Vans & Minibuses', description: 'Perfect for group travels' },
  ];

  const styles = {
    container: {
      width: '100%',
      backgroundColor: '#f5f5f5',
    },
    servicesContainer: {
      maxWidth: '1250px',
      margin: '0 auto',
      padding: '40px 16px',
      textAlign: 'center' as const,
    },
    serviceTitle: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#1E3A8A',
      marginBottom: '16px',
    },
    description: {
      fontSize: '16px',
      color: '#666',
      marginBottom: '32px',
    },
    serviceCardContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '24px',
      marginBottom: '40px',
    },
  };

  return (
    <div style={styles.container}>
      <ServicesFilter />
      <div style={styles.servicesContainer}>
        <h4 style={styles.serviceTitle}>Choose Your Ride</h4>
        <p style={styles.description}>We offer a diverse selection of vehicles to suit every journey</p>
        <div style={styles.serviceCardContainer}>
          {services.map((service, index) => (
            <TitleContentCard title={service.title} content={service.description} key={index} />
          ))}
        </div>
        <AnimatedButton text="View all cars" onClick={() => console.log("View all cars")}/>
      </div>
    </div>
  );
};

export default Services;