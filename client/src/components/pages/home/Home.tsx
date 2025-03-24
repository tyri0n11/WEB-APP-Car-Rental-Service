import CarList from "./sections/CarList";
import Hero from "./sections/hero/Hero";
import UniqueValue from "./sections/UniqueValue";


const Home: React.FC = () => {


  return (
    <div>
      <Hero />
      <CarList />
      <UniqueValue />
    </div>
  );
}

export default Home;

