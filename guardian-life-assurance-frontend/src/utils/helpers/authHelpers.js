export const getAuthToken = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }
    return token;
  };