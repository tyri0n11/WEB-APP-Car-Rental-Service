import { Component } from 'react';
import { mockCars, mockPagination } from '../../utils/dummy/carsData';
import CarCard from '../cards/CarCard';

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
        perPage: 8,
        prev: null,
        next: null,
      },
      isLoading: false,
    };
  }

  componentDidMount() {
    this.loadMockData();
  }

  loadMockData = () => {
    const { currentPage, perPage } = this.state.pagination;
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedCars = mockCars.slice(startIndex, endIndex);

    this.setState({
      cars: paginatedCars,
      pagination: {
        ...mockPagination,
        currentPage,
        prev: currentPage > 1 ? currentPage - 1 : null,
        next: currentPage < mockPagination.lastPage ? currentPage + 1 : null,
      },
      isLoading: false,
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
      this.loadMockData
    );
  };

  render() {
    const { cars, pagination, isLoading } = this.state;

    const styles = {
      container: {
        maxWidth: "1250px",
        margin: "0 auto",
        padding: "16px",
        width: "100%",
        boxSizing: "border-box" as const,
      },
      gridContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "20px",
        marginBottom: "20px",
        width: "100%",
        "@media (max-width: 768px)": {
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "15px",
        },
        "@media (max-width: 480px)": {
          gridTemplateColumns: "1fr",
          gap: "20px",
        },
      },
      gridItem: {
        transition: "box-shadow 0.3s ease-in-out, transform 0.2s ease-in-out",
        borderRadius: "12px",
        cursor: "pointer",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column" as const,
      },
      paginationControls: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
        marginTop: "20px",
        flexWrap: "wrap" as const,
        "@media (max-width: 480px)": {
          gap: "10px",
        },
      },
      button: {
        padding: "8px 16px",
        borderRadius: "4px",
        border: "none",
        backgroundColor: "#1E3A8A",
        color: "white",
        cursor: "pointer",
        transition: "background-color 0.2s",
        minWidth: "100px",
        "@media (max-width: 480px)": {
          padding: "6px 12px",
          minWidth: "80px",
        },
      },
      buttonDisabled: {
        backgroundColor: "#ccc",
        cursor: "not-allowed",
      },
      pageInfo: {
        fontSize: "16px",
        color: "#1E3A8A",
        "@media (max-width: 480px)": {
          fontSize: "14px",
        },
      },
      loadingContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "200px",
        width: "100%",
      },
      loadingText: {
        fontSize: "18px",
        color: "#1E3A8A",
      },
    };

    return (
      <div style={styles.container}>
        {isLoading ? (
          <div style={styles.loadingContainer}>
            <p style={styles.loadingText}>Loading...</p>
          </div>
        ) : (
          <>
            <div style={styles.gridContainer}>
              {cars && cars.map((car) => (
                <div
                  key={car.id}
                  style={styles.gridItem}
                  onMouseEnter={(e) => {
                    const width = e.currentTarget.clientWidth;
                    e.currentTarget.style.boxShadow = `0px ${width * 0.05}px ${width * 0.1}px rgba(0, 0, 0, 0.2)`;
                    e.currentTarget.style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <CarCard car={car as any} />
                </div>
              ))}
            </div>

            <div style={styles.paginationControls}>
              <button
                onClick={() => this.handlePageChange(pagination.prev!)}
                style={{
                  ...styles.button,
                  ...(pagination.prev === null ? styles.buttonDisabled : {}),
                }}
                disabled={pagination.prev === null}
              >
                Previous
              </button>

              <span style={styles.pageInfo}>
                Page {pagination.currentPage} of {pagination.lastPage}
              </span>

              <button
                onClick={() => this.handlePageChange(pagination.next!)}
                style={{
                  ...styles.button,
                  ...(pagination.next === null ? styles.buttonDisabled : {}),
                }}
                disabled={pagination.next === null}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    );
  }
}

export default CustomePaginate;
