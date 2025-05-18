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

export interface CarCategory {
  ECONOMY: 'economy',
  COMPACT: 'compact',
  MIDSIZE: 'midsize',
  LUXURY: 'luxury',
  SUV: 'suv',
  VAN: 'van'
}

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

export interface FindManyCarsQuery {
  page?: number
  perPage?: number
  status?: CarStatus[keyof CarStatus]
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  sortBy?: CarSortBy
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