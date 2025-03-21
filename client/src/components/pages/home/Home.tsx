import Hero from "./sections/hero/Hero";
import CarList from "./sections/CarList";
import UniqueValue from "./sections/UniqueValue";
import Contact from "./sections/Contact";


const Home: React.FC = () => {


  return (
    <div>
      <Hero />
      <CarList />
      <UniqueValue />
      <Contact />
    </div>
  );
}

export default Home;

