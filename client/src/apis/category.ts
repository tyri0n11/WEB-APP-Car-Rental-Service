import type { Category, CreateCategoryInput } from '../types/category'
import { BaseApi, handleApiError } from './base'

class CategoryApi extends BaseApi {
    async create(input: CreateCategoryInput): Promise<Category> {
        try {
            const result = await this.post<{ data: Category }>('/categories', input)
            return result.data
        } catch (error) {
            throw handleApiError(error)
        }
    }

    async getAll(): Promise<Category[]> {
        try {
            const result = await this.get<{ data: Category[] }>('/categories')
            return result.data
        } catch (error) {
            throw handleApiError(error)
        }
    }

    async getOne(id: string): Promise<Category> {
        try {
            const result = await this.get<{ data: Category }>(`/categories/${id}`)
            return result.data
        } catch (error) {
            throw handleApiError(error)
        }
    }

    async deleteCategory(id: string): Promise<void> {
        try {
            await this.delete(`/categories/${id}`)
        } catch (error) {
            throw handleApiError(error)
        }
    }
}

export const categoryApi = new CategoryApi() 