import api, { fixImageUrl } from '../utils/api';

export const getProducts = async (filters = {}) => {
  try {
    const response = await api.get('/api/products', { params: filters });
    
    // Process image URLs in the response
    const products = response.data.map(product => ({
      ...product,
      image: fixImageUrl(product.image),
      // Also handle image gallery if present
      imageGallery: Array.isArray(product.imageGallery) 
        ? product.imageGallery.map(img => typeof img === 'string' ? fixImageUrl(img) : img)
        : product.imageGallery
    }));
    
    return products;
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
      // Fix image URLs
      image: fixImageUrl(data.image),
      imageGallery: Array.isArray(data.imageGallery) 
        ? data.imageGallery.map(img => typeof img === 'string' ? fixImageUrl(img) : img)
        : data.imageGallery,
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
  try {
    const response = await api.get(`/api/products/category/${categorySlug}`);
    
    // Process image URLs in the response
    const products = response.data.map(product => ({
      ...product,
      image: fixImageUrl(product.image),
      imageGallery: Array.isArray(product.imageGallery) 
        ? product.imageGallery.map(img => typeof img === 'string' ? fixImageUrl(img) : img)
        : product.imageGallery
    }));
    
    return products;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};

export const getProductsByBrand = async (brandSlug) => {
  try {
    const response = await api.get(`/api/products/brand/${brandSlug}`);
    
    // Process image URLs in the response
    const products = response.data.map(product => ({
      ...product,
      image: fixImageUrl(product.image),
      imageGallery: Array.isArray(product.imageGallery) 
        ? product.imageGallery.map(img => typeof img === 'string' ? fixImageUrl(img) : img)
        : product.imageGallery
    }));
    
    return products;
  } catch (error) {
    console.error('Error fetching products by brand:', error);
    throw error;
  }
};

export const getNewArrivals = async () => {
  try {
    const response = await api.get('/api/products/new-arrivals');
    
    // Process image URLs in the response
    const products = response.data.map(product => ({
      ...product,
      image: fixImageUrl(product.image),
      imageGallery: Array.isArray(product.imageGallery) 
        ? product.imageGallery.map(img => typeof img === 'string' ? fixImageUrl(img) : img)
        : product.imageGallery
    }));
    
    return products;
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    throw error;
  }
};

export const getSaleProducts = async () => {
  try {
    const response = await api.get('/api/products/sale');
    
    // Process image URLs in the response
    const products = response.data.map(product => ({
      ...product,
      image: fixImageUrl(product.image),
      imageGallery: Array.isArray(product.imageGallery) 
        ? product.imageGallery.map(img => typeof img === 'string' ? fixImageUrl(img) : img)
        : product.imageGallery
    }));
    
    return products;
  } catch (error) {
    console.error('Error fetching sale products:', error);
    throw error;
  }
};

// Add specific methods for trending and new products
export const getTrendingProducts = async () => {
  try {
    const response = await api.get('/api/products', {
      params: { isSale: true }
    });
    
    // Process image URLs in the response
    const products = response.data.map(product => ({
      ...product,
      image: fixImageUrl(product.image),
      imageGallery: Array.isArray(product.imageGallery) 
        ? product.imageGallery.map(img => typeof img === 'string' ? fixImageUrl(img) : img)
        : product.imageGallery
    }));
    
    return products;
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
    
    // Process image URLs in the response
    const products = response.data.map(product => ({
      ...product,
      image: fixImageUrl(product.image),
      imageGallery: Array.isArray(product.imageGallery) 
        ? product.imageGallery.map(img => typeof img === 'string' ? fixImageUrl(img) : img)
        : product.imageGallery
    }));
    
    return products;
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    throw error;
  }
}; 