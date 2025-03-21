import { Component } from 'react';

interface Image {
  id: string;
  url: string;
  isMain: boolean;
}

interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  fuelType: string;
  status: string;
  kilometers: number;
  description: string;
  dailyPrice: number;
  licensePlate: string;
  address: string;
  numSeats: number;
  autoGearbox: boolean;
  images: Image[];
  categories: Category[];
  createdAt: string;
  updatedAt: string;
}

interface PaginationInfo {
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
  prev: number | null;
  next: number | null;
}

interface State {
  cars: Car[];
  pagination: PaginationInfo;
  isLoading: boolean;
}

class CustomePaginate extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      cars: [],
      pagination: {
        total: 0,
        lastPage: 0,
        currentPage: 1,
        perPage: 10,
        prev: null,
        next: null,
      },
      isLoading: false,
    };
  }

  componentDidMount() {
    this.fetchCars();
  }

  fetchCars = () => {
    const { currentPage, perPage } = this.state.pagination;
    this.setState({ isLoading: true });

    fetch(`http://localhost:3000/cars?page=${currentPage}&perPage=${perPage}`)
      .then((res) => res.json())
      .then((data: { cars: Car[]; pagination: PaginationInfo }) => {
        this.setState({
          cars: data.cars,
          pagination: data.pagination,
          isLoading: false,
        });
      })
      .catch((error) => {
        console.error('Error fetching cars:', error);
        this.setState({ isLoading: false });
      });
  };

  handlePageChange = (newPage: number) => {
    this.setState(
      (prevState) => ({
        pagination: {
          ...prevState.pagination,
          currentPage: newPage,
        },
      }),
      this.fetchCars
    );
  };

  render() {
    const { cars, pagination, isLoading } = this.state;

    return (
      <div className="car-list-container">
        <h2>Car Listings</h2>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {cars && cars.map((car) => (
              <li key={car.id}>
                console.log(car);
                <strong>{car.make} {car.model}</strong> - {car.year} - {car.dailyPrice} USD/day
              </li>
            ))}
          </ul>
        )}

        <div className="pagination-controls">
          {pagination && pagination.prev && (
            <button onClick={() => this.handlePageChange(pagination.prev!)}>
              Prev
            </button>
          )}

          {pagination && (
            <span>
              Page {pagination.currentPage} of {pagination.lastPage}
            </span>
          )}

          {pagination && pagination.next && (
            <button onClick={() => this.handlePageChange(pagination.next!)}>
              Next
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default CustomePaginate;
