import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2,
  AlertCircle,
  Save,
  Tag,
  Briefcase
} from 'lucide-react';
import { 
  getCategories, 
  getBrands, 
  createCategory, 
  createBrand, 
  deleteCategory, 
  deleteBrand,
  updateCategory,
  updateBrand
} from 'services/adminService';
import { upload } from 'services/uploadService';

const CategoryBrandManager = ({ show, onClose, onCategoriesUpdate, onBrandsUpdate }) => {
  const [activeTab, setActiveTab] = useState('categories');
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newBrand, setNewBrand] = useState({ name: '', slug: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editingBrand, setEditingBrand] = useState(null);
  const [editBrandName, setEditBrandName] = useState('');
  const [editBrandSlug, setEditBrandSlug] = useState('');
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editCategoryImage, setEditCategoryImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);

  useEffect(() => {
    if (show) {
      fetchData();
    }
  }, [show]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [categoriesData, brandsData] = await Promise.all([
        getCategories(),
        getBrands()
      ]);
      
      // Log categories data to check images
      console.log('Fetched categories with images:', 
        categoriesData.map(cat => ({
          id: cat.id,
          name: cat.name,
          image: cat.image
        }))
      );
      
      setCategories(categoriesData);
      setBrands(brandsData);
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error('Error fetching categories/brands:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      
      const categoryData = { 
        name: newCategory,
        slug: newCategory.toLowerCase().replace(/\s+/g, '-')
      };
      
      const result = await createCategory(categoryData);
      setCategories([...categories, result]);
      setNewCategory('');
      setSuccess('Category added successfully');
      
      // Notify parent component
      onCategoriesUpdate && onCategoriesUpdate([...categories, result]);
    } catch (err) {
      setError('Failed to add category. Please try again.');
      console.error('Error adding category:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBrand = async (e) => {
    e.preventDefault();
    if (!newBrand.name.trim()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      
      // If slug is empty, generate from name
      if (!newBrand.slug.trim()) {
        newBrand.slug = newBrand.name.toLowerCase().replace(/\s+/g, '');
      }
      
      const result = await createBrand(newBrand);
      setBrands([...brands, result]);
      setNewBrand({ name: '', slug: '' });
      setSuccess('Brand added successfully');
      
      // Notify parent component
      onBrandsUpdate && onBrandsUpdate([...brands, result]);
    } catch (err) {
      setError('Failed to add brand. Please try again.');
      console.error('Error adding brand:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!confirm('Are you sure you want to delete this category? Products in this category will not be deleted but will need to be reassigned.')) return;
    
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      
      await deleteCategory(categoryId);
      const updatedCategories = categories.filter(cat => cat.id !== categoryId);
      setCategories(updatedCategories);
      setSuccess('Category deleted successfully');
      
      // Notify parent component
      onCategoriesUpdate && onCategoriesUpdate(updatedCategories);
    } catch (err) {
      setError('Failed to delete category. It may be in use by existing products.');
      console.error('Error deleting category:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBrand = async (brandId) => {
    if (!confirm('Are you sure you want to delete this brand? Products with this brand will not be deleted but will need to be reassigned.')) return;
    
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      
      await deleteBrand(brandId);
      const updatedBrands = brands.filter(brand => brand.id !== brandId);
      setBrands(updatedBrands);
      setSuccess('Brand deleted successfully');
      
      // Notify parent component
      onBrandsUpdate && onBrandsUpdate(updatedBrands);
    } catch (err) {
      setError('Failed to delete brand. It may be in use by existing products.');
      console.error('Error deleting brand:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const startEditingCategory = (category) => {
    setEditingCategory(category.id);
    setEditCategoryName(category.name);
    
    // Set the image preview if category has an image
    if (category.image) {
      const fullImageUrl = category.image.startsWith('http') 
        ? category.image 
        : `${process.env.NEXT_PUBLIC_API_URL}${category.image}`;
      
      console.log('Setting edit image preview:', fullImageUrl);
      setEditImagePreview(fullImageUrl);
    } else {
      setEditImagePreview(null);
    }
    setEditCategoryImage(null);
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editCategoryName.trim()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      
      // Keep existing image URL if no new image was uploaded
      let imageUrl = editImagePreview;
      
      // Only upload if there's a new image file
      if (editCategoryImage) {
        try {
          const formData = new FormData();
          formData.append('image', editCategoryImage);
          
          const uploadResponse = await upload(formData);
          imageUrl = uploadResponse.url.startsWith('http') 
            ? uploadResponse.url 
            : `${process.env.NEXT_PUBLIC_API_URL}${uploadResponse.url}`;
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          setError('Image upload failed. Category not updated.');
          setIsLoading(false);
          return;
        }
      }
      
      const categoryData = { 
        name: editCategoryName,
        slug: editCategoryName.toLowerCase().replace(/\s+/g, '-'),
        image: imageUrl || null // Ensure image is always defined, even if null
      };
      
      console.log('Updating category with data:', categoryData);
      
      const result = await updateCategory(editingCategory, categoryData);
      
      // Update the categories state with the updated category
      setCategories(prevCategories => 
        prevCategories.map(cat => cat.id === editingCategory ? result : cat)
      );
      
      setSuccess('Category updated successfully');
      setEditingCategory(null);
      setEditCategoryImage(null);
      setEditImagePreview(null);
      
      // Notify parent component
      onCategoriesUpdate && onCategoriesUpdate(
        categories.map(cat => cat.id === editingCategory ? result : cat)
      );
    } catch (err) {
      console.error('Error updating category:', err);
      setError('Failed to update category. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEditing = () => {
    if (editImagePreview && editCategoryImage) {
      URL.revokeObjectURL(editImagePreview);
    }
    setEditingCategory(null);
    setEditCategoryName('');
    setEditCategoryImage(null);
    setEditImagePreview(null);
  };

  const startEditingBrand = (brand) => {
    setEditingBrand(brand.id);
    setEditBrandName(brand.name);
    setEditBrandSlug(brand.slug);
  };

  const handleUpdateBrand = async (e) => {
    e.preventDefault();
    if (!editBrandName.trim()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      
      // If slug is empty, generate from name
      const slug = editBrandSlug.trim() || editBrandName.toLowerCase().replace(/\s+/g, '');
      
      const brandData = { 
        name: editBrandName,
        slug
      };
      
      const result = await updateBrand(editingBrand, brandData);
      
      // Update the brands state with the updated brand
      setBrands(prevBrands => 
        prevBrands.map(b => b.id === editingBrand ? result : b)
      );
      
      setSuccess('Brand updated successfully');
      setEditingBrand(null);
      
      // Notify parent component
      onBrandsUpdate && onBrandsUpdate(
        brands.map(b => b.id === editingBrand ? result : b)
      );
    } catch (err) {
      setError('Failed to update brand. Please try again.');
      console.error('Error updating brand:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEditingBrand = () => {
    setEditingBrand(null);
    setEditBrandName('');
    setEditBrandSlug('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setCategoryForm(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const categoryData = {
        name: categoryForm.name,
        slug: categoryForm.slug,
        image: categoryForm.image // Pass the actual File object
      };

      const result = await createCategory(categoryData);
      
      // Reset form
      setCategoryForm({ name: '', slug: '', image: null });
      setImagePreview(null);
      
      // Update categories state with the new category
      setCategories(prevCategories => [...prevCategories, result]);
      
      // Notify parent component
      onCategoriesUpdate && onCategoriesUpdate([...categories, result]);
      
      setSuccess('Category added successfully');
    } catch (error) {
      console.error('Error creating category:', error);
      setError('Failed to create category. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Revoke previous preview URL if it exists
      if (editImagePreview) {
        URL.revokeObjectURL(editImagePreview);
      }
      
      const previewUrl = URL.createObjectURL(file);
      console.log('New image selected, setting preview:', previewUrl); // Debug log
      setEditImagePreview(previewUrl);
      setEditCategoryImage(file);
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content category-brand-manager">
        <div className="modal-header">
          <h2>{activeTab === 'categories' ? 'Manage Categories' : 'Manage Brands'}</h2>
          <button 
            className="modal-close-btn" 
            onClick={onClose}
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-tabs">
          <button 
            className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <Tag size={16} />
            Categories
          </button>
          <button 
            className={`tab-btn ${activeTab === 'brands' ? 'active' : ''}`}
            onClick={() => setActiveTab('brands')}
          >
            <Briefcase size={16} />
            Brands
          </button>
        </div>
        
        {error && (
          <div className="modal-alert error">
            <AlertCircle size={16} />
            {error}
          </div>
        )}
        
        {success && (
          <div className="modal-alert success">
            <AlertCircle size={16} />
            {success}
          </div>
        )}
        
        <div className="modal-body">
          {isLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading...</p>
            </div>
          ) : (
            <>
              {activeTab === 'categories' ? (
                <div className="categories-section">
                  <form onSubmit={handleCategorySubmit} className="add-form" style={{
                    backgroundColor: '#f9fafb',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    border: '1px solid #eaecef'
                  }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '15px',
                      marginBottom: '15px',
                    }}>
                      <div>
                        <label style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#444'
                        }}>Category Name</label>
                        <input
                          type="text"
                          placeholder="Enter category name"
                          value={categoryForm.name}
                          onChange={(e) => setCategoryForm(prev => ({
                            ...prev,
                            name: e.target.value,
                            slug: e.target.value.toLowerCase().replace(/\s+/g, '-')
                          }))}
                          disabled={isLoading || uploading}
                          style={{
                            width: '100%',
                            height: '42px',
                            padding: '0 12px',
                            border: '1.5px solid #e0e0e0',
                            borderRadius: '8px',
                            fontSize: '14px'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#444'
                        }}>Slug</label>
                        <input
                          type="text"
                          placeholder="category-slug"
                          value={categoryForm.slug}
                          onChange={(e) => setCategoryForm(prev => ({
                            ...prev,
                            slug: e.target.value
                          }))}
                          disabled={isLoading || uploading}
                          style={{
                            width: '100%',
                            height: '42px',
                            padding: '0 12px',
                            border: '1.5px solid #e0e0e0',
                            borderRadius: '8px',
                            fontSize: '14px'
                          }}
                        />
                        <small style={{
                          display: 'block',
                          marginTop: '4px',
                          fontSize: '12px',
                          color: '#888'
                        }}>Auto-generated from name (can be edited)</small>
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#444'
                        }}>Category Image</label>
                        <div style={{
                          position: 'relative',
                          marginBottom: '15px',
                        }}>
                          <input
                            type="file"
                            id="category-image"
                            accept="image/*"
                            onChange={handleImageChange}
                            disabled={isLoading || uploading}
                            style={{ display: 'none' }}
                          />
                          <label
                            htmlFor="category-image"
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              height: '160px',
                              border: '2px dashed #e0e0e0',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              transition: 'all 0.3s',
                              backgroundColor: '#f9f9f9',
                              position: 'relative',
                              overflow: 'hidden'
                            }}
                          >
                            {imagePreview ? (
                              <>
                                <img
                                  src={imagePreview}
                                  alt="Category preview"
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0
                                  }}
                                />
                                <div style={{
                                  position: 'absolute',
                                  bottom: 0,
                                  left: 0,
                                  right: 0,
                                  padding: '8px',
                                  textAlign: 'center',
                                  backgroundColor: 'rgba(0,0,0,0.6)',
                                  color: 'white',
                                  fontSize: '14px'
                                }}>
                                  Change Image
                                </div>
                              </>
                            ) : (
                              <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '8px',
                                color: '#666'
                              }}>
                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                  <polyline points="21 15 16 10 5 21"></polyline>
                                </svg>
                                <span style={{ fontSize: '14px' }}>Upload Category Image</span>
                                <span style={{ fontSize: '12px', color: '#888' }}>Click to browse or drop image here</span>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      style={{
                        width: '100%',
                        height: '42px',
                        backgroundColor: '#4a7bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '500',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                        opacity: (isLoading || !categoryForm.name.trim() || uploading) ? '0.7' : '1'
                      }}
                      disabled={isLoading || !categoryForm.name.trim() || uploading}
                    >
                      {uploading ? (
                        <>
                          <div style={{
                            width: '16px',
                            height: '16px',
                            border: '2px solid rgba(255,255,255,0.3)',
                            borderTop: '2px solid white',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                          }}></div>
                          <span>Creating...</span>
                        </>
                      ) : (
                        <>
                          <Plus size={16} />
                          <span>Add Category</span>
                        </>
                      )}
                    </button>
                  </form>
                  
                  <div className="items-list" style={{
                    maxHeight: '400px',
                    overflow: 'auto',
                    marginTop: '20px'
                  }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      marginBottom: '12px',
                      color: '#333'
                    }}>Existing Categories</h3>
                    
                    {categories.length === 0 ? (
                      <p style={{
                        textAlign: 'center',
                        padding: '20px',
                        background: '#f8f9fa',
                        borderRadius: '8px',
                        color: '#6c757d'
                      }}>No categories found.</p>
                    ) : (
                      <ul style={{
                        listStyle: 'none',
                        padding: '0',
                        margin: '0',
                        border: '1px solid #eaecef',
                        borderRadius: '8px'
                      }}>
                        {categories.map(category => (
                          <li key={category.id} style={{
                            display: 'flex',
                            padding: '12px 16px',
                            borderBottom: '1px solid #eaecef',
                            transition: 'background-color 0.2s',
                            backgroundColor: editingCategory === category.id ? '#f7f9fc' : 'white'
                          }}>
                            {editingCategory === category.id ? (
                              // Edit mode
                              <form onSubmit={handleUpdateCategory} style={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%',
                                gap: '12px'
                              }}>
                                <div style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '12px'
                                }}>
                                  <div>
                                    <label style={{
                                      display: 'block',
                                      marginBottom: '4px',
                                      fontSize: '12px',
                                      color: '#555'
                                    }}>Category Name</label>
                                    <input
                                      type="text"
                                      value={editCategoryName}
                                      onChange={(e) => setEditCategoryName(e.target.value)}
                                      autoFocus
                                      style={{
                                        width: '100%',
                                        height: '36px',
                                        padding: '0 10px',
                                        border: '1.5px solid #4a7bff',
                                        borderRadius: '6px',
                                        fontSize: '14px'
                                      }}
                                    />
                                  </div>
                                  
                                  <div>
                                    <label style={{
                                      display: 'block',
                                      marginBottom: '4px',
                                      fontSize: '12px',
                                      color: '#555'
                                    }}>Category Image</label>
                                    <div style={{
                                      position: 'relative',
                                      height: '100px',
                                      border: '1.5px dashed #e0e0e0',
                                      borderRadius: '6px',
                                      overflow: 'hidden',
                                      backgroundColor: '#f9f9f9',
                                    }}>
                                      <input
                                        type="file"
                                        id={`edit-category-image-${editingCategory}`}
                                        accept="image/*"
                                        onChange={handleEditImageChange}
                                        style={{ display: 'none' }}
                                      />
                                      <label
                                        htmlFor={`edit-category-image-${editingCategory}`}
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          width: '100%',
                                          height: '100%',
                                          cursor: 'pointer',
                                          position: 'relative'
                                        }}
                                      >
                                        {editImagePreview ? (
                                          <>
                                            <img
                                              src={editImagePreview}
                                              alt="Category preview"
                                              style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0
                                              }}
                                            />
                                            <div style={{
                                              position: 'absolute',
                                              bottom: 0,
                                              left: 0,
                                              right: 0,
                                              padding: '6px',
                                              textAlign: 'center',
                                              backgroundColor: 'rgba(0,0,0,0.6)',
                                              color: 'white',
                                              fontSize: '12px'
                                            }}>
                                              Change Image
                                            </div>
                                          </>
                                        ) : (
                                          <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            color: '#666'
                                          }}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                              <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                              <polyline points="21 15 16 10 5 21"></polyline>
                                            </svg>
                                            <span style={{ fontSize: '12px' }}>Upload Image</span>
                                          </div>
                                        )}
                                      </label>
                                    </div>
                                  </div>
                                </div>
                                
                                <div style={{
                                  display: 'flex',
                                  gap: '6px',
                                  justifyContent: 'flex-end',
                                  marginTop: '8px'
                                }}>
                                  <button 
                                    type="submit" 
                                    disabled={!editCategoryName.trim() || isLoading}
                                    style={{
                                      backgroundColor: '#4a7bff',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '6px',
                                      padding: '0 12px',
                                      height: '36px',
                                      fontSize: '14px',
                                      fontWeight: '500',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      cursor: 'pointer',
                                      transition: 'background-color 0.2s',
                                      opacity: (!editCategoryName.trim() || isLoading) ? '0.7' : '1'
                                    }}
                                  >
                                    <Save size={16} style={{ marginRight: '4px' }} />
                                    Save
                                  </button>
                                  <button 
                                    type="button" 
                                    onClick={cancelEditing}
                                    disabled={isLoading}
                                    style={{
                                      backgroundColor: '#f1f3f5',
                                      color: '#495057',
                                      border: 'none',
                                      borderRadius: '6px',
                                      padding: '0 12px',
                                      height: '36px',
                                      fontSize: '14px',
                                      fontWeight: '500',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      cursor: 'pointer',
                                      transition: 'background-color 0.2s'
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            ) : (
                              // View mode
                              <>
                                <div style={{
                                  flex: '1',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px'
                                }}>
                                  {category.image && (
                                    <div style={{
                                      width: '40px',
                                      height: '40px',
                                      borderRadius: '4px',
                                      overflow: 'hidden',
                                      border: '1px solid #eee'
                                    }}>
                                      <img 
                                        src={category.image.startsWith('http') ? 
                                          category.image : 
                                          `${process.env.NEXT_PUBLIC_API_URL}${category.image}`}
                                        alt={category.name}
                                        style={{
                                          width: '100%',
                                          height: '100%',
                                          objectFit: 'cover'
                                        }}
                                        onError={(e) => {
                                          console.error(`Failed to load image: ${category.image}`);
                                          e.target.src = 'https://via.placeholder.com/40?text=Error';
                                        }}
                                      />
                                    </div>
                                  )}
                                  <div style={{
                                    display: 'flex',
                                    flexDirection: 'column'
                                  }}>
                                    <span style={{
                                      fontWeight: '500',
                                      color: '#333',
                                      fontSize: '15px'
                                    }}>{category.name}</span>
                                    <span style={{
                                      fontSize: '13px',
                                      color: '#6c757d'
                                    }}>ID: {category.slug}</span>
                                  </div>
                                </div>
                                
                                <div style={{
                                  display: 'flex',
                                  gap: '8px',
                                  alignItems: 'center'
                                }}>
                                  <button 
                                    onClick={() => startEditingCategory(category)}
                                    disabled={isLoading || editingCategory !== null}
                                    style={{
                                      backgroundColor: 'transparent',
                                      color: '#4a7bff',
                                      border: '1px solid #4a7bff',
                                      borderRadius: '6px',
                                      width: '32px',
                                      height: '32px',
                                      padding: '0',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s',
                                      opacity: (isLoading || editingCategory !== null) ? '0.5' : '1'
                                    }}
                                  >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                  </button>
                                  
                                  <button 
                                    onClick={() => handleDeleteCategory(category.id)}
                                    disabled={isLoading || editingCategory !== null}
                                    style={{
                                      backgroundColor: 'transparent',
                                      color: '#ef4444',
                                      border: '1px solid #ef4444',
                                      borderRadius: '6px',
                                      width: '32px',
                                      height: '32px',
                                      padding: '0',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s',
                                      opacity: (isLoading || editingCategory !== null) ? '0.5' : '1'
                                    }}
                                  >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="3 6 5 6 21 6"></polyline>
                                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                      <line x1="10" y1="11" x2="10" y2="17"></line>
                                      <line x1="14" y1="11" x2="14" y2="17"></line>
                                    </svg>
                                  </button>
                                </div>
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ) : (
                <div className="brands-section">
                  <form onSubmit={handleAddBrand} className="add-form" style={{
                    backgroundColor: '#f9fafb',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    border: '1px solid #eaecef'
                  }}>
                    <div style={{
                      display: 'flex',
                      gap: '15px',
                      marginBottom: '15px',
                      flexWrap: 'wrap'
                    }}>
                      <div style={{
                        flex: '1',
                        minWidth: '200px'
                      }}>
                        <label style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#444'
                        }}>Brand Name</label>
                        <input
                          type="text"
                          placeholder="Enter brand name"
                          value={newBrand.name}
                          onChange={(e) => setNewBrand({...newBrand, name: e.target.value})}
                          disabled={isLoading}
                          style={{
                            width: '100%',
                            height: '42px',
                            padding: '0 12px',
                            border: '1.5px solid #e0e0e0',
                            borderRadius: '8px',
                            fontSize: '14px'
                          }}
                        />
                      </div>
                      
                      <div style={{
                        flex: '1',
                        minWidth: '200px'
                      }}>
                        <label style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#444'
                        }}>Brand ID (optional)</label>
                        <input
                          type="text"
                          placeholder="brandid (lowercase, no spaces)"
                          value={newBrand.slug}
                          onChange={(e) => setNewBrand({...newBrand, slug: e.target.value})}
                          disabled={isLoading}
                          style={{
                            width: '100%',
                            height: '42px',
                            padding: '0 12px',
                            border: '1.5px solid #e0e0e0',
                            borderRadius: '8px',
                            fontSize: '14px'
                          }}
                        />
                        <small style={{
                          display: 'block',
                          marginTop: '4px',
                          fontSize: '12px',
                          color: '#888'
                        }}>Leave empty to auto-generate from name</small>
                      </div>
                    </div>
                    
                    <button 
                      type="submit" 
                      disabled={isLoading || !newBrand.name.trim()}
                      style={{
                        width: '100%',
                        height: '42px',
                        backgroundColor: '#4a7bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '500',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                        opacity: (isLoading || !newBrand.name.trim()) ? '0.7' : '1'
                      }}
                    >
                      <Plus size={16} />
                      Add Brand
                    </button>
                  </form>
                  
                  <div style={{
                    maxHeight: '400px',
                    overflow: 'auto',
                    marginTop: '20px'
                  }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      marginBottom: '12px',
                      color: '#333'
                    }}>Existing Brands</h3>
                    
                    {brands.length === 0 ? (
                      <p style={{
                        textAlign: 'center',
                        padding: '20px',
                        background: '#f8f9fa',
                        borderRadius: '8px',
                        color: '#6c757d'
                      }}>No brands found.</p>
                    ) : (
                      <ul style={{
                        listStyle: 'none',
                        padding: '0',
                        margin: '0',
                        border: '1px solid #eaecef',
                        borderRadius: '8px'
                      }}>
                        {brands.map(brand => (
                          <li key={brand.id} style={{
                            display: 'flex',
                            padding: '12px 16px',
                            borderBottom: '1px solid #eaecef',
                            transition: 'background-color 0.2s',
                            backgroundColor: editingBrand === brand.id ? '#f7f9fc' : 'white'
                          }}>
                            {editingBrand === brand.id ? (
                              // Edit mode
                              <form onSubmit={handleUpdateBrand} style={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%',
                                gap: '8px'
                              }}>
                                <div style={{
                                  display: 'flex',
                                  gap: '12px',
                                  marginBottom: '8px',
                                  width: '100%',
                                  flexWrap: 'wrap'
                                }}>
                                  <div style={{ flex: '1', minWidth: '200px' }}>
                                    <label style={{
                                      display: 'block',
                                      marginBottom: '4px',
                                      fontSize: '12px',
                                      color: '#555'
                                    }}>Brand Name</label>
                                    <input
                                      type="text"
                                      value={editBrandName}
                                      onChange={(e) => setEditBrandName(e.target.value)}
                                      autoFocus
                                      style={{
                                        width: '100%',
                                        height: '36px',
                                        padding: '0 10px',
                                        border: '1.5px solid #4a7bff',
                                        borderRadius: '6px',
                                        fontSize: '14px'
                                      }}
                                    />
                                  </div>
                                  
                                  <div style={{ flex: '1', minWidth: '200px' }}>
                                    <label style={{
                                      display: 'block',
                                      marginBottom: '4px',
                                      fontSize: '12px',
                                      color: '#555'
                                    }}>Brand ID</label>
                                    <input
                                      type="text"
                                      value={editBrandSlug}
                                      onChange={(e) => setEditBrandSlug(e.target.value)}
                                      placeholder="Leave empty to auto-generate"
                                      style={{
                                        width: '100%',
                                        height: '36px',
                                        padding: '0 10px',
                                        border: '1.5px solid #e0e0e0',
                                        borderRadius: '6px',
                                        fontSize: '14px'
                                      }}
                                    />
                                  </div>
                                </div>
                                
                                <div style={{
                                  display: 'flex',
                                  gap: '8px',
                                  justifyContent: 'flex-end'
                                }}>
                                  <button 
                                    type="submit" 
                                    disabled={!editBrandName.trim() || isLoading}
                                    style={{
                                      backgroundColor: '#4a7bff',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '6px',
                                      padding: '0 12px',
                                      height: '36px',
                                      fontSize: '14px',
                                      fontWeight: '500',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      cursor: 'pointer',
                                      transition: 'background-color 0.2s',
                                      opacity: (!editBrandName.trim() || isLoading) ? '0.7' : '1'
                                    }}
                                  >
                                    Save
                                  </button>
                                  <button 
                                    type="button" 
                                    onClick={cancelEditingBrand}
                                    disabled={isLoading}
                                    style={{
                                      backgroundColor: '#f1f3f5',
                                      color: '#495057',
                                      border: 'none',
                                      borderRadius: '6px',
                                      padding: '0 12px',
                                      height: '36px',
                                      fontSize: '14px',
                                      fontWeight: '500',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      cursor: 'pointer',
                                      transition: 'background-color 0.2s'
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            ) : (
                              // View mode
                              <>
                                <div style={{
                                  flex: '1',
                                  display: 'flex',
                                  flexDirection: 'column'
                                }}>
                                  <span style={{
                                    fontWeight: '500',
                                    color: '#333',
                                    fontSize: '15px'
                                  }}>{brand.name}</span>
                                  <span style={{
                                    fontSize: '13px',
                                    color: '#6c757d'
                                  }}>ID: {brand.slug}</span>
                                </div>
                                
                                <div style={{
                                  display: 'flex',
                                  gap: '8px',
                                  alignItems: 'center'
                                }}>
                                  <button 
                                    onClick={() => startEditingBrand(brand)}
                                    disabled={isLoading || editingBrand !== null}
                                    style={{
                                      backgroundColor: 'transparent',
                                      color: '#4a7bff',
                                      border: '1px solid #4a7bff',
                                      borderRadius: '6px',
                                      width: '32px',
                                      height: '32px',
                                      padding: '0',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s',
                                      opacity: (isLoading || editingBrand !== null) ? '0.5' : '1'
                                    }}
                                  >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                  </button>
                                  
                                  <button 
                                    onClick={() => handleDeleteBrand(brand.id)}
                                    disabled={isLoading || editingBrand !== null}
                                    style={{
                                      backgroundColor: 'transparent',
                                      color: '#ef4444',
                                      border: '1px solid #ef4444',
                                      borderRadius: '6px',
                                      width: '32px',
                                      height: '32px',
                                      padding: '0',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s',
                                      opacity: (isLoading || editingBrand !== null) ? '0.5' : '1'
                                    }}
                                  >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="3 6 5 6 21 6"></polyline>
                                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                      <line x1="10" y1="11" x2="10" y2="17"></line>
                                      <line x1="14" y1="11" x2="14" y2="17"></line>
                                    </svg>
                                  </button>
                                </div>
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="modal-footer">
          <button 
            className="btn-cancel" 
            onClick={onClose}
            disabled={isLoading}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryBrandManager; 