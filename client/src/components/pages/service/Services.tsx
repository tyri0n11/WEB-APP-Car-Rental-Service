import React from 'react';
import CustomePaginate from '../../paginations/CustomePaginate';
import './Services.css';

const Services: React.FC = () => {
  return (
      <main className="services-main-content">
        <section className="services-introduction">
          <h1>Our Rental Car Fleet</h1>
          <p>
            Lotus Car Rental is proud to offer unlimited mileage and all-inclusive rates on all rentals (insurance and taxes included in the price!). Save up to 20% by booking your rental car today!
          </p>
          <p>
            Whether you’re cruising around the city of Reykjavík or exploring the backroads of Iceland, our fleet of 4x4 rental cars, vans, and compact car rentals provide safety, quality, and reliability during your Icelandic journey. Offering friendly and helpful customer service along the way, our cheap car rentals have unlimited mileage and no hidden costs. We have a great selection of 4x4 rental cars for F-road traveling during the summer period and winter driving in Iceland.
          </p>
        </section>
        <section className="services-list">
          <CustomePaginate />
        </section>
        
        
      </main>
  );
};

export default Services;
