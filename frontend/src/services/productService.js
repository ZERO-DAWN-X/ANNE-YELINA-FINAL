import api from '../utils/api';

export const getProducts = async (filters = {}) => {
  try {
    const response = await api.get('/api/products', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProduct = async (id) => {
  try {
    const response = await api.get(`/api/products/${id}`);
    const data = response.data;
    
    return {
      ...data,
      // Ensure category and brand are strings
      category: typeof data.category === 'object' ? data.category.name : data.category,
      brand: typeof data.brand === 'object' ? data.brand.name : data.brand,
      reviews: data.reviews || [],
      // Keep the full objects if needed
      categoryData: data.categoryData,
      brandData: data.brandData
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const getProductsByCategory = async (categorySlug) => {
  const response = await api.get(`/api/products/category/${categorySlug}`);
  return response.data;
};

export const getProductsByBrand = async (brandSlug) => {
  const response = await api.get(`/api/products/brand/${brandSlug}`);
  return response.data;
};

export const getNewArrivals = async () => {
  const response = await api.get('/api/products/new-arrivals');
  return response.data;
};

export const getSaleProducts = async () => {
  const response = await api.get('/api/products/sale');
  return response.data;
};

// Add specific methods for trending and new products
export const getTrendingProducts = async () => {
  try {
    const response = await api.get('/api/products', {
      params: { isSale: true }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching trending products:', error);
    throw error;
  }
};

export const getNewArrivalsProducts = async () => {
  try {
    const response = await api.get('/api/products', {
      params: { isNew: true }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    throw error;
  }
}; 