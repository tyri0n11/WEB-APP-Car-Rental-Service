import Hero from "./sections/hero/Hero";
import CarList from "./sections/CarList";
import Services from "./sections/Services";
import UniqueValue from "./sections/UniqueValue";
import Contact from "./sections/Contact";


const Home: React.FC = () => {


  return (
    <div>
      <Hero />
      <CarList />
      <Services />
      <UniqueValue />
      <Contact />
    </div>
  );
}

export default Home;

