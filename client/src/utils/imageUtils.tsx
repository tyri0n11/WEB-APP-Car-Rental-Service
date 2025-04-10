import React from 'react';

// Base URL for API requests
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Uploads an image file to the server and returns the URL
export const uploadImage = async (
  file: File,
  accessToken: string,
  type?: string
): Promise<string> => {
  if (!accessToken) {
    throw new Error('No authentication token available. Please log in.');
  }

  const formData = new FormData();
  formData.append('file', file);
  if (type) {
    formData.append('type', type);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/image/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication token expired. Please log in again.');
      }
      if (response.status === 429) {
        throw new Error('Server is busy. Please try again in a few moments.');
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload image');
    }

    const result = await response.json();
    const imageUrl = result?.data?.link || result?.data?.imageUrl || result?.imageUrl || result?.url;

    if (!imageUrl) {
      throw new Error('Invalid response format from image upload');
    }

    return imageUrl;
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
};

// Validates an image file before upload (size and type)
export const validateImage = (file: File): string | null => {
  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return 'File is too large! Maximum size is 5MB.';
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return 'Unsupported file type! Allowed types: JPEG, PNG, GIF.';
  }

  return null;
};

// Component for displaying an image with a fallback option
export const ImageWithFallback: React.FC<{
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
}> = ({ src, alt, fallbackSrc, className }) => {
  const [imgSrc, setImgSrc] = React.useState(src);

  React.useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (fallbackSrc) {
          setImgSrc(fallbackSrc);
        }
      }}
    />
  );
}; 