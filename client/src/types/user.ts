
export enum Role {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER'
}

export enum ActionType {
  VIEW_CAR = 'VIEW_CAR',
  SEARCH = 'SEARCH',
  ADD_TO_FAVORITES = 'ADD_TO_FAVORITES',
  BOOK_CAR = 'BOOK_CAR',
  CANCEL_BOOKING = 'CANCEL_BOOKING',
  FILTER_APPLY = 'FILTER_APPLY'
}

export interface DrivingLicence {
  id: string
  licenceNumber: string
  drivingLicenseImages: string[]
  expiryDate: string
  userId: string | null
  createdAt: string
  updatedAt: string
}

export interface UserPreference {
  id: string
  userId: string
  preference: string // e.g., "fuelType:ELECTRIC", "make:Toyota"
  weight: number // Strength of preference (0-1)
  createdAt: string
  updatedAt: string
}

export interface FavoriteCar {
  id: string
  userId: string
  carId: string
  createdAt: string
  updatedAt: string
  car?: {
    id: string
    make: string
    model: string
    year: number
    dailyPrice: number
    licensePlate: string
    images?: { url: string; isMain: boolean }[]
  }
}

export interface UserAction {
  id: string
  userId: string
  carId: string
  actionType: ActionType
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string | null
  isVerified: boolean
  role: Role
  drivingLicence?: DrivingLicence
  userPreferences?: UserPreference[]
  favoriteCars?: FavoriteCar[]
  userActions?: UserAction[]
  createdAt: string
  updatedAt: string
}

export interface CreateUserRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber?: string
}

export interface UpdateUserRequest {
  firstName?: string
  lastName?: string
  phoneNumber?: string
  drivingLicence?: {
    licenceNumber: string
    drivingLicenseImages: string[]
    expiryDate: string
  }
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
}

export interface FindManyUsersQuery {
  page?: number
  perPage?: number
  role?: Role
  isVerified?: boolean
  search?: string
}

export interface UpdateProfileInput {
  firstName: string
  lastName: string
  phoneNumber?: string
  avatar?: string
}

export interface UpdateDrivingLicenseInput {
  licenceNumber: string
  expiryDate: string
  imageUrls: string[]
}

export interface UserContextValue {
    user: User | null
    isLoading: boolean
    error: string | null
    updateProfile: (input: UpdateProfileInput) => Promise<void>
    updateDrivingLicense: (input: UpdateDrivingLicenseInput) => Promise<void>
    deleteAccount: () => Promise<void>
    getUser: (id: string) => Promise<User>
} 