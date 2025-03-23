export const mockCars = [
  {
    id: "1",
    make: "Toyota",
    model: "Camry",
    year: 2022,
    fuelType: "Petrol",
    status: "Available",
    kilometers: 15000,
    description: "A comfortable and reliable sedan",
    dailyPrice: 50,
    licensePlate: "ABC123",
    address: "123 Main St, City",
    numSeats: 5,
    autoGearbox: true,
    images: [
      {
        id: "img1",
        url: "https://example.com/camry.jpg",
        isMain: true
      }
    ],
    categories: [
      {
        id: "cat1",
        name: "Sedan",
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01"
      }
    ],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: "2",
    make: "Honda",
    model: "Civic",
    year: 2021,
    fuelType: "Petrol",
    status: "Available",
    kilometers: 20000,
    description: "Sporty and efficient compact car",
    dailyPrice: 45,
    licensePlate: "XYZ789",
    address: "456 Oak St, City",
    numSeats: 5,
    autoGearbox: true,
    images: [
      {
        id: "img2",
        url: "https://example.com/civic.jpg",
        isMain: true
      }
    ],
    categories: [
      {
        id: "cat2",
        name: "Compact",
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01"
      }
    ],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: "3",
    make: "Tesla",
    model: "Model 3",
    year: 2023,
    fuelType: "Electric",
    status: "Available",
    kilometers: 5000,
    description: "Modern electric vehicle with advanced features",
    dailyPrice: 80,
    licensePlate: "TES123",
    address: "789 Electric Ave, City",
    numSeats: 5,
    autoGearbox: true,
    images: [
      {
        id: "img3",
        url: "https://example.com/tesla.jpg",
        isMain: true
      }
    ],
    categories: [
      {
        id: "cat3",
        name: "Electric",
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01"
      }
    ],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  }
];

export const mockPagination = {
  total: 3,
  lastPage: 1,
  currentPage: 1,
  perPage: 10,
  prev: null,
  next: null
}; 