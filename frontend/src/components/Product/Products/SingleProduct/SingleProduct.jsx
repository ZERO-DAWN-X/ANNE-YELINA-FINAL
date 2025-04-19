import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { fixImageUrl } from '../../../../utils/api';

export const SingleProduct = ({
  product,
  onAddToWish,
  onAddToCart,
  addedInCart,
  inWishlist,
  viewMode = 'grid'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const { name, oldPrice, price, image, isSale, isNew, id, description } = product;

  // Format image URL
  const imageUrl = fixImageUrl(image);

  // Navigate to product details
  const navigateToProduct = (e) => {
    // Don't navigate if clicking on action buttons
    if (e.target.closest('.action-button')) {
      return;
    }
    router.push(`/product/${id}`);
  };

  // Card styles with refined action buttons
  const styles = {
    gridItem: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: 'white',
      overflow: 'hidden',
      boxShadow: isHovered ? '0 15px 30px rgba(0,0,0,0.08)' : '0 2px 8px rgba(0,0,0,0.04)',
      transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
      position: 'relative',
      cursor: 'pointer',
      transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
    },
    listItem: {
      display: 'flex',
      width: '100%',
      height: '100%',
      background: 'white',
      overflow: 'hidden',
      boxShadow: isHovered ? '0 15px 30px rgba(0,0,0,0.08)' : '0 2px 8px rgba(0,0,0,0.04)',
      transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
      position: 'relative',
      cursor: 'pointer',
      transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
    },
    imageContainer: {
      position: 'relative',
      overflow: 'hidden',
      flexShrink: 0,
      backgroundColor: '#f8f8f8',
    },
    gridImageWrapper: {
      paddingBottom: '100%',
      position: 'relative'
    },
    listImageWrapper: {
      width: '240px',
      height: '240px'
    },
    image: {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.7s cubic-bezier(0.165, 0.84, 0.44, 1)',
      transform: isHovered ? 'scale(1.08)' : 'scale(1)',
    },
    productInfo: {
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      flex: '1',
      justifyContent: 'space-between',
      position: 'relative',
      zIndex: 1,
      background: 'white',
    },
    badgeContainer: {
      position: 'absolute',
      top: '10px',
      left: '10px',
      display: 'flex',
      gap: '6px',
      zIndex: 2
    },
    badge: {
      padding: '4px 10px',
      fontSize: '11px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    saleTag: {
      background: '#ff5c00',
      color: 'white'
    },
    newTag: {
      background: '#00c896',
      color: 'white'
    },
    category: {
      fontSize: '12px',
      color: '#999',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '8px',
      fontWeight: '500'
    },
    productName: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#333',
      marginBottom: '6px',
      display: 'block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: '2',
      WebkitBoxOrient: 'vertical',
      transition: 'color 0.2s ease',
      lineHeight: '1.4',
    },
    productDesc: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '12px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: '2',
      WebkitBoxOrient: 'vertical',
      lineHeight: '1.4',
    },
    priceContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginTop: '8px',
    },
    oldPrice: {
      textDecoration: 'line-through',
      color: '#999',
      fontSize: '14px',
    },
    price: {
      color: '#d05278',
      fontWeight: '600',
      fontSize: '16px',
    },
    actionContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginTop: '12px',
      position: 'relative',
      opacity: isHovered ? 1 : 0.85,
      transition: 'opacity 0.3s ease',
    },
    actionButton: {
      height: '36px',
      background: '#f5f5f5',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    cartButton: {
      flex: '1',
      gap: '6px',
      color: addedInCart ? 'white' : '#666',
      background: addedInCart ? '#00c896' : '#f5f5f5',
      fontSize: '13px',
      fontWeight: '500',
    },
    wishButton: {
      width: '36px',
      color: inWishlist ? '#d05278' : '#666',
      background: inWishlist ? '#fdf1f6' : '#f5f5f5',
    },
    quickView: {
      position: 'absolute',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '8px 16px',
      background: 'rgba(255,255,255,0.9)',
      color: '#333',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      zIndex: 5,
      opacity: 0,
      transition: 'all 0.3s ease',
      border: 'none',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
    }
  };

  return (
    <div 
      style={viewMode === 'grid' ? styles.gridItem : styles.listItem}
      className={`product-card ${viewMode === 'grid' ? 'grid-card' : 'list-card'}`}
      onClick={navigateToProduct}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image section */}
      <div 
        style={{
          ...styles.imageContainer,
          ...(viewMode === 'grid' ? styles.gridImageWrapper : styles.listImageWrapper)
        }}
        className="product-image-container"
      >
        {/* Product tags */}
        <div style={styles.badgeContainer}>
          {isSale && <span style={{...styles.badge, ...styles.saleTag}}>Sale</span>}
          {isNew && <span style={{...styles.badge, ...styles.newTag}}>New</span>}
        </div>
        
        {/* Product image */}
        <img 
          src={imageUrl} 
          alt={name} 
          style={styles.image} 
          className="product-image"
          onError={(e) => {
            // Fallback if image fails to load
            e.target.onerror = null;
            e.target.src = '/assets/img/product-img1.jpg';
          }}
        />
        
        <button className="quick-view">Quick View</button>
      </div>
      
      {/* Product info */}
      <div style={styles.productInfo}>
        <div>
          {product.category && (
            <div style={styles.category}>{product.category}</div>
          )}
          
          <h3 style={styles.productName}>
            {name}
          </h3>
          
          {viewMode === 'list' && description && (
            <p style={styles.productDesc}>
              {description}
            </p>
          )}
          
          <div style={styles.priceContainer}>
            {oldPrice && (
              <span style={styles.oldPrice}>${oldPrice}</span>
            )}
            <span style={styles.price}>${price}</span>
          </div>
        </div>
        
        <div style={styles.actionContainer}>
          <button
            style={{
              ...styles.actionButton,
              ...styles.cartButton,
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (!addedInCart) onAddToCart(id);
            }}
            disabled={addedInCart}
            aria-label={addedInCart ? "Added to cart" : "Add to cart"}
            className="action-button cart-button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {addedInCart ? "Added" : "Add to Cart"}
          </button>
          
          <button 
            style={{
              ...styles.actionButton,
              ...styles.wishButton,
            }}
            onClick={(e) => {
              e.stopPropagation();
              onAddToWish(id);
            }}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            className="action-button wish-button"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={inWishlist ? "#d05278" : "none"} stroke={inWishlist ? "#d05278" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>
      </div>
      
      {/* CSS animations and transitions */}
      <style jsx>{`
        .product-card {
          will-change: transform, box-shadow;
          position: relative;
        }
        
        .product-card:after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(0deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0) 20%);
          z-index: 0;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .product-card:hover:after {
          opacity: 1;
        }
        
        .product-image-container {
          position: relative;
          overflow: hidden;
        }
        
        .product-image-container:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.15) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 1;
        }
        
        .product-card:hover .product-image-container:before {
          opacity: 1;
        }
        
        .quick-view {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%) translateY(20px);
          padding: 8px 16px;
          background: rgba(255,255,255,0.9);
          color: #333;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          border: none;
          cursor: pointer;
          z-index: 5;
          opacity: 0;
          transition: all 0.3s ease;
          white-space: nowrap;
        }
        
        .product-card:hover .quick-view {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
        
        .product-card:hover .product-name {
          color: #d05278;
        }
        
        .action-button {
          position: relative;
          overflow: hidden;
        }
        
        .action-button:before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: rgba(255,255,255,0.1);
          transition: all 0.3s ease;
        }
        
        .action-button:hover:before {
          left: 100%;
        }
        
        .action-button:hover {
          transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
          .product-card:hover {
            transform: none !important;
          }
          
          .product-card:hover .product-image {
            transform: none !important;
          }
          
          .quick-view {
            display: none;
          }
        }
        
        @media (max-width: 576px) {
          .list-card {
            flex-direction: column;
          }
          
          .list-card .product-image-container {
            width: 100% !important;
            height: auto !important;
          }
        }
      `}</style>
    </div>
  );
};
