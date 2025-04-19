import api from '../utils/api';

const transformProductData = (product) => {
  if (!product) return null;
  
  return {
    ...product,
    image: product.image ? (
      product.image.startsWith('blob:') 
        ? null 
        : product.image.startsWith('/uploads/') 
          ? `${process.env.NEXT_PUBLIC_UPLOAD_URL}${product.image.substring(8)}`
          : `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${product.image}`
    ) : null,
    imageGallery: Array.isArray(product.imageGallery) 
      ? product.imageGallery.map(img => 
          img.startsWith('/uploads/') 
            ? `${process.env.NEXT_PUBLIC_UPLOAD_URL}${img.substring(8)}`
            : `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${img}`
        )
      : []
  };
};

export const getProducts = async (filters = {}) => {
  try {
    const response = await api.get('/api/products', { params: filters });
    return response.data.map(transformProductData);
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProduct = async (id) => {
  try {
    const response = await api.get(`/api/products/${id}`);
    return transformProductData(response.data);
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