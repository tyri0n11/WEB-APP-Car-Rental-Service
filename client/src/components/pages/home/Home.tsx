import Hero from "./sections/Hero";
import Services from "./sections/Services";
import UniqueValue from "./sections/UniqueValue";
const Home: React.FC = () => {
  return (
    <div>
      <Hero />
      <UniqueValue />
      <Services />
    </div>
  );
};

export default Home;
