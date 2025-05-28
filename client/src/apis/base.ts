const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export class BaseApi {
    private static refreshPromise: Promise<string | null> | null = null;

    protected async handleTokenRefresh(): Promise<string | null> {
        try {
            if (BaseApi.refreshPromise) {
                return await BaseApi.refreshPromise;
            }

            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                this.clearTokens();
                return null;
            }

            BaseApi.refreshPromise = (async () => {
                try {
                    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ refreshToken })
                    });

                    if (!response.ok) {
                        this.clearTokens();
                        return null;
                    }

                    const data = await response.json();
                    const newToken = data?.data?.accessToken;
                    
                    if (!newToken) {
                        this.clearTokens();
                        return null;
                    }

                    localStorage.setItem('accessToken', newToken);
                    return newToken;
                } catch (error) {
                    this.clearTokens();
                    return null;
                }
            })();

            return await BaseApi.refreshPromise;
        } finally {
            BaseApi.refreshPromise = null;
        }
    }

    private clearTokens() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }

    protected async get<T>(path: string, params: Record<string, any> = {}): Promise<T> {
        const url = new URL(`${API_BASE_URL}${path}`);
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, String(value));
            }
        });

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: await this.getHeaders(),
        });

        if (!response.ok) {
            if (response.status === 401) {
                const token = await this.handleTokenRefresh();
                if (token) {
                    // Retry with new token
                    return this.get<T>(path, params);
                }
            }
            throw new Error(await this.handleError(response));
        }

        return response.json();
    }

    protected async post<T>(path: string, data?: any): Promise<T> {
        const response = await fetch(`${API_BASE_URL}${path}`, {
            method: 'POST',
            headers: await this.getHeaders(),
            body: data ? JSON.stringify(data) : undefined
        });

        if (!response.ok) {
            if (response.status === 401) {
                const token = await this.handleTokenRefresh();
                if (token) {
                    // Retry with new token
                    return this.post<T>(path, data);
                }
            }
            throw new Error(await this.handleError(response));
        }

        return response.json();
    }

    protected async put<T>(path: string, data: any): Promise<T> {
        const response = await fetch(`${API_BASE_URL}${path}`, {
            method: 'PUT',
            headers: await this.getHeaders(),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            if (response.status === 401) {
                const token = await this.handleTokenRefresh();
                if (token) {
                    // Retry with new token
                    return this.put<T>(path, data);
                }
            }
            throw new Error(await this.handleError(response));
        }

        return response.json();
    }

    protected async patch<T>(path: string, data: any): Promise<T> {
        const response = await fetch(`${API_BASE_URL}${path}`, {
            method: 'PATCH',
            headers: await this.getHeaders(),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            if (response.status === 401) {
                const token = await this.handleTokenRefresh();
                if (token) {
                    // Retry with new token
                    return this.patch<T>(path, data);
                }
            }
            throw new Error(await this.handleError(response));
        }

        return response.json();
    }

    protected async delete<T = void>(path: string): Promise<T> {
        const response = await fetch(`${API_BASE_URL}${path}`, {
            method: 'DELETE',
            headers: await this.getHeaders()
        });

        if (!response.ok) {
            if (response.status === 401) {
                const token = await this.handleTokenRefresh();
                if (token) {
                    // Retry with new token
                    return this.delete<T>(path);
                }
            }
            throw new Error(await this.handleError(response));
        }

        return response.json();
    }

    protected async getHeaders(): Promise<HeadersInit> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json'
        };

        const token = localStorage.getItem('accessToken');
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        return headers;
    }

    protected async handleError(response: Response): Promise<string> {
        if (response.status === 401) {
            const token = await this.handleTokenRefresh();
            if (!token) {
                localStorage.removeItem('accessToken');
                return 'Authentication token expired. Please log in again.';
            }
            return 'Please try again.'; // Token was refreshed
        }

        const data = await response.json().catch(() => ({}));
        return data.message || 'An error occurred';
    }
}

export const handleApiError = (error: unknown): Error => {
    if (error instanceof Error) {
        return error;
    }
    return new Error('An unexpected error occurred');
}