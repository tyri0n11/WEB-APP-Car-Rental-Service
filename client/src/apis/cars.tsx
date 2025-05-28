import axios from 'axios';
import { CarStatus, FuelType } from '../types/car';

const API_URL = 'http://localhost:3000/cars';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark this request as retried
      
      try {
        const { authApi } = (await import('./auth'));
        await authApi.refreshToken();
        
        // Get new token and update the request
        const token = localStorage.getItem('accessToken');
        if (!token) {
          throw new Error('No token after refresh');
        }
        
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(originalRequest);
        
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export enum CarSortBy {
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  NEWEST = 'newest',
  OLDEST = 'oldest',
  RATING = 'rating',
}

export interface CarQueryParams {
  page?: number;
  perPage?: number;
  q?: string;
  sortBy?: CarSortBy;
  priceFrom?: number;
  priceTo?: number;
  make?: string;
  model?: string;
  fuelType?: FuelType;
  status?: CarStatus;
  yearFrom?: number;
  yearTo?: number;
  categoryIds?: string;
  address?: string;
  pickupDate?: string;
  returnDate?: string;
}

export interface CarImage {
  isPrimary: boolean;
  id: number;
  url: string;
}

export interface CarCategory {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  kilometers: number;
  description: string;
  dailyPrice: number;
  licensePlate: string;
  rating: number;
  fuelType: FuelType;
  address: string;
  numSeats: number;
  autoGearbox: boolean;
  status: CarStatus;
  images: CarImage[];
  categories: CarCategory[];
  createdAt: string;
  updatedAt: string;
}

export interface CarsResponse {
  data: any;
  pagination: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
  cars: Car[];
}

export interface CreateCarData {
  make: string;
  model: string;
  year: number;
  kilometers: number;
  description?: string;
  dailyPrice: number;
  licensePlate: string;
  fuelType: FuelType;
  address: string;
  numSeats: number;
  autoGearbox: boolean;
  imageUrls?: string[];
  categoryIds?: string[];
}

export interface UpdateCarData {
  make?: string;
  model?: string;
  year?: number;
  kilometers?: number;
  description?: string;
  dailyPrice?: number;
  licensePlate?: string;
  numSeats?: number;
  autoGearbox?: boolean;
  fuelType?: FuelType;
  address?: string;
}

export const getCars = async (params?: CarQueryParams): Promise<CarsResponse> => {
  const response = await axiosInstance.get('', { params });
  return response.data;
};

export const getCarById = async (id: string): Promise<Car> => {
  try {
    console.log('Fetching car details for ID:', id);
    const response = await axiosInstance.get(`/${id}`);
    console.log('API Response:', response);
    
    if (!response.data) {
      console.error('No data in response');
      throw new Error('No data received from server');
    }
    
    // Check if the data is wrapped in a data property
    const carData = response.data.data || response.data;
    
    if (!carData) {
      console.error('No car data in response');
      throw new Error('Car not found');
    }
    
    // Validate that we have the required car properties
    if (!carData.id || !carData.make || !carData.model) {
      console.error('Invalid car data structure:', carData);
      throw new Error('Invalid car data received');
    }
    
    return carData;
  } catch (error: any) {
    console.error('Error in getCarById:', error);
    
    // Handle specific error cases
    if (error.response) {
      console.error('Response error status:', error.response.status);
      console.error('Response error data:', error.response.data);
      
      switch (error.response.status) {
        case 401:
          throw new Error('401: Unauthorized access');
        case 404:
          throw new Error('404: Car not found');
        default:
          throw new Error(`${error.response.status}: ${error.response.data?.message || 'Error fetching car details'}`);
      }
    }
    
    // If it's a network error or other type of error
    throw new Error(`Failed to fetch car details: ${error.message}`);
  }
};

export const createCar = async (carData: CreateCarData): Promise<Car> => {
  const response = await axiosInstance.post('', carData);
  return response.data;
};

export const updateCar = async (id: string, carData: UpdateCarData): Promise<Car> => {
  const response = await axiosInstance.patch(`/${id}`, carData);
  return response.data;
};

export const updateCarStatus = async (id: string, status: string): Promise<Car> => {
  const response = await axiosInstance.patch(`/${id}/status`, { status });
  return response.data;
};

export const deleteCar = async (id: string): Promise<boolean> => {
  const response = await axiosInstance.delete(`/${id}`);
  return response.data;
};

export const computeTotalPrice = (dailyPrice: number, startDate: Date, endDate: Date): number => {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return dailyPrice * diffDays;
};