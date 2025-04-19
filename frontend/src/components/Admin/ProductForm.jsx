import React, { useState, useEffect } from "react";
import { X, Save, Image, Plus, Trash2, Check, Repeat } from "lucide-react";

const spinKeyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    overflow: "hidden",
  },
  modal: {
    position: "relative",
    background: "white",
    borderRadius: "16px",
    width: "100%",
    height: "100%",
    maxHeight: "100vh",
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    position: "sticky",
    top: 0,
    background: "white",
    padding: "20px 24px",
    borderBottom: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  content: {
    padding: "24px",
    flex: 1,
    overflow: "auto",
  },
  footer: {
    position: "sticky",
    bottom: 0,
    background: "white",
    padding: "16px 24px",
    borderTop: "1px solid #eee",
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    zIndex: 10,
  },
  formGroup: {
    marginBottom: "24px",
  },
  input: {
    width: "100%",
    height: "42px",
    padding: "0 12px",
    border: "1.5px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "0.9rem",
  },
  deleteButton: {
    width: "42px",
    height: "42px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    background: "#fee2e2",
    color: "#ef4444",
    borderRadius: "8px",
    cursor: "pointer",
  },
  addButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px",
    background: "#f5f7fa",
    border: "1px dashed #cad1dc",
    borderRadius: "8px",
    color: "#667085",
    cursor: "pointer",
    justifyContent: "center",
    height: "42px",
  },
  imageSection: {
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '32px',
  },
  imageUploadMain: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '32px',
    padding: '24px',
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px dashed #e2e8f0',
  },
  imagePreviewContainer: {
    position: 'relative',
    width: '200px',
    height: '200px',
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px dashed #cbd5e1',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  uploadButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 20px',
    backgroundColor: 'white',
    border: '2px dashed #d05278',
    borderRadius: '8px',
    color: '#d05278',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '0.9rem',
    fontWeight: '500',
    width: 'fit-content',
  },
  galleryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '16px',
    marginTop: '16px',
  },
  galleryItem: {
    position: 'relative',
    aspectRatio: '1',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#f1f5f9',
    border: '1px solid #e2e8f0',
  },
  removeButton: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#ef4444',
    transition: 'all 0.2s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  addGalleryButton: {
    aspectRatio: '1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    backgroundColor: 'white',
    border: '2px dashed #e2e8f0',
    borderRadius: '8px',
    color: '#64748b',
    cursor: 'pointer',
    transition: 'all 0.2s',
  }
};

const mediaStyles = `
  @media (max-width: 768px) {
    .form-grid {
      grid-template-columns: 1fr !important;
    }
    
    .form-row {
      flex-direction: column;
    }
    
    .modal-content {
      padding: 16px;
    }
    
    .modal-header h2 {
      font-size: 1.25rem;
    }
    
    .form-footer {
      flex-direction: column-reverse;
      gap: 12px;
    }
    
    .form-footer button {
      width: 100%;
    }
  }
`;

const ProductForm = ({
  product,
  onSubmit,
  onCancel,
  isLoading,
  categoryList,
  brandList,
}) => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    oldPrice: "",
    category: "",
    brand: "",
    description: "",
    content: "",
    image: "",
    imageGallery: [""],
    filterItems: [],
    colors: [],
    isNew: false,
    isSale: false,
    isStocked: true,
    productNumber: "",
  });

  // Initialize form with product data if editing
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        price: product.price || "",
        oldPrice: product.oldPrice || "",
        category: product.category || "",
        brand: product.brand || "",
        description: product.description || "",
        content: product.content || "",
        image: product.image || "",
        imageGallery: Array.isArray(product.imageGallery)
          ? [...product.imageGallery]
          : [""],
        filterItems: Array.isArray(product.filterItems)
          ? [...product.filterItems]
          : [],
        colors: Array.isArray(product.colors) ? [...product.colors] : [],
        isNew: product.isNew || false,
        isSale: product.isSale || false,
        isStocked: product.isStocked !== undefined ? product.isStocked : true,
        productNumber: product.productNumber || "",
      });
    }
  }, [product]);

  // Load categories and brands from props
  useEffect(() => {
    if (categoryList && categoryList.length > 0) {
      setCategories(categoryList);
    }

    if (brandList && brandList.length > 0) {
      setBrands(brandList);
    }
  }, [categoryList, brandList]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    console.log(e.target);
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   setFormData(prev => ({
  //     ...prev,
  //     [name]: type === 'checkbox' ? checked : value
  //   }));
  // };

  const handleImageUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/upload`, {
        method: 'POST',
        credentials: 'include', // Important for auth
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      // Return the full URL
      return `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${data.filename}`;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const changeImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Create temporary preview
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        image: previewUrl
      }));

      // Handle image upload
      const imageUrl = await handleImageUpload(file);

      // Update form data
      setFormData(prev => ({
        ...prev,
        image: imageUrl
      }));
      
      // Cleanup preview URL
      URL.revokeObjectURL(previewUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      // Keep the preview URL if upload fails
    }
  };

  const toggleCheckbox = (name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleGalleryChange = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const previewUrl = URL.createObjectURL(file);
      const updatedGallery = [...formData.imageGallery];
      updatedGallery[index] = previewUrl;
      setFormData(prev => ({
        ...prev,
        imageGallery: updatedGallery
      }));

      const uploadData = new FormData();
      uploadData.append('image', file);

      // Fix the API endpoint URL
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/upload`, {
        method: 'POST',
        body: uploadData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();

      if (data.success && data.url) {
        const finalGallery = [...formData.imageGallery];
        finalGallery[index] = data.url;
        setFormData(prev => ({
          ...prev,
          imageGallery: finalGallery
        }));
        
        URL.revokeObjectURL(previewUrl);
      }
    } catch (error) {
      console.error('Error uploading gallery image:', error);
    }
  };

  const addGalleryImage = () => {
    setFormData((prev) => ({
      ...prev,
      imageGallery: [...prev.imageGallery, ""],
    }));
  };

  const removeGalleryImage = (index) => {
    const updatedGallery = [...formData.imageGallery];
    updatedGallery.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      imageGallery: updatedGallery.length > 0 ? updatedGallery : [""],
    }));
  };

  const handleColorChange = (index, value) => {
    const updatedColors = [...formData.colors];
    updatedColors[index] = value;
    setFormData((prev) => ({
      ...prev,
      colors: updatedColors,
    }));
  };

  const addColor = () => {
    setFormData((prev) => ({
      ...prev,
      colors: [...prev.colors, "#FFFFFF"],
    }));
  };

  const removeColor = (index) => {
    const updatedColors = [...formData.colors];
    updatedColors.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      colors: updatedColors,
    }));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    onSubmit(formData);
  };

  // Update the ImagePreview component
  const ImagePreview = ({ src, onRemove }) => {
    if (!src) return null;

    return (
      <div style={modalStyles.imagePreviewContainer}>
        <img
          src={src}
          alt="Preview"
          style={{
            ...modalStyles.imagePreview,
            objectFit: 'cover',
            width: '100%',
            height: '100%'
          }}
        />
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            style={modalStyles.removeButton}
          >
            <X size={16} />
          </button>
        )}
      </div>
    );
  };

  // Update the gallery image rendering
  const renderGalleryImage = (url, index) => {
    return (
      <div key={index} style={modalStyles.galleryItem}>
        {url ? (
          <>
            <img
              src={typeof url === 'string' ? url : URL.createObjectURL(url)}
              alt={`Gallery ${index + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            <button
              type="button"
              onClick={() => removeGalleryImage(index)}
              style={{
                ...modalStyles.removeButton,
                opacity: 0.9,
                '&:hover': {
                  opacity: 1,
                  backgroundColor: 'rgba(255, 255, 255, 1)'
                }
              }}
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <label style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            color: '#94a3b8',
            '&:hover': {
              backgroundColor: '#f8fafc'
            }
          }}>
            <input
              type="file"
              onChange={(e) => handleGalleryChange(index, e)}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <Image size={24} />
            <span style={{ fontSize: '0.8rem' }}>Upload</span>
          </label>
        )}
      </div>
    );
  };

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <div style={modalStyles.header}>
          <h2
            style={{
              fontSize: "1.5rem",
              color: "#333",
              margin: 0,
              fontWeight: "600",
            }}
          >
            {product ? "Edit Product" : "Add New Product"}
          </h2>
        </div>

        <div style={modalStyles.content}>
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <label
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#555",
                  }}
                >
                  Product Name*
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter product name"
                  style={{
                    height: "42px",
                    padding: "0 12px",
                    border: "1.5px solid #e0e0e0",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                  }}
                />
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <label
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#555",
                  }}
                >
                  Product Number
                </label>
                <input
                  type="text"
                  name="productNumber"
                  value={formData.productNumber}
                  onChange={handleChange}
                  placeholder="e.g. SKU123"
                  style={{
                    height: "42px",
                    padding: "0 12px",
                    border: "1.5px solid #e0e0e0",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "20px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <label
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#555",
                  }}
                >
                  Price*
                </label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  placeholder="29.99"
                  style={{
                    height: "42px",
                    padding: "0 12px",
                    border: "1.5px solid #e0e0e0",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                  }}
                />
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <label
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#555",
                  }}
                >
                  Old Price (Optional)
                </label>
                <input
                  type="text"
                  name="oldPrice"
                  value={formData.oldPrice}
                  onChange={handleChange}
                  placeholder="39.99"
                  style={{
                    height: "42px",
                    padding: "0 12px",
                    border: "1.5px solid #e0e0e0",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "20px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <label
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#555",
                  }}
                >
                  Category*
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  style={{
                    height: "42px",
                    padding: "0 12px",
                    border: "1.5px solid #e0e0e0",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    background: "white",
                  }}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <label
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#555",
                  }}
                >
                  Brand*
                </label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                  style={{
                    height: "42px",
                    padding: "0 12px",
                    border: "1.5px solid #e0e0e0",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    background: "white",
                  }}
                >
                  <option value="">Select Brand</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.slug}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Images Section */}
            <div style={modalStyles.imageSection}>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: '#334155',
                marginBottom: '20px'
              }}>
                Product Images
              </h3>

              {/* Main Image Upload */}
              <div style={modalStyles.imageUploadMain}>
                <label style={{
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  color: '#64748b',
                  marginBottom: '8px'
                }}>
                  Main Product Image
                </label>
                
                <div style={{
                  display: 'flex',
                  gap: '24px',
                  alignItems: 'flex-start'
                }}>
                  {formData.image ? (
                    <ImagePreview 
                      src={formData.image}
                      onRemove={() => setFormData(prev => ({ ...prev, image: '' }))}
                    />
                  ) : (
                    <div style={modalStyles.imagePreviewContainer}>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#94a3b8'
                      }}>
                        <Image size={32} />
                        <span>No image selected</span>
                      </div>
                    </div>
                  )}
                  
                  <label style={modalStyles.uploadButton}>
                    <input
                      type="file"
                      onChange={changeImage}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                    <Image size={18} />
                    {formData.image ? 'Change Image' : 'Upload Image'}
                  </label>
                </div>
              </div>

              {/* Gallery Images */}
              <div>
                <label style={{
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  color: '#64748b',
                  marginBottom: '12px',
                  display: 'block'
                }}>
                  Gallery Images
                </label>
                
                <div style={modalStyles.galleryGrid}>
                  {formData.imageGallery.map((url, index) => renderGalleryImage(url, index))}
                  
                  <button
                    type="button"
                    onClick={addGalleryImage}
                    style={{
                      ...modalStyles.addGalleryButton,
                      '&:hover': {
                        backgroundColor: '#f8fafc',
                        borderColor: '#d05278'
                      }
                    }}
                  >
                    <Plus size={24} />
                    <span style={{ fontSize: '0.8rem' }}>Add Image</span>
                  </button>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#555",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Product Colors
              </label>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px",
                  alignItems: "center",
                }}
              >
                {formData.colors.map((color, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      background: "#f9fafb",
                      padding: "6px",
                      borderRadius: "8px",
                    }}
                  >
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => handleColorChange(index, e.target.value)}
                      style={{
                        width: "36px",
                        height: "36px",
                        padding: "0",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeColor(index)}
                      style={{
                        width: "30px",
                        height: "30px",
                        padding: 0,
                        border: "none",
                        background: "#fee2e2",
                        color: "#ef4444",
                        borderRadius: "6px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addColor}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 12px",
                    background: "#f5f7fa",
                    border: "1px dashed #cad1dc",
                    borderRadius: "8px",
                    color: "#667085",
                    cursor: "pointer",
                    height: "36px",
                  }}
                >
                  <Plus size={14} />
                  Add Color
                </button>
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#555",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Short Description*
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="3"
                placeholder="Brief product description"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1.5px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  resize: "vertical",
                  minHeight: "80px",
                }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#555",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Detailed Content*
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows="5"
                placeholder="Detailed product information"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1.5px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  resize: "vertical",
                  minHeight: "120px",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "16px",
                marginBottom: "24px",
                flexWrap: "wrap",
              }}
            >
              <div
                onClick={() => toggleCheckbox("isNew")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  userSelect: "none",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #eee",
                  backgroundColor: formData.isNew ? "#fdf2f8" : "#fff",
                  transition: "all 0.2s ease",
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "4px",
                    border: formData.isNew
                      ? "1px solid #d05278"
                      : "1px solid #d1d5db",
                    backgroundColor: formData.isNew ? "#d05278" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                  }}
                >
                  {formData.isNew && <Check size={14} color="white" />}
                </div>
                <span
                  style={{
                    fontSize: "0.9rem",
                    color: formData.isNew ? "#d05278" : "#555",
                    fontWeight: formData.isNew ? "500" : "normal",
                  }}
                >
                  Mark as New
                </span>
              </div>

              <div
                onClick={() => toggleCheckbox("isSale")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  userSelect: "none",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #eee",
                  backgroundColor: formData.isSale ? "#fdf2f8" : "#fff",
                  transition: "all 0.2s ease",
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "4px",
                    border: formData.isSale
                      ? "1px solid #d05278"
                      : "1px solid #d1d5db",
                    backgroundColor: formData.isSale
                      ? "#d05278"
                      : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                  }}
                >
                  {formData.isSale && <Check size={14} color="white" />}
                </div>
                <span
                  style={{
                    fontSize: "0.9rem",
                    color: formData.isSale ? "#d05278" : "#555",
                    fontWeight: formData.isSale ? "500" : "normal",
                  }}
                >
                  On Sale
                </span>
              </div>

              <div
                onClick={() => toggleCheckbox("isStocked")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  userSelect: "none",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #eee",
                  backgroundColor: formData.isStocked ? "#fdf2f8" : "#fff",
                  transition: "all 0.2s ease",
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "4px",
                    border: formData.isStocked
                      ? "1px solid #d05278"
                      : "1px solid #d1d5db",
                    backgroundColor: formData.isStocked
                      ? "#d05278"
                      : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                  }}
                >
                  {formData.isStocked && <Check size={14} color="white" />}
                </div>
                <span
                  style={{
                    fontSize: "0.9rem",
                    color: formData.isStocked ? "#d05278" : "#555",
                    fontWeight: formData.isStocked ? "500" : "normal",
                  }}
                >
                  In Stock
                </span>
              </div>
            </div>
          </form>
        </div>

        <div style={modalStyles.footer}>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            style={{
              padding: "0 20px",
              height: "44px",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              background: "white",
              color: "#555",
              fontSize: "0.95rem",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            style={{
              padding: "0 24px",
              height: "44px",
              border: "none",
              borderRadius: "8px",
              background: "#d05278",
              color: "white",
              fontSize: "0.95rem",
              fontWeight: "500",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.2s",
              minWidth: "140px",
            }}
          >
            {isLoading ? (
              <>
                <div
                  style={{
                    width: "18px",
                    height: "18px",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTop: "2px solid white",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
                {product ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <Save size={18} />
                {product ? "Update" : "Create"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;

<style>
  {spinKeyframes}
  {mediaStyles}
</style>;
