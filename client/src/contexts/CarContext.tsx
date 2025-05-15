'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import type { Car, CarCategory, FindManyCarsQuery } from '../types/car'
import { carApi } from '../apis/car'

interface CarState {
    cars: Car[]
    categories: CarCategory[]
    selectedCar: Car | null
    isLoading: boolean
    error: string | null
    pagination: {
        total: number
        page: number
        perPage: number
        totalPages: number
    }
    favorites: Car[]
}

interface CarContextType extends CarState {
    fetchCars: (query?: FindManyCarsQuery) => Promise<void>
    fetchCategories: () => Promise<void>
    getCar: (id: string) => Promise<void>
    fetchFavorites: () => Promise<void>
    addFavorite: (carId: string) => Promise<void>
    removeFavorite: (carId: string) => Promise<void>
    isFavorite: (carId: string) => boolean
}

const initialState: CarState = {
    cars: [],
    categories: [],
    selectedCar: null,
    isLoading: false,
    error: null,
    pagination: {
        total: 0,
        page: 1,
        perPage: 10,
        totalPages: 0
    },
    favorites: []
}

const CarContext = createContext<CarContextType | undefined>(undefined)

export function CarProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<CarState>(initialState)

    const fetchCars = useCallback(async (query?: FindManyCarsQuery) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }))
            const response = await carApi.findMany(query)
            setState(prev => ({ 
                ...prev, 
                cars: response.data.map(car => ({
                    ...car,
                    isFavorite: prev.favorites.some(fav => fav.id === car.id)
                })),
                pagination: response.meta,
                isLoading: false
            }))
        } catch (error) {
            setState(prev => ({ 
                ...prev, 
                error: error instanceof Error ? error.message : 'An unknown error occurred',
                isLoading: false
            }))
        }
    }, [])

    const fetchCategories = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }))
            const categories = await carApi.findCategories()
            setState(prev => ({ ...prev, categories, isLoading: false }))
        } catch (error) {
            setState(prev => ({ 
                ...prev, 
                error: error instanceof Error ? error.message : 'An unknown error occurred',
                isLoading: false
            }))
        }
    }, [])

    const getCar = useCallback(async (id: string) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }))
            const car = await carApi.findOne(id)
            setState(prev => ({ ...prev, selectedCar: car, isLoading: false }))
        } catch (error) {
            setState(prev => ({ 
                ...prev, 
                error: error instanceof Error ? error.message : 'An unknown error occurred',
                isLoading: false
            }))
        }
    }, [])

    const fetchFavorites = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }))
            const favorites = await carApi.findFavorites()
            setState(prev => ({ 
                ...prev, 
                favorites,
                cars: prev.cars.map(car => ({
                    ...car,
                    isFavorite: favorites.some(fav => fav.id === car.id)
                })),
                isLoading: false
            }))
        } catch (error) {
            setState(prev => ({ 
                ...prev, 
                error: error instanceof Error ? error.message : 'An unknown error occurred',
                isLoading: false
            }))
        }
    }, [])

    const addFavorite = useCallback(async (carId: string) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }))
            const favorite = await carApi.addFavorite(carId)
            setState(prev => ({
                ...prev,
                favorites: [...prev.favorites, favorite],
                cars: prev.cars.map(car => 
                    car.id === carId ? { ...car, isFavorite: true } : car
                ),
                isLoading: false
            }))
        } catch (error) {
            setState(prev => ({ 
                ...prev, 
                error: error instanceof Error ? error.message : 'An unknown error occurred',
                isLoading: false
            }))
            throw error
        }
    }, [])

    const removeFavorite = useCallback(async (carId: string) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }))
            await carApi.removeFavorite(carId)
            setState(prev => ({
                ...prev,
                favorites: prev.favorites.filter(fav => fav.id !== carId),
                cars: prev.cars.map(car => 
                    car.id === carId ? { ...car, isFavorite: false } : car
                ),
                isLoading: false
            }))
        } catch (error) {
            setState(prev => ({ 
                ...prev, 
                error: error instanceof Error ? error.message : 'An unknown error occurred',
                isLoading: false
            }))
            throw error
        }
    }, [])

    const isFavorite = useCallback((carId: string) => {
        return state.favorites.some(fav => fav.id === carId)
    }, [state.favorites])

    const value = {
        ...state,
        fetchCars,
        fetchCategories,
        getCar,
        fetchFavorites,
        addFavorite,
        removeFavorite,
        isFavorite
    }

    return <CarContext.Provider value={value}>{children}</CarContext.Provider>
}

export function useCar() {
    const context = useContext(CarContext)
    if (context === undefined) {
        throw new Error('useCar must be used within a CarProvider')
    }
    return context
}

export default CarContext 