import "../about.css"

const Card = () => {
    return (
        < section className="container" >
            <div className="gridContainer">
                {[
                    { title: "Our Journey", text: "Born from a love of adventure, we set out to make travel simple, seamless, and stress-free." },
                    { title: "Our Commitment", text: "Transparency, trust, and top-tier service—our promise to every customer, every trip." },
                    { title: "What We Offer", text: "From self-drive to luxury chauffeur services, we put you in the driver’s seat of your journey." },
                    { title: "Happy Travelers", text: "10,000+ journeys, countless smiles. Join a growing community of satisfied travelers." }
                ].map((item, index) => (
                    <div className="card" key={index}>
                        <h3>{item.title}</h3>
                        <p>{item.text}</p>
                    </div>
                ))}
            </div>
        </section >
    )
}

export default Card;