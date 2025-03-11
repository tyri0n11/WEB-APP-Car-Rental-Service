import React from "react";
const About: React.FC = () => {
    return (
        <div className="about-container">
            <h1 className="about-title">Cristiano Ronaldo Supachok Car Rentals</h1>
            <p className="about-quote">"Drive Like Ronaldo, Dribble Through Traffic Like Supachok!" 🚗💨</p>

            <section className="about-section">
                <h2>Who Are We?</h2>
                <p>
                    Welcome to <strong>Cristiano Ronaldo Supachok Car Rentals</strong>, where renting a car isn’t just a transaction—it’s a{" "}
                    <span className="highlight">Champions League experience</span>. Inspired by{" "}
                    <span className="highlight">Cristiano Ronaldo’s GOAT mentality</span> and{" "}
                    <span className="highlight">Supachok Sarachat’s elite dribbling</span>, we provide{" "}
                    <strong>fast, reliable, and game-changing</strong> car rentals.
                </p>
            </section>

            <section className="about-section">
                <h2>Why Choose Us?</h2>
                <ul>
                    <li>✅ <strong>Siuuuu-fast bookings</strong> – No delays, just quick access!</li>
                    <li>✅ <strong>Affordable prices</strong> – More value than a last-minute CR7 header.</li>
                    <li>✅ <strong>Legendary fleet</strong> – From economic whips to luxury goal-scoring machines.</li>
                    <li>✅ <strong>Customer service so good</strong>, it feels like a Supachok assist.</li>
                    <li>✅ <strong>No hidden fees</strong> – Just like Supachok, we keep it clean & fair.</li>
                </ul>
            </section>

            <section className="about-section">
                <h2>Our Mission</h2>
                <p>
                    At <strong>Cristiano Ronaldo Supachok Car Rentals</strong>, we don’t just rent cars—we <span className="highlight">deliver greatness</span>.
                    Our goal is to give you a smooth, stress-free rental experience, just like a <strong>Supachok through ball landing perfectly at Ronaldo’s feet.</strong>
                </p>
            </section>

            <div className="about-footer">
                🚀 <strong>Drive like a champion. Rent with the GOATs.</strong> 🚀
            </div>
        </div>
    );
};

export default About;
