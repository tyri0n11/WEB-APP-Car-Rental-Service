// This utility function checks if the access token is present and not expired
export function checkTokenValidity() {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.log('No access token found in localStorage');
      return false;
    }

    // Split the token to get the payload part (second part)
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.log('Token has invalid format');
      return false;
    }

    // Decode the payload
    const payload = JSON.parse(atob(parts[1]));
    
    // Check expiration (exp is in seconds)
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      console.log('Token is expired', {
        expiration: new Date(payload.exp * 1000).toLocaleString(),
        now: new Date().toLocaleString()
      });
      return false;
    }

    console.log('Token is valid', {
      userId: payload.userId,
      expiration: payload.exp ? new Date(payload.exp * 1000).toLocaleString() : 'No expiration',
    });
    
    return true;
  } catch (error) {
    console.error('Error checking token validity:', error);
    return false;
  }
}
