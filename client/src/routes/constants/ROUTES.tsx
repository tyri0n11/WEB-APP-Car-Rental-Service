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
    PROFILE: '/profile',
    BOOKING_CONFIRMATION: '/booking-confirmation',
    PAYMENT: '/payment',
  },

  // Admin routes
  ADMIN: {
    DASHBOARD: '/admin',
  },
} as const;