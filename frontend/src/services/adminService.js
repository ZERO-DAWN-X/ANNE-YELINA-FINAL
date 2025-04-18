import api from './api';
import axios from 'axios';

// Users Management
export const getUsers = async () => {
  try {
    const response = await api.get('/admin/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Products
export const getProducts = async () => {
  try {
    const response = await api.get('/admin/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProduct = async (id) => {
  const response = await api.get(`/admin/products/${id}`);
  return response.data;
};

export const createProduct = async (productData) => {
  try {
    const response = await api.post('/admin/products', productData);
    return response.data;
  } catch (error) {
    console.error('Create product API error:', error.response?.data || error);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  const response = await api.put(`/admin/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/admin/products/${id}`);
  return response.data;
};

export const getOrders = async () => {
  const response = await api.get('/admin/orders');
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await api.patch(`/admin/orders/${orderId}/status`, { status });
  return response.data;
};

// Dashboard Statistics
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

// Recent Activity
export const getRecentActivity = async () => {
  try {
    const response = await api.get('/admin/dashboard/activity');
    return response.data;
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    throw error;
  }
};

// User Orders
export const getUserOrders = async (userId) => {
  try {
    const response = await api.get(`/admin/users/${userId}/orders`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

export const getCategories = async () => {
  const response = await api.get('/admin/categories');
  return response.data;
};

export const getBrands = async () => {
  const response = await api.get('/admin/brands');
  return response.data;
};

export const createCategory = async (categoryData) => {
  try {
    const formData = new FormData();
    formData.append('name', categoryData.name);
    formData.append('slug', categoryData.slug);
    
    if (categoryData.image) {
      formData.append('image', categoryData.image);
    }

    const response = await api.post('/admin/categories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Create category error:', error);
    throw error;
  }
};

export const createBrand = async (brandData) => {
  const response = await api.post('/admin/brands', brandData);
  return response.data;
};

export const deleteCategory = async (categoryId) => {
  const response = await api.delete(`/admin/categories/${categoryId}`);
  return response.data;
};

export const deleteBrand = async (brandId) => {
  const response = await api.delete(`/admin/brands/${brandId}`);
  return response.data;
};

export const updateCategory = async (categoryId, categoryData) => {
  try {
    const response = await api.put(`/admin/categories/${categoryId}`, categoryData);
    return response.data;
  } catch (error) {
    console.error('Update category error:', error);
    throw error;
  }
};

export const updateBrand = async (brandId, brandData) => {
  const response = await api.put(`/admin/brands/${brandId}`, brandData);
  return response.data;
}; 