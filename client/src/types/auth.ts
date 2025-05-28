export interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    avatar?: string
    role: 'USER' | 'ADMIN'
    isEmailVerified: boolean
    createdAt: string
    updatedAt: string
}

export interface LoginInput {
    email: string
    password: string
}

export interface SignupInput {
    email: string
    password: string
    firstName: string
    lastName: string
    phoneNumber: string
}

export interface AuthResponse {
    accessToken: string
    refreshToken: string
    user: User
}

export interface AuthContextValue {
    user: User | null
    loading: boolean
    error: string | null
    isAuthenticated: boolean
    login: (input: LoginInput) => Promise<void>
    signup: (input: SignupInput) => Promise<void>
    logout: () => Promise<void>
    refreshToken: () => Promise<void>
    forgotPassword: (email: string) => Promise<void>
    resetPassword: (token: string, password: string) => Promise<void>
    verifyEmail: (token: string) => Promise<void>
    resendVerificationEmail: (email: string) => Promise<void>
    changePassword: (currentPassword: string, newPassword: string) => Promise<void>
} 