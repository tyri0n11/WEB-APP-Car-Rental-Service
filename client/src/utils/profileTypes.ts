// Define the driving license interface
export interface DrivingLicence {
    licenceNumber: string;
    drivingLicenseImages: string[];
    expiryDate: string;
}

// Define the extended user type that includes driving license details
export interface ExtendedUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    profileImage?: string;
    drivingLicence?: DrivingLicence;
}

// Form data type for the account form
export interface AccountFormData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    profileImage: string;
    drivingLicence: {
        licenceNumber: string;
        expiryDate: string;
        drivingLicenseImages: string[];
    };
}

// Define the address interface
export interface Address {
    id: string;
    userId: string;
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    isDefault: boolean;
}

// Define the ride interface
export interface Ride {
    id: string;
    carId: string;
    carName: string;
    carImage: string;
    startDate: string;
    endDate: string;
    pickupAddress: string;
    returnAddress: string;
    totalPrice: number;
    status: 'completed' | 'cancelled' | 'upcoming';
}

// Define the car interface
export interface CarImage {
    id: string;
    url: string;
    isMain: boolean;
}

export interface CarCategory {
    category: {
        id: string;
        name: string;
    };
}

export interface CarReview {
    id: string;
    rating: number;
    comment: string;
    userName: string;
}

export interface Car {
    id: string;
    make: string;
    model: string;
    year: number;
    kilometers: number;
    description: string;
    dailyPrice: number;
    licensePlate: string;
    numSeats: number;
    address: string;
    autoGearbox: boolean;
    rating: number;
    fuelType: string;
    status: string;
    categories: CarCategory[];
    images: CarImage[];
    reviews: CarReview[];
} 