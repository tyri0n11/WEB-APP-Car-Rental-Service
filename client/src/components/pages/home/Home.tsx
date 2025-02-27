import Hero from "./sections/Hero";
import Services from "./sections/Services";
import Contact from "./sections/Contact";
import UniqueValue from "./sections/UniqueValue";
const Home: React.FC = () => {
  return (
    <div>
      <Hero />
      <UniqueValue />
      <Services />
      <Contact />
    </div>
  );
};

export default Home;
