import { useCart } from 'context/CartContext';
import socialData from 'data/social';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { getProduct } from 'services/productService';
import { ProductsCarousel } from '../Products/ProductsCarousel';
import { useWishlist } from 'context/WishlistContext';
import { fixImageUrl } from '../../../utils/api';

export const ProductDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const { cart, addToCart, isItemInCart } = useCart();
  const { toggleWishlistItem, isItemInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedInCart, setAddedInCart] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedColor, setSelectedColor] = useState(0);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const socialLinks = [...socialData];

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await getProduct(id);
        
        // Process any image URLs
        if (data.image) {
          data.image = fixImageUrl(data.image);
        }
        
        // Process image gallery if it exists
        if (data.imageGallery && Array.isArray(data.imageGallery)) {
          data.imageGallery = data.imageGallery.map(img => {
            return typeof img === 'string' ? fixImageUrl(img) : img;
          });
        }
        
        setProduct(data);
        setReviews(data.reviews || []);
        setRelatedProducts(data.relatedProducts || []);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.response?.data?.message || 'Failed to load product details');
        
        // Redirect to 404 page if product not found
        if (err.response?.status === 404) {
          router.push('/404');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, router]);

  // Check if product is in cart
  useEffect(() => {
    if (product && product.id) {
      setAddedInCart(Boolean(cart?.find((item) => item.id === product.id)));
    }
  }, [product, cart]);

  const handleAddToCart = () => {
    if (product && product.id) {
      addToCart({
        ...product,
        quantity,
        selectedColor: product.colors ? product.colors[selectedColor] : null
      });
    }
  };

  const handleWishlist = () => {
    if (product && product.id && toggleWishlistItem) {
      toggleWishlistItem(product.id);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleColorSelect = (index) => {
    setSelectedColor(index);
  };

  // Gallery slider settings
  const gallerySettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2,
        }
      }
    ]
  };

  // Fix for the wishlist button styling - add null check for product
  const wishlistButtonStyle = {
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: product && isItemInWishlist && isItemInWishlist(product.id) ? '#fdf1f6' : '#f5f5f5',
    color: product && isItemInWishlist && isItemInWishlist(product.id) ? '#d05278' : '#666',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  // Define styles for the entire component
  const styles = {
    productContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
    },
    breadcrumbs: {
      display: 'flex',
      gap: '8px',
      marginBottom: '32px',
      fontSize: '14px',
      color: '#888',
    },
    breadcrumbLink: {
      color: '#888',
      textDecoration: 'none',
      transition: 'color 0.2s ease',
    },
    productGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '40px',
      marginBottom: '60px',
    },
    imageColumn: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    mainImage: {
      width: '100%',
      height: 'auto',
      aspectRatio: '1/1',
      objectFit: 'cover',
      backgroundColor: '#f8f8f8',
    },
    thumbnailContainer: {
      display: 'flex',
      gap: '12px',
      marginTop: '16px',
    },
    thumbnail: {
      width: '80px',
      height: '80px',
      objectFit: 'cover',
      cursor: 'pointer',
      border: '1px solid #eee',
      transition: 'border-color 0.2s ease',
    },
    thumbnailActive: {
      borderColor: '#d05278',
    },
    infoColumn: {
      display: 'flex',
      flexDirection: 'column',
    },
    productCategory: {
      fontSize: '14px',
      textTransform: 'uppercase',
      color: '#888',
      marginBottom: '8px',
      letterSpacing: '1px',
    },
    productName: {
      fontSize: '28px',
      fontWeight: '600',
      color: '#333',
      marginBottom: '16px',
      lineHeight: '1.3',
    },
    pricingContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '20px',
    },
    currentPrice: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#d05278',
    },
    oldPrice: {
      fontSize: '18px',
      color: '#999',
      textDecoration: 'line-through',
    },
    shortDescription: {
      fontSize: '15px',
      lineHeight: '1.6',
      color: '#666',
      marginBottom: '24px',
    },
    divider: {
      height: '1px',
      background: '#eee',
      margin: '20px 0',
      width: '100%',
    },
    optionsContainer: {
      marginBottom: '24px',
    },
    optionTitle: {
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '12px',
      color: '#333',
    },
    colorsContainer: {
      display: 'flex',
      gap: '10px',
      marginBottom: '24px',
    },
    colorOption: {
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      cursor: 'pointer',
      border: '2px solid transparent',
      transition: 'all 0.2s ease',
    },
    colorOptionSelected: {
      boxShadow: '0 0 0 2px #fff, 0 0 0 4px #d05278',
    },
    quantityContainer: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '24px',
    },
    quantityButton: {
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f5f5',
      border: 'none',
      fontSize: '18px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    quantityInput: {
      width: '60px',
      height: '40px',
      border: '1px solid #eee',
      textAlign: 'center',
      fontSize: '16px',
      margin: '0 8px',
    },
    actionsContainer: {
      display: 'flex',
      gap: '12px',
      marginBottom: '24px',
    },
    addToCartButton: {
      flex: '1',
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      background: addedInCart ? '#00c896' : '#d05278',
      color: 'white',
      border: 'none',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    wishlistButton: wishlistButtonStyle,
    productMeta: {
      marginTop: '20px',
    },
    metaItem: {
      display: 'flex',
      gap: '8px',
      fontSize: '14px',
      marginBottom: '8px',
      color: '#666',
    },
    metaLabel: {
      fontWeight: '600',
      color: '#333',
    },
    detailsSection: {
      marginBottom: '60px',
    },
    sectionTitle: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#333',
      marginBottom: '30px',
      textAlign: 'center',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '400px',
    },
    spinner: {
      width: '50px',
      height: '50px',
      border: '4px solid rgba(208, 82, 120, 0.2)',
      borderRadius: '50%',
      borderTop: '4px solid #d05278',
      animation: 'spin 1s linear infinite',
    },
    errorContainer: {
      padding: '40px',
      textAlign: 'center',
      color: '#e53935',
      background: '#ffebee',
    },
    tabContent: {
      padding: '20px 0',
      fontSize: '15px',
      lineHeight: '1.7',
      color: '#666',
    },
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <h3>Error Loading Product</h3>
        <p>{error}</p>
        <button 
          onClick={() => router.push('/shop')}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            background: '#333',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Return to Shop
        </button>
      </div>
    );
  }

  if (!product) {
    return <div className="not-found">Product not found</div>;
  }

  const {
    name,
    image,
    imageGallery = [],
    description,
    content,
    price,
    oldPrice,
    colors = [],
    category,
    brand,
    categoryData,
    brandData,
    productNumber,
    isStocked = true,
  } = product;

  // Combine main image with gallery for slider
  const allImages = [image, ...(imageGallery || [])].filter(Boolean);

  return (
    <div style={styles.productContainer}>
      {/* Breadcrumbs */}
      <div style={styles.breadcrumbs}>
        <a href="/" style={styles.breadcrumbLink}>Home</a>
        <span>/</span>
        <a href="/shop" style={styles.breadcrumbLink}>Shop</a>
        <span>/</span>
        <span>{name}</span>
      </div>

      {/* Product Grid */}
      <div 
        style={styles.productGrid}
        className="product-details-grid"
      >
        {/* Left Column - Images */}
        <div style={styles.imageColumn}>
          <img 
            src={allImages[mainImageIndex]} 
            alt={name} 
            style={styles.mainImage}
            className="product-main-image"
          />
          
          <div style={styles.thumbnailContainer}>
            {allImages.slice(0, 5).map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${name} thumbnail ${index + 1}`}
                style={{
                  ...styles.thumbnail,
                  ...(mainImageIndex === index ? styles.thumbnailActive : {})
                }}
                onClick={() => setMainImageIndex(index)}
                className={`product-thumbnail ${mainImageIndex === index ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>

        {/* Right Column - Product Info */}
        <div style={styles.infoColumn}>
          {typeof category === 'string' && (
            <div style={styles.productCategory}>{category}</div>
          )}
          <h1 style={styles.productName}>{name}</h1>
          
          <div style={styles.pricingContainer}>
            <span style={styles.currentPrice}>${price}</span>
            {oldPrice && <span style={styles.oldPrice}>${oldPrice}</span>}
          </div>

          <p style={styles.shortDescription}>{description}</p>
          
          <div style={styles.divider}></div>
          
          {/* Color Options */}
          {colors.length > 0 && (
            <div style={styles.optionsContainer}>
              <div style={styles.optionTitle}>Color</div>
              <div style={styles.colorsContainer}>
                {colors.map((color, index) => (
                  <div
                    key={index}
                    style={{
                      ...styles.colorOption,
                      backgroundColor: color,
                      ...(selectedColor === index ? styles.colorOptionSelected : {})
                    }}
                    onClick={() => handleColorSelect(index)}
                    className={`color-option ${selectedColor === index ? 'selected' : ''}`}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Quantity Selector */}
          <div style={styles.optionTitle}>Quantity</div>
          <div style={styles.quantityContainer}>
            <button 
              style={styles.quantityButton}
              onClick={decrementQuantity}
              disabled={quantity <= 1}
              className="quantity-button"
            >
              –
            </button>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              style={styles.quantityInput}
              className="quantity-input"
            />
            <button 
              style={styles.quantityButton}
              onClick={incrementQuantity}
              className="quantity-button"
            >
              +
            </button>
          </div>
          
          {/* Action Buttons */}
          <div style={styles.actionsContainer}>
            <button
              style={styles.addToCartButton}
              onClick={handleAddToCart}
              disabled={addedInCart || !isStocked}
              className="add-to-cart-button"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {addedInCart ? 'Added to Cart' : isStocked ? 'Add to Cart' : 'Out of Stock'}
            </button>
            
            <button
              style={styles.wishlistButton}
              onClick={handleWishlist}
              className="wishlist-button"
            >
              <svg 
                width="22" 
                height="22" 
                viewBox="0 0 24 24" 
                fill={product && isItemInWishlist && isItemInWishlist(product.id) ? "#d05278" : "none"} 
                stroke={product && isItemInWishlist && isItemInWishlist(product.id) ? "#d05278" : "currentColor"} 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>
          
          {/* Stock status */}
          <div style={{
            marginTop: '16px',
            color: isStocked ? '#00c896' : '#e53935',
            fontWeight: '500',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: isStocked ? '#00c896' : '#e53935',
              display: 'inline-block'
            }}></span>
            {isStocked ? 'In Stock' : 'Out of Stock'}
          </div>

          {/* Product Meta */}
          <div style={styles.productMeta}>
            {productNumber && (
              <div style={styles.metaItem}>
                <span style={styles.metaLabel}>SKU:</span>
                <span>{productNumber}</span>
              </div>
            )}

            {category && (
              <div style={styles.metaItem}>
                <span style={styles.metaLabel}>Category:</span>
                <span>{typeof category === 'object' ? category.name : category}</span>
              </div>
            )}
            
            {brand && (
              <div style={styles.metaItem}>
                <span style={styles.metaLabel}>Brand:</span>
                <span>{typeof brand === 'object' ? brand.name : brand}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Details Tabs - Simplified to only show Description */}
      <div style={styles.detailsSection}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#333',
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: '1px solid #eee'
        }}>
          Product Description
        </h3>
        
        <div style={styles.tabContent}>
          <div className="tab-description">
            <p style={{
              fontSize: '15px',
              lineHeight: '1.7',
              color: '#666',
            }}>
              {content || description}
            </p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div style={{marginTop: '60px'}}>
          <h3 style={styles.sectionTitle}>Related Products</h3>
          <ProductsCarousel products={relatedProducts} />
        </div>
      )}
      
      {/* Responsive styles */}
      <style jsx global>{`
        @media (max-width: 992px) {
          .product-details-grid {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }
          
          .quantity-button {
            width: 36px !important;
            height: 36px !important;
          }
          
          .quantity-input {
            width: 50px !important;
            height: 36px !important;
          }
        }
        
        @media (max-width: 576px) {
          .product-thumbnail {
            width: 60px !important;
            height: 60px !important;
          }
          
          .product-main-image {
            aspect-ratio: auto !important;
            height: 300px !important;
          }
        }
        
        .add-to-cart-button:hover,
        .wishlist-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        .quantity-button:hover {
          background-color: #eee;
        }
      `}</style>
    </div>
  );
};
