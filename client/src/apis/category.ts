import type { Category, CreateCategoryInput, UpdateCategoryInput } from '../types/category'
import { BaseApi, handleApiError } from './base'

class CategoryApi extends BaseApi {
    async create(input: CreateCategoryInput): Promise<Category> {
        try {
            // Only send name for creation, as per backend DTO
            const payload = { name: input.name }; 
            const result = await this.post<{ data: Category }>('/categories', payload);
            return result.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }

    async getAll(): Promise<Category[]> {
        try {
            // Pass an empty object or undefined for params if not used
            const result = await this.get<{ data: Category[] }>('/categories', {})
            return result.data
        } catch (error) {
            throw handleApiError(error)
        }
    }

    async getOne(id: string): Promise<Category> {
        try {
            // Pass an empty object or undefined for params if not used
            const result = await this.get<{ data: Category }>(`/categories/${id}`, {})
            return result.data
        } catch (error) {
            throw handleApiError(error)
        }
    }

    async update(id: string, input: UpdateCategoryInput): Promise<Category> {
        try {
            const result = await this.patch<{ data: Category }>(`/categories/${id}`, input)
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