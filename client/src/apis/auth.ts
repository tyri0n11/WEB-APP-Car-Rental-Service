import type { AuthResponse, LoginInput, SignupInput, User } from '../types/auth'
import { BaseApi, handleApiError } from './base'

class AuthApi extends BaseApi {
    async login(input: LoginInput): Promise<AuthResponse> {
        try {
            const result = await this.post<{ data: AuthResponse }>('/auth/login', input)
            return result.data
        } catch (error) {
            throw handleApiError(error)
        }
    }

    async signup(input: SignupInput): Promise<void> {
        try {
            await this.post('/auth/signup', input)
        } catch (error) {
            throw handleApiError(error)
        }
    }

    async getMe(): Promise<User> {
        try {
            const result = await this.get<{ data: User }>('/auth/me', {})
            return result.data
        } catch (error) {
            throw handleApiError(error)
        }
    }    async refreshToken(): Promise<{ accessToken: string }> {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const result = await this.post<{ data: { accessToken: string } }>(
                '/auth/refresh-token',
                { refreshToken }
            );

            if (!result?.data?.accessToken) {
                throw new Error('Invalid refresh token response');
            }

            localStorage.setItem('accessToken', result.data.accessToken);
            return result.data;
        } catch (error) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            throw handleApiError(error);
        }
    }

    async forgotPassword(email: string): Promise<void> {
        try {
            await this.post('/auth/email/forgot-password', { email })
        } catch (error) {
            throw handleApiError(error)
        }
    }

    async resetPassword(token: string, password: string): Promise<void> {
        try {
            await this.post('/auth/reset-password', { token, newPassword: password })
        } catch (error) {
            throw handleApiError(error)
        }
    }

    async verifyEmail(token: string): Promise<void> {
        try {
            await this.post('/auth/verify-account', { token })
        } catch (error) {
            throw handleApiError(error)
        }
    }

    async resendVerificationEmail(email: string): Promise<void> {
        try {
            await this.post('/auth/email/verify-account', { email })
        } catch (error) {
            throw handleApiError(error)
        }
    }

    async changePassword(oldPassword: string, newPassword: string): Promise<void> {
        try {
            await this.post('/auth/change-password', { oldPassword, newPassword })
        } catch (error) {
            throw handleApiError(error)
        }
    }
}

export const authApi = new AuthApi();