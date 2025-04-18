import { useState } from 'react';
import { SingleProduct } from './SingleProduct/SingleProduct';
import { useCart } from 'context/CartContext';
import { useWishlist } from 'context/WishlistContext';
import { PagingList } from 'components/shared/PagingList/PagingList';

export const Products = ({ products, paginate }) => {
  const { cart, addToCart } = useCart();
  const { wishlist, toggleWishlistItem } = useWishlist();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Add a function to check if item is in cart
  const isItemInCart = (productId) => {
    return cart && cart.some(item => item.id === productId);
  };

  // Add a function to check if item is in wishlist
  const isItemInWishlist = (productId) => {
    return wishlist && wishlist.includes(productId);
  };

  // Handle adding to cart
  const handleAddToCart = (id) => {
    const product = products.find(p => p.id === id);
    if (product) {
      addToCart({
        ...product,
        quantity: 1
      });
    }
  };

  // Handle adding to wishlist
  const handleAddToWish = (id) => {
    if (typeof toggleWishlistItem === 'function') {
      toggleWishlistItem(id);
    } else {
      console.warn('Wishlist functionality is not available');
    }
  };

  // Styles for responsive grid
  const styles = {
    container: {
      marginBottom: '40px'
    },
    viewControls: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginBottom: '24px',
      gap: '10px'
    },
    viewButton: {
      background: 'transparent',
      border: '1px solid #e0e0e0',
      borderRadius: '6px',
      padding: '8px 10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      color: '#888'
    },
    activeViewButton: {
      background: '#fdf1f6',
      borderColor: '#d05278',
      color: '#d05278'
    },
    noProducts: {
      textAlign: 'center',
      padding: '40px 20px',
      background: '#f9f9f9',
      color: '#666'
    },
    paginationContainer: {
      marginTop: '40px',
      display: 'flex',
      justifyContent: 'center'
    }
  };

  return (
    <div style={styles.container}>
      {/* View mode controls */}
      <div style={styles.viewControls}>
        <button 
          onClick={() => setViewMode('grid')}
          style={{
            ...styles.viewButton,
            ...(viewMode === 'grid' ? styles.activeViewButton : {})
          }}
          aria-label="Grid view"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
            <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
            <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
            <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
        <button 
          onClick={() => setViewMode('list')}
          style={{
            ...styles.viewButton,
            ...(viewMode === 'list' ? styles.activeViewButton : {})
          }}
          aria-label="List view"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 6H21M8 12H21M8 18H21M3 6H3.01M3 12H3.01M3 18H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Products display */}
      {products.length === 0 ? (
        <div style={styles.noProducts}>
          <p>No products found. Try adjusting your filters.</p>
        </div>
      ) : (
        <>
          <div 
            className={viewMode === 'grid' ? 'products-grid' : 'products-list'}
          >
            {products.map((product) => (
              <div 
                key={product.id} 
                className={viewMode === 'list' ? 'list-view-item' : 'grid-view-item'}
                style={viewMode === 'list' ? {
                  display: 'flex',
                  background: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  padding: '0'
                } : {}}
              >
                <SingleProduct
                  product={product}
                  onAddToWish={handleAddToWish}
                  onAddToCart={handleAddToCart}
                  addedInCart={isItemInCart(product.id)}
                  inWishlist={isItemInWishlist(product.id)}
                  viewMode={viewMode}
                />
              </div>
            ))}
          </div>
          
          {paginate && (
            <div style={styles.paginationContainer}>
              <ModernPagination paginate={paginate} />
            </div>
          )}
        </>
      )}

      {/* Responsive styles */}
      <style jsx global>{`
        .products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        
        .products-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        @media (max-width: 1200px) {
          .products-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        
        @media (max-width: 992px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
        }
        
        @media (max-width: 576px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          
          .list-view-item {
            flex-direction: column !important;
          }
          
          .list-view-item .product-image-container {
            width: 100% !important;
            height: 200px !important;
          }
        }
      `}</style>
    </div>
  );
};

// Modern Pagination Component
const ModernPagination = ({ paginate }) => {
  const { currentPage, maxPage, nextPage, prevPage, setPage } = paginate;
  
  const paginationStyle = {
    container: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    pageButton: {
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'white',
      color: '#333',
      border: '1px solid #e0e0e0',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontWeight: '500',
      fontSize: '14px',
    },
    pageButtonActive: {
      background: '#d05278',
      color: 'white',
      borderColor: '#d05278',
    },
    navButton: {
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'white',
      border: '1px solid #e0e0e0',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      color: '#666',
    },
    disabledButton: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    ellipsis: {
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#999',
      fontSize: '14px',
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    
    if (maxPage <= 5) {
      // If 5 or fewer pages, show all pages
      for (let i = 1; i <= maxPage; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        // Show ellipsis if current page is far from start
        pages.push('...');
      }
      
      // Show pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(maxPage - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (currentPage < maxPage - 2) {
        // Show ellipsis if current page is far from end
        pages.push('...');
      }
      
      // Always show last page
      pages.push(maxPage);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div style={paginationStyle.container}>
      {/* Previous button */}
      <button 
        style={{
          ...paginationStyle.navButton,
          ...(currentPage === 1 ? paginationStyle.disabledButton : {})
        }}
        onClick={prevPage}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      
      {/* Page numbers */}
      {pageNumbers.map((page, index) => (
        page === '...' ? (
          <span key={`ellipsis-${index}`} style={paginationStyle.ellipsis}>...</span>
        ) : (
          <button
            key={page}
            style={{
              ...paginationStyle.pageButton,
              ...(currentPage === page ? paginationStyle.pageButtonActive : {})
            }}
            onClick={() => setPage(page)}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        )
      ))}
      
      {/* Next button */}
      <button 
        style={{
          ...paginationStyle.navButton,
          ...(currentPage === maxPage ? paginationStyle.disabledButton : {})
        }}
        onClick={nextPage}
        disabled={currentPage === maxPage}
        aria-label="Next page"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  );
};
