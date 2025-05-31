import type { Car, CarCategory, CreateCarRequest, FindManyCarsQuery, UpdateCarRequest, UploadCarImagesResponse } from '../types/car' // Added CreateCarRequest, UpdateCarRequest, UploadCarImagesResponse
import type { PaginatedResponse } from '../types/booking'
import { BaseApi, handleApiError } from './base' // Import handleApiError

class CarApi extends BaseApi {
    async findMany(query?: FindManyCarsQuery): Promise<PaginatedResponse<Car>> {
        try {
            return await this.get<PaginatedResponse<Car>>('/cars', query || {})
        } catch (error) {
            throw handleApiError(error);
        }
    }

    async findOne(id: string): Promise<Car> {
        try {
            const result = await this.get<{ data: Car }>(`/cars/${id}`, {})
            return result.data
        } catch (error) {
            throw handleApiError(error);
        }
    }

    async findCategories(): Promise<CarCategory[]> {
        try {
            const result = await this.get<{ data: CarCategory[] }>('/cars/categories', {})
            return result.data
        } catch (error) {
            throw handleApiError(error);
        }
    }

    async findFavorites(): Promise<Car[]> {
        try {
            const result = await this.get<{ data: Car[] }>('/cars/favorite', {})
            return result.data
        } catch (error) {
            throw handleApiError(error);
        }
    }

    async addFavorite(carId: string): Promise<Car> {
        try {
            const result = await this.post<{ data: Car }>(`/cars/${carId}/favorite`)
            return result.data
        } catch (error) {
            throw handleApiError(error);
        }
    }

    async removeFavorite(carId: string): Promise<void> {
        try {
            await this.delete(`/cars/${carId}/favorite`)
        } catch (error) {
            throw handleApiError(error);
        }
    }

    // Admin/Protected methods based on backend controller
    async create(data: CreateCarRequest): Promise<Car> {
        try {
            const result = await this.post<{ data: Car }>('/cars', data);
            return result.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }

    async update(id: string, data: UpdateCarRequest): Promise<Car> {
        try {
            const result = await this.patch<{ data: Car }>(`/cars/${id}`, data);
            return result.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }

    async deleteCar(id: string): Promise<void> {
        try {
            await this.delete(`/cars/${id}`);
        } catch (error) {
            throw handleApiError(error);
        }
    }

}

export const carApi = new CarApi()