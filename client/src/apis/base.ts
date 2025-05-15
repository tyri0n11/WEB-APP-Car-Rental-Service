const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export class BaseApi {
    protected async get<T>(path: string, params: Record<string, any>): Promise<T> {
        const url = new URL(`${API_BASE_URL}${path}`)
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, String(value))
            }
        })

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: await this.getHeaders()
        })

        if (!response.ok) {
            throw new Error(await this.handleError(response))
        }

        return response.json()
    }

    protected async post<T>(path: string, data?: any): Promise<T> {
        const response = await fetch(`${API_BASE_URL}${path}`, {
            method: 'POST',
            headers: await this.getHeaders(),
            body: data ? JSON.stringify(data) : undefined
        })

        if (!response.ok) {
            throw new Error(await this.handleError(response))
        }

        return response.json()
    }

    protected async put<T>(path: string, data: any): Promise<T> {
        const response = await fetch(`${API_BASE_URL}${path}`, {
            method: 'PUT',
            headers: await this.getHeaders(),
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            throw new Error(await this.handleError(response))
        }

        return response.json()
    }

    protected async patch<T>(path: string, data: any): Promise<T> {
        const response = await fetch(`${API_BASE_URL}${path}`, {
            method: 'PATCH',
            headers: await this.getHeaders(),
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            throw new Error(await this.handleError(response))
        }

        return response.json()
    }

    protected async delete<T = void>(path: string): Promise<T> {
        const response = await fetch(`${API_BASE_URL}${path}`, {
            method: 'DELETE',
            headers: await this.getHeaders()
        })

        if (!response.ok) {
            throw new Error(await this.handleError(response))
        }

        return response.json()
    }

    private async getHeaders(): Promise<HeadersInit> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json'
        }

        const token = localStorage.getItem('accessToken')
        if (token) {
            headers.Authorization = `Bearer ${token}`
        }

        return headers
    }

    private async handleError(response: Response): Promise<string> {
        if (response.status === 401) {
            localStorage.removeItem('accessToken')
            return 'Authentication token expired. Please log in again.'
        }

        const data = await response.json().catch(() => ({}))
        return data.message || 'An error occurred'
    }
}

export const handleApiError = (error: unknown): Error => {
    if (error instanceof Error) {
        return error
    }
    return new Error('An unexpected error occurred')
} 