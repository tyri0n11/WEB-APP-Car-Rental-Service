'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import type { Review, CreateReviewInput, ReviewContextValue } from '../types/review'
import { reviewApi } from '../apis/review'

const initialState: Omit<ReviewContextValue, 'createReview' | 'deleteReview' | 'getReview'> = {
    reviews: [],
    isLoading: false,
    error: null
}

const ReviewContext = createContext<ReviewContextValue | undefined>(undefined)

export function ReviewProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState(initialState)

    const createReview = useCallback(async (input: CreateReviewInput) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }))
            const review = await reviewApi.create(input)
            setState(prev => ({
                ...prev,
                reviews: [...prev.reviews, review],
                isLoading: false
            }))
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'An error occurred',
                isLoading: false
            }))
            throw error
        }
    }, [])

    const deleteReview = useCallback(async (id: string) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }))
            await reviewApi.delete(id)
            setState(prev => ({
                ...prev,
                reviews: prev.reviews.filter(review => review.id !== id),
                isLoading: false
            }))
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'An error occurred',
                isLoading: false
            }))
            throw error
        }
    }, [])

    const getReview = useCallback(async (id: string) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }))
            const review = await reviewApi.getOne(id)
            setState(prev => ({
                ...prev,
                reviews: prev.reviews.some(r => r.id === review.id)
                    ? prev.reviews.map(r => r.id === review.id ? review : r)
                    : [...prev.reviews, review],
                isLoading: false
            }))
            return review
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'An error occurred',
                isLoading: false
            }))
            throw error
        }
    }, [])

    const value = {
        ...state,
        createReview,
        deleteReview,
        getReview
    }

    return <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>
}

export function useReview() {
    const context = useContext(ReviewContext)
    if (context === undefined) {
        throw new Error('useReview must be used within a ReviewProvider')
    }
    return context
}

export default ReviewContext 