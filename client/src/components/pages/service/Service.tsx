import React from 'react';
import ServiceFilter from '../../filters/ServiceFilter';
import CustomePaginate from '../../paginations/CustomePaginate';

const Service: React.FC = () => {
  const styles = {
    container: {
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
    },
    content: {
      maxWidth: '1250px',
      margin: '0 auto',
      padding: '24px 16px',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1E3A8A',
      marginBottom: '24px',
    },
  };

  return (
    <div style={styles.container}>
      <ServiceFilter />
      <div style={styles.content}>
        <h1 style={styles.title}>Danh sách xe có sẵn</h1>
        <CustomePaginate />
      </div>
    </div>
  );
};

export default Service; 