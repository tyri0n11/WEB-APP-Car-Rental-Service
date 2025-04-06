import dummyFavoriteCars from './dummy/favoriteCars.json';
import { Car, CarImage, CarCategory, CarReview } from './profileTypes';

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
 * API Endpoints for Favorites (to be implemented later):
 * 
 * 1. Get user's favorite cars:
 *    GET /api/users/favorites
 *    Headers: Authorization: Bearer {accessToken}
 *    Response: Array of favorite car objects
 * 
 * 2. Add a car to favorites:
 *    POST /api/users/favorites/{carId}
 *    Headers: Authorization: Bearer {accessToken}
 *    Response: Updated favorite car object
 * 
 * 3. Remove a car from favorites:
 *    DELETE /api/users/favorites/{carId}
 *    Headers: Authorization: Bearer {accessToken}
 *    Response: Success message
 * 
 * 4. Check if a car is in favorites:
 *    GET /api/users/favorites/check/{carId}
 *    Headers: Authorization: Bearer {accessToken}
 *    Response: { isFavorite: boolean }
 */ 