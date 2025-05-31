export interface Car {
  id: string
  name: string
  brand: string
  model: string
  year: number
  color: string
  licensePlate: string
  fuelType: FuelType[keyof FuelType]
  transmission: 'automatic' | 'manual'
  seats: number
  pricePerDay: number
  status: CarStatus[keyof CarStatus]
  location: string
  images: CarImage[]
  category: CarCategory[keyof CarCategory]
  features: string[]
  description: string
  isFavorite?: boolean
}

export interface CreateCarRequest {
  name: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  fuelType: FuelType[keyof FuelType];
  transmission: 'automatic' | 'manual';
  seats: number;
  pricePerDay: number;
  status: CarStatus[keyof CarStatus];
  location: string;
  categoryId: string; // Assuming category is assigned by ID
  features?: string[];
  description?: string;
  // images might be handled by a separate upload endpoint after creation
}

export interface UpdateCarRequest extends Partial<CreateCarRequest> {
  // All fields are optional for update
}

export interface UploadCarImagesResponse {
  // Define based on what your backend returns, e.g., list of new CarImage objects or just a success message
  message?: string;
  images?: CarImage[];
}

export interface CarImage {
  id: string
  url: string
  isPrimary: boolean
}

export enum FuelType {
  PETROL = 'petrol',
  DIESEL = 'diesel',
  ELECTRIC = 'electric',
  HYBRID = 'hybrid'
}

export interface CarStatus {
  AVAILABLE: 'available',
  RENTED: 'rented',
  MAINTENANCE: 'maintenance',
  UNAVAILABLE: 'unavailable'
}

// Consolidated CarCategory type - assuming API returns a list of these for /cars/categories
export interface CarCategory {
  id: string;
  name: string;
  // Remove the more complex nested CarCategory definition if this is the primary one
}

// Remove the duplicate/more complex CarCategory definition below if it was this one:
/*
export interface CarCategory {
  id: string
  carId: string
  categoryId: string
  category: {
    id: string
    name: string
    createdAt: string
    updatedAt: string
  }
  createdAt: string
  updatedAt: string
}
*/

export interface FindManyCarsQuery {
  page?: number
  perPage?: number
  make?: string; // Added
  model?: string; // Added
  year?: number; // Added
  category?: string; // Changed from categoryId to category (string name) or ensure it's categoryId if backend expects ID
  minPrice?: number
  maxPrice?: number
  availability?: CarStatus[keyof CarStatus]; // Added
  location?: string; // Added
  transmission?: 'automatic' | 'manual'; // Added
  fuelType?: FuelType[keyof FuelType]; // Added
  color?: string; // Added
  seats?: number; // Added
  features?: string; // Assuming features is a comma-separated string for query params, or adjust if it's an array
  search?: string
  sortBy?: CarSortBy | string; // Allow string for flexibility with backend values
  sortOrder?: 'asc' | 'desc'; // Added
}

export enum CarSortBy {
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  NEWEST = 'newest',
  OLDEST = 'oldest',
  RATING = 'rating'
}

export interface CarContextState {
  cars: Car[]
  favorites: Car[]
  isLoading: boolean
  error: Error | null
}

export interface CarContextValue extends CarContextState {
  fetchCars: () => Promise<void>
  fetchFavorites: () => Promise<void>
  addFavorite: (carId: string) => Promise<void>
  removeFavorite: (carId: string) => Promise<void>
  isFavorite: (carId: string) => boolean
}