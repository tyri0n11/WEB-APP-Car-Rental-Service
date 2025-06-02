'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import type { Category, CreateCategoryInput, CategoryContextValue } from '../types/category'
import { categoryApi } from '../apis/category'

const initialState: Omit<CategoryContextValue, 'createCategory' | 'deleteCategory' | 'getCategory' | 'getAllCategories'> = {
    categories: [],
    isLoading: false,
    error: null
}

const CategoryContext = createContext<CategoryContextValue | undefined>(undefined)

export function CategoryProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState(initialState)

    const createCategory = useCallback(async (input: CreateCategoryInput) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }))
            const category = await categoryApi.create(input)
            setState(prev => ({
                ...prev,
                categories: [...prev.categories, category],
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

    const deleteCategory = useCallback(async (id: string) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }))
            await categoryApi.deleteCategory(id)
            setState(prev => ({
                ...prev,
                categories: prev.categories.filter(category => category.id !== id),
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

    const getCategory = useCallback(async (id: string) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }))
            const category = await categoryApi.getOne(id)
            setState(prev => ({
                ...prev,
                categories: prev.categories.some(c => c.id === category.id)
                    ? prev.categories.map(c => c.id === category.id ? category : c)
                    : [...prev.categories, category],
                isLoading: false
            }))
            return category
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'An error occurred',
                isLoading: false
            }))
            throw error
        }
    }, [])

    const getAllCategories = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }))
            const categories = await categoryApi.getAll()
            setState(prev => ({
                ...prev,
                categories,
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

    const value = {
        ...state,
        createCategory,
        deleteCategory,
        getCategory,
        getAllCategories
    }

    return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>
}

export function useCategory() {
    const context = useContext(CategoryContext)
    if (context === undefined) {
        throw new Error('useCategory must be used within a CategoryProvider')
    }
    return context
}

export default CategoryContext 