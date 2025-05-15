export interface Review {
  id: string
  rating: number
  comment: string
  createdAt: string
  updatedAt: string
  userId: string
  carId: string
  user: {
    id: string
    firstName: string
    lastName: string
    avatar?: string
  }
}

export interface CreateReviewInput {
  rating: number
  comment: string
  carId: string
}

export interface ReviewContextValue {
  reviews: Review[]
  isLoading: boolean
  error: string | null
  createReview: (input: CreateReviewInput) => Promise<void>
  deleteReview: (id: string) => Promise<void>
  getReview: (id: string) => Promise<Review>
}

export interface CreateReviewRequest {
  bookingId: string
  rating: number
  comment?: string
}

export interface FindManyReviewsQuery {
  page?: number
  perPage?: number
  carId?: string
  userId?: string
} 