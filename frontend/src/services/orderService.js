import api from './api';

export const createOrder = async (orderData) => {
  try {
    // Create FormData for file upload
    const formData = new FormData();
    
    // Add payment proof file
    formData.append('paymentProof', orderData.paymentProof);
    
    // Add other order data
    formData.append('items', JSON.stringify(orderData.items));
    formData.append('shippingInfo', JSON.stringify(orderData.shippingInfo));
    formData.append('totalAmount', orderData.totalAmount);

    const response = await api.post('/orders', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Create order error:', error);
    throw error;
  }
}; 