import type { Review, CreateReviewInput } from '../types/review'
import { BaseApi, handleApiError } from './base'

class ReviewApi extends BaseApi {
    async create(input: CreateReviewInput): Promise<Review> {
        try {
            const result = await this.post<{ data: Review }>('/reviews', input)
            return result.data
        } catch (error) {
            throw handleApiError(error)
        }
    }

    async getOne(id: string): Promise<Review> {
        try {
            const result = await this.get<{ data: Review }>(`/reviews/${id}`, {})
            return result.data
        } catch (error) {
            throw handleApiError(error)
        }
    }

    async deleteReview(id: string): Promise<{ success: boolean }> {
        try {
            const result = await this.delete<{ success: boolean }>(`/reviews/${id}`)
            return result
        } catch (error) {
            throw handleApiError(error)
        }
    }
}

export const reviewApi = new ReviewApi() 