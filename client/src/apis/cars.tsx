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
    console.log('Cars API: Authorization header set with token');
  } else {
    console.log('Cars API: No token found in localStorage (accessToken)');
  }
  return config;
});

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
  const token = localStorage.getItem('accessToken');
  console.log('getCarById: Authorization token from localStorage:', token ? 'Token exists' : 'No token found');
  
  try {
    const response = await axiosInstance.get(`/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error in getCarById:', error);
    throw error;
  }
};

export const createCar = async (carData: CreateCarData): Promise<Car> => {
  const response = await axiosInstance.post('', carData);
  return response.data;
};

export const updateCar = async (id: string, carData: UpdateCarData): Promise<Car> => {
  const token = localStorage.getItem('accessToken');
  console.log('updateCar: Authorization token from localStorage:', token ? 'Token exists' : 'No token found');
  
  try {
    const response = await axiosInstance.patch(`/${id}`, carData);
    return response.data;
  } catch (error) {
    console.error('Error in updateCar:', error);
    throw error;
  }
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