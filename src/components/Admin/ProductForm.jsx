import { useEffect, useState } from 'react';

export const ProductForm = () => {
  const handleImageUpload = async (file) => {
    try {
      console.log('Debug - Starting image upload');
      console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
      
      const formData = new FormData();
      formData.append('image', file);

      // Get the auth token from localStorage or your auth context
      const token = localStorage.getItem('token'); // or use your auth context
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}` // Add the auth token
        },
        body: formData
      });

      console.log('Debug - Upload response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Debug - Upload error:', errorData);
        throw new Error(errorData.message || 'Upload failed');
      }

      const data = await response.json();
      console.log('Debug - Upload success:', data);
      return data.url; // Return the uploaded image URL
    } catch (error) {
      console.error('Debug - Upload error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Upload main image first
      let mainImageUrl = product.image;
      if (product.image && product.image.startsWith('blob:')) {
        const file = await fetch(product.image).then(r => r.blob());
        mainImageUrl = await handleImageUpload(file);
      }

      // Upload gallery images
      const galleryUrls = await Promise.all(
        product.imageGallery.map(async (img) => {
          if (img.startsWith('blob:')) {
            const file = await fetch(img).then(r => r.blob());
            return handleImageUpload(file);
          }
          return img;
        })
      );

      // Submit the product with processed image URLs
      const productData = {
        ...product,
        image: mainImageUrl,
        imageGallery: galleryUrls
      };

      console.log('Debug - Submitting product data:', productData);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add auth token
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        throw new Error('Failed to save product');
      }

      // Handle success
      router.push('/admin/products');
    } catch (error) {
      console.error('Debug - Submit error:', error);
      setError(error.message);
    }
  };

  // ... rest of your component
}; 