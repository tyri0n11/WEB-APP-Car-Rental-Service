import dummyFavoriteCars from './dummy/favorites.json';
import axios from 'axios';
import { Car } from '../contexts/CarContext.tsx';

/**
 * Fetches favorite cars from dummy data
 * @returns Promise that resolves to an array of favorite cars
 */
export const fetchDummyFavorites = (): Promise<Car[]> => {
    return new Promise((resolve) => {
        // Simulate network delay
        setTimeout(() => {
            resolve(dummyFavoriteCars as Car[]);
        }, 500);
    });
};

/**
 * Removes a car from dummy favorites
 * @param carId The ID of the car to remove
 * @param currentFavorites The current list of favorite cars
 * @returns Promise that resolves to the updated list of favorite cars
 */
export const removeDummyFavorite = (carId: string, currentFavorites: Car[]): Promise<Car[]> => {
    return new Promise((resolve) => {
        // Simulate network delay
        setTimeout(() => {
            const updatedFavorites = currentFavorites.filter(car => car.id !== carId);
            resolve(updatedFavorites);
        }, 300);
    });
};

/**
 * Fetches favorite cars from API or dummy data
 * @param useDummy Whether to use dummy data
 * @returns Promise that resolves to an array of favorite cars
 */
export const fetchFavorites = async (useDummy: boolean = false): Promise<Car[]> => {
    if (useDummy) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(dummyFavoriteCars as Car[]);
            }, 500);
        });
    } else {
        try {
            const response = await axios.get("/api/users/favorites", {
                headers: {
                    Authorization: `Bearer {accessToken}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching favorite cars:", error);
            throw error;
        }
    }
};

/**
 * Adds a car to favorites via API or dummy data
 * @param carId The ID of the car to add
 * @param car The car object to add to favorites
 * @param currentFavorites The current list of favorite cars (dummy data)
 * @param useDummy Whether to use dummy data
 * @returns Promise that resolves to the updated list of favorite cars
 */
export const addFavorite = async (
    carId: string,
    car: Car,
    currentFavorites: Car[] = [],
    useDummy: boolean = false
): Promise<Car[]> => {
    if (useDummy) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const updatedFavorites = [...currentFavorites, car];
                resolve(updatedFavorites);
            }, 500);
        });
    } else {
        try {
            const response = await axios.post(`/api/users/favorites/${carId}`, car, {
                headers: {
                    Authorization: `Bearer {accessToken}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error adding car to favorites:", error);
            throw error;
        }
    }
};

/**
 * Removes a car from favorites via API or dummy data
 * @param carId The ID of the car to remove
 * @param currentFavorites The current list of favorite cars (dummy data)
 * @param useDummy Whether to use dummy data
 * @returns Promise that resolves to the updated list of favorite cars
 */
export const removeFavorite = async (
    carId: string,
    currentFavorites: Car[] = [],
    useDummy: boolean = false
): Promise<Car[]> => {
    if (useDummy) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const updatedFavorites = currentFavorites.filter((car) => car.id !== carId);
                resolve(updatedFavorites);
            }, 300);
        });
    } else {
        try {
            await axios.delete(`/api/users/favorites/${carId}`, {
                headers: {
                    Authorization: `Bearer {accessToken}`,
                },
            });
            return currentFavorites.filter((car) => car.id !== carId);
        } catch (error) {
            console.error("Error removing car from favorites:", error);
            throw error;
        }
    }
};

/**
 * Checks if a car is in favorites via API or dummy data
 * @param carId The ID of the car to check
 * @param currentFavorites The current list of favorite cars (dummy data)
 * @param useDummy Whether to use dummy data
 * @returns Promise that resolves to whether the car is a favorite
 */
export const isFavorite = async (
    carId: string,
    currentFavorites: Car[] = [],
    useDummy: boolean = false
): Promise<boolean> => {
    if (useDummy) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const isFavorite = currentFavorites.some((car) => car.id === carId);
                resolve(isFavorite);
            }, 300);
        });
    } else {
        try {
            const response = await axios.get(`/api/users/favorites/check/${carId}`, {
                headers: {
                    Authorization: `Bearer {accessToken}`,
                },
            });
            return response.data.isFavorite;
        } catch (error) {
            console.error("Error checking favorite status:", error);
            throw error;
        }
    }
};
