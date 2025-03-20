import React from 'react';

const Services: React.FC = () => {
  return (
      <main className="main-content">
        <section className="introduction">
          <h1>Our Rental Car Fleet</h1>
          <p>
            Lotus Car Rental is proud to offer unlimited mileage and all-inclusive rates on all rentals (insurance and taxes included in the price!). Save up to 20% by booking your rental car today!
          </p>
          <p>
            Whether you’re cruising around the city of Reykjavík or exploring the backroads of Iceland, our fleet of 4x4 rental cars, vans, and compact car rentals provide safety, quality, and reliability during your Icelandic journey. Offering friendly and helpful customer service along the way, our cheap car rentals have unlimited mileage and no hidden costs. We have a great selection of 4x4 rental cars for F-road traveling during the summer period and winter driving in Iceland.
          </p>
        </section>

        {/* Vehicle Categories */}
        <section className="vehicle-categories">
          <ul>
            <li><a href="#small-cars">Small Cars</a></li>
            <li><a href="#medium-cars">Medium Cars</a></li>
            <li><a href="#large-cars">Large Cars</a></li>
            <li><a href="#4x4">4x4</a></li>
            <li><a href="#campers">Campers</a></li>
            <li><a href="#luxury-cars">Luxury Cars</a></li>
            <li><a href="#minivans">Minivans</a></li>
          </ul>
        </section>

        {/* Vehicle Listings */}
        <section className="vehicle-listings">
          {/* Example Vehicle Listing */}
          <div className="vehicle-category" id="small-cars">
            <h2>Small Cars</h2>
            <div className="vehicle">
              <h3>Toyota Aygo (manual) - Model 2023-2024</h3>
              <ul>
                <li>Transmission: Manual</li>
                <li>Drivetrain: FWD</li>
                <li>Passenger Capacity: 4 Passengers</li>
                <li>F-Road Eligibility: Not allowed</li>
                <li>Luggage Capacity: 1 Suitcase</li>
                <li>Fuel Type: Gasoline</li>
              </ul>
              <div className="vehicle-actions">
                <a href="/vehicle-details/toyota-aygo" className="more-info">More Information</a>
                <a href="/book/toyota-aygo" className="book-now">BOOK NOW</a>
              </div>
            </div>
            {/* Additional vehicle listings can be added here following the same structure */}
          </div>
        </section>

        {/* Included Benefits */}
        <section className="included-benefits">
          <h2>Included in our Rental Prices:</h2>
          <ul>
            <li>PAI, SCDW, and TP insurances</li>
            <li>24/7 road assistance</li>
            <li>Unlimited mileage</li>
            <li>Free pick-up and drop-off</li>
            <li>Fuel discounts</li>
            <li>Studded winter tyres (seasonal)</li>
            <li>Free cancellation</li>
            <li>No deposit required</li>
          </ul>
        </section>
      </main>
  );
};

export default Services;
