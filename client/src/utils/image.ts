import { handleApiError } from '../apis/base'

const API_BASE_URL = 'http://localhost:3000'

export async function uploadImage(file: File, accessToken: string, type?: string): Promise<string> {
  if (!accessToken) {
    throw new Error('No authentication token available. Please log in.')
  }

  const formData = new FormData()
  formData.append('file', file)
  if (type) {
    formData.append('type', type)
  }

  try {
    const response = await fetch(`${API_BASE_URL}/image/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      body: formData
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication token expired. Please log in again.')
      }
      if (response.status === 429) {
        throw new Error('Server is busy. Please try again in a few moments.')
      }
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to upload image')
    }

    const result = await response.json();
    let imageUrl: string | undefined;

    if (result && typeof result.url === 'string') {
        imageUrl = result.url;
    } else if (result && typeof result.link === 'string') {
        imageUrl = result.link;
    } else if (result && result.data) { 
        if (typeof result.data === 'string') {
            imageUrl = result.data; 
        } else if (typeof result.data.url === 'string') {
            imageUrl = result.data.url; 
        } else if (typeof result.data.link === 'string') {
            imageUrl = result.data.link; 
        }
    } else if (typeof result === 'string') { 
        imageUrl = result;
    }

    // Check if imageUrl was successfully extracted and is a non-empty string
    if (!imageUrl) { 
        throw new Error(`Invalid response format from image upload. Could not extract URL. Received: ${JSON.stringify(result)}`);
    }

    return imageUrl
  } catch (error) {
    console.error('Image upload error:', error)
    throw error
  }
}