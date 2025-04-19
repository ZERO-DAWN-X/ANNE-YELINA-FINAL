import axios from 'axios';

// Create an Axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to fix image URLs
export const fixImageUrl = (imageUrl) => {
  if (!imageUrl) return '/assets/img/product-img1.jpg'; // Default fallback image
  
  // Handle blob URLs
  if (imageUrl.startsWith('blob:')) {
    // For blob URLs, we need to extract the filename or use a fallback
    // Since blob URLs are temporary, we need to replace with server URLs
    return '/assets/img/product-img1.jpg';
  }
  
  // Handle relative URLs
  if (imageUrl.startsWith('/uploads/')) {
    return `${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`;
  }
  
  // Handle uploads without leading slash
  if (imageUrl.startsWith('uploads/')) {
    return `${process.env.NEXT_PUBLIC_API_URL}/${imageUrl}`;
  }
  
  // If it's a path to a specific image on the server
  if (imageUrl.includes('c-174') || imageUrl.match(/\d{13,}-\d{6,}\.jpg$/)) {
    return `${process.env.NEXT_PUBLIC_API_URL}/uploads/${imageUrl}`;
  }
  
  // If it's already a full URL
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // Default case - assume it's a relative path
  return `${process.env.NEXT_PUBLIC_API_URL}/uploads/${imageUrl}`;
};

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
  (response) => response,
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