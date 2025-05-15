import type { Car, CarCategory, FindManyCarsQuery } from '../types/car'
import type { PaginatedResponse } from '../types/booking'
import { BaseApi } from './base'

class CarApi extends BaseApi {
    async findMany(query?: FindManyCarsQuery): Promise<PaginatedResponse<Car>> {
        return this.get<PaginatedResponse<Car>>('/cars', query || {})
    }

    async findOne(id: string): Promise<Car> {
        const result = await this.get<{ data: Car }>(`/cars/${id}`, {})
        return result.data
    }

    async findCategories(): Promise<CarCategory[]> {
        const result = await this.get<{ data: CarCategory[] }>('/cars/categories', {})
        return result.data
    }

    async findFavorites(): Promise<Car[]> {
        const result = await this.get<{ data: Car[] }>('/cars/favorite', {})
        return result.data
    }

    async addFavorite(carId: string): Promise<Car> {
        const result = await this.post<{ data: Car }>(`/cars/${carId}/favorite`)
        return result.data
    }

    async removeFavorite(carId: string): Promise<void> {
        await this.delete(`/cars/${carId}/favorite`)
    }
}

export const carApi = new CarApi() 