export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: any): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return new ApiError(
      error.response.data?.message || 'Server error',
      error.response.status,
      error.response.data
    );
  } else if (error.request) {
    // The request was made but no response was received
    return new ApiError('No response from server', 503);
  } else {
    // Something happened in setting up the request that triggered an Error
    return new ApiError(error.message || 'Request failed', 500);
  }
};

export const isApiError = (error: any): error is ApiError => {
  return error instanceof ApiError;
};
