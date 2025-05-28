// routes/constants.ts
export const ROUTES = {
  // Public routes
  PUBLIC: {
    HOME: '/',
    ABOUT: '/about',
    CONTACT: '/contact',
    SERVICES: '/services',
    CAR_DETAIL: (id: string) => `/cars/${id}`,
  },

  // Auth routes
  AUTH: {
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  // Protected routes
  PROTECTED: {
    PROFILE: '/user/profile',
    PROFILE_SECTIONS: {
      MEMBERSHIP: '/user/profile/membership',
      RIDES: '/user/profile/rides',
      FAVORITES: '/user/profile/favorites',
      ACCOUNT: '/user/profile/account',
      PASSWORD: '/user/profile/password',
    },
    BOOKING_CONFIRMATION: '/user/booking-confirmation',
    PAYMENT: '/user/payment',
    COMPLETED_BOOKING: '/user/completed-booking'
  },

  // Admin routes
  ADMIN: {
    DASHBOARD: '/admin',
  },
} as const;