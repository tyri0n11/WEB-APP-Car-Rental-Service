import type { User } from '../types/user'
import type { UpdateProfileInput, UpdateDrivingLicenseInput } from '../types/user'
import { BaseApi, handleApiError } from './base'

class UserApi extends BaseApi {
    async updateProfile(input: UpdateProfileInput): Promise<User> {
        try {
            const result = await this.patch<{ data: User }>('/user/update-profile', input)
            return result.data
        } catch (error) {
            throw handleApiError(error)
        }
    }

    async updateDrivingLicense(input: UpdateDrivingLicenseInput): Promise<User> {
        try {
            const result = await this.patch<{ data: User }>('/user/update-driving-licence', input)
            return result.data
        } catch (error) {
            throw handleApiError(error)
        }
    }

    async deleteAccount(id: string): Promise<void> {
        try {
            await this.delete(`/user/${id}`)
        } catch (error) {
            throw handleApiError(error)
        }
    }

    async getUser(id: string): Promise<User> {
        try {
            const result = await this.get<{ data: User }>(`/user/${id}`, {})
            return result.data
        } catch (error) {
            throw handleApiError(error)
        }
    }
}

export const userApi = new UserApi() 