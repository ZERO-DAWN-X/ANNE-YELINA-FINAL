import axios from 'axios';

// Create an Axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add request interceptor to attach auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    if (response.data && response.data.image) {
      // Transform image URLs in responses
      const transformImageUrl = (url) => {
        if (!url) return url;
        if (url.startsWith('blob:')) return null;
        if (url.startsWith('/uploads/')) {
          return `${process.env.NEXT_PUBLIC_UPLOAD_URL}${url.substring(8)}`;
        }
        if (url.startsWith('http')) return url;
        return `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${url}`;
      };

      response.data.image = transformImageUrl(response.data.image);
      if (response.data.imageGallery) {
        response.data.imageGallery = response.data.imageGallery.map(transformImageUrl);
      }
    }
    return response;
  },
  (error) => {
    // Handle common errors like 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login if unauthorized
      localStorage.removeItem('token');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api; 