import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { getCars } from "../../apis/cars";

const CustomePaginate = () => {
  const [cars, setCars] = useState<{ id: number; make: string; model: string }[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetchCars(currentPage);
  }, [currentPage]);

  const fetchCars = async (page: number) => {
    const params = { page: page + 1, perPage: 10 }; // Adjust perPage as needed
    const response = await getCars(params);
    setCars(response.cars);
    setPageCount(response.pagination.lastPage);
  };

  const handlePageClick = (data: { selected: number }) => {
    setCurrentPage(data.selected);
  };

  return (
    <div>
      <ul>
        {cars.map((car) => (
          <li key={car.id}>
            {car.make} {car.model}
          </li>
        ))}
      </ul>
      <ReactPaginate
        previousLabel={"previous"}
        nextLabel={"next"}
        breakLabel={"..."}
        breakClassName={"break-me"}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        // subContainerClassName={"pages pagination"}
        activeClassName={"active"}
      />
    </div>
  );
};

export default CustomePaginate;
