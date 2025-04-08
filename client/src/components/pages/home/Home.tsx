import CustomePaginate from "../../paginations/CustomPaginate";
import Hero from "./sections/hero/Hero";
import UniqueValue from "./sections/UniqueValue";


const Home: React.FC = () => {


  return (
    <div>
      <Hero />
      <CustomePaginate maxDisplay={4} showFilter={false} showPagination={false} />
      <UniqueValue />
    </div>
  );
}

export default Home;

