import CustomePaginate from "../../paginations/CustomePaginate";
import Hero from "./sections/hero/Hero";
import UniqueValue from "./sections/UniqueValue";


const Home: React.FC = () => {


  return (
    <div style={{gap: "100px"}}>
      <Hero />
      <CustomePaginate limit={4} showFilter = {false} showPagination={false} />
      <UniqueValue />
    </div>
  );
}

export default Home;

