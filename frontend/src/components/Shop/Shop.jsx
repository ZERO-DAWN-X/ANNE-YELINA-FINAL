import { Products } from 'components/Product/Products/Products';
import { PagingList } from 'components/shared/PagingList/PagingList';
import { usePagination } from 'components/utils/Pagination/Pagination';
import { useEffect, useState, useMemo } from 'react';
import Dropdown from 'react-dropdown';
import { getProducts } from 'services/productService';
import { getCategories, getBrands } from 'services/adminService';
import Slider from 'rc-slider';
import { useRouter } from 'next/router';

// React Range
const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);
const options = [
  { value: 'highToMin', label: 'From expensive to cheap' },
  { value: 'minToHigh', label: 'From cheap to expensive' },
];

export const Shop = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Filter states
  const [filter, setFilter] = useState({ 
    isNew: false, 
    isSale: false,
    category: '',
    brand: '',
    priceRange: [0, 1000],
    sortOrder: 'highToMin',
    search: ''
  });
  
  // Load products and filter options from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products, categories, and brands in parallel
        const [productsData, categoriesData, brandsData] = await Promise.all([
          getProducts(),
          getCategories(),
          getBrands()
        ]);
        
        // Transform products to ensure category and brand are strings
        const transformedProducts = productsData.map(product => ({
          ...product,
          // Use name from category object or fallback to string value
          category: product.category?.name || product.category || '',
          // Use name from brand object or fallback to string value
          brand: product.brand?.name || product.brand || '',
          // Keep the full objects as separate properties if needed
          categoryData: product.category,
          brandData: product.brand
        }));
        
        setProducts(transformedProducts || []);
        setCategories(categoriesData || []);
        setBrands(brandsData || []);
        
        // Set initial filtered products with default sort (high to low)
        const sorted = [...(transformedProducts || [])].sort((a, b) => 
          parseFloat(a.price) < parseFloat(b.price) ? 1 : -1
        );
        setFilteredProducts(sorted);
      } catch (err) {
        console.error('Error fetching shop data:', err);
        setError(`Failed to load products: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Update this useEffect to handle URL parameters
  useEffect(() => {
    if (!router.isReady) return;

    const { category } = router.query;
    
    if (category) {
      // Set the category filter when URL has category parameter
      setFilter(prev => ({
        ...prev,
        category: category
      }));

      // Highlight the filter section
      const filterSection = document.querySelector('.filter-section');
      if (filterSection) {
        filterSection.classList.add('highlight-filter');
        setTimeout(() => {
          filterSection.classList.remove('highlight-filter');
        }, 2000);
      }
    }
  }, [router.isReady, router.query]);
  
  // Apply filters whenever filter state changes
  useEffect(() => {
    if (products.length === 0) return;
    
    console.log("Applying filters:", filter);
    console.log("Available categories:", categories.map(c => c.slug));
    
    let result = [...products];
    
    // Add search filter
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      );
    }
    
    // FIX: Apply price filter correctly by parsing string prices to numbers
    result = result.filter(product => {
      // Make sure we're working with numbers
      const productPrice = parseFloat(product.price);
      // Check that product has a valid price and is within range
      return !isNaN(productPrice) && 
             productPrice >= filter.priceRange[0] && 
             productPrice <= filter.priceRange[1];
    });
    
    // Apply category filter - updated with logging
    if (filter.category) {
      console.log(`Filtering by category: ${filter.category}`);
      result = result.filter(product => {
        const matches = product.category === filter.category;
        console.log(`Product ${product.name} category: ${product.category}, matches: ${matches}`);
        return matches;
      });
    }
    
    // Apply brand filter
    if (filter.brand) {
      result = result.filter(product => product.brand === filter.brand);
    }
    
    // Apply special filters (New, Sale)
    if (filter.isNew) {
      result = result.filter(product => product.isNew === true);
    }
    
    if (filter.isSale) {
      result = result.filter(product => product.isSale === true);
    }
    
    // Apply sort order
    if (filter.sortOrder === 'highToMin') {
      result.sort((a, b) => parseFloat(a.price) < parseFloat(b.price) ? 1 : -1);
    } else {
      result.sort((a, b) => parseFloat(a.price) > parseFloat(b.price) ? 1 : -1);
    }
    
    console.log(`Filtered from ${products.length} to ${result.length} products`);
    setFilteredProducts(result);
  }, [filter, products]);
  
  // First, make sure we're correctly setting the price bounds
  const priceRange = useMemo(() => {
    if (products.length === 0) return [0, 1000];
    
    // Get numeric prices and filter out any non-numeric values
    const prices = products
      .map(p => parseFloat(p.price))
      .filter(price => !isNaN(price));
    
    // Set bounds with a small buffer
    return [
      Math.floor(Math.min(...prices)),
      Math.ceil(Math.max(...prices)) + 1
    ];
  }, [products]);

  // Pagination
  const paginate = usePagination(filteredProducts, 9);

  const handleSort = (value) => {
    setFilter(prev => ({ ...prev, sortOrder: value.value }));
  };
  
  const handlePriceRangeChange = (values) => {
    setFilter(prev => ({ 
      ...prev, 
      priceRange: values 
    }));
  };
  
  const handleCategoryChange = (categorySlug) => {
    // Update filter state
    setFilter(prev => ({ ...prev, category: categorySlug }));
    
    // Update URL without full page reload
    if (categorySlug) {
      router.push(`/shop?category=${encodeURIComponent(categorySlug)}`, undefined, { shallow: true });
    } else {
      router.push('/shop', undefined, { shallow: true });
    }
    
    // Close the filter panel on mobile
    if (isMobile) {
      setShowFilters(false);
    }
  };
  
  const handleBrandChange = (brandSlug) => {
    setFilter(prev => ({ ...prev, brand: brandSlug }));
    setShowFilters(false);
  };
  
  const toggleNewFilter = () => {
    setFilter(prev => {
      const newState = { ...prev, isNew: !prev.isNew };
      // If turning on New, turn off Sale
      if (newState.isNew) {
        newState.isSale = false;
      }
      return newState;
    });
  };
  
  const toggleSaleFilter = () => {
    setFilter(prev => {
      const newState = { ...prev, isSale: !prev.isSale };
      // If turning on Sale, turn off New
      if (newState.isSale) {
        newState.isNew = false;
      }
      return newState;
    });
  };

  // Add a function to clear filters
  const clearFilters = () => {
    setFilter({
      search: '',
      category: '',
      brand: '',
      priceRange: priceRange, // Use the current price range limits
      sortOrder: 'highToMin',
      isNew: false,
      isSale: false
    });
    
    // Clear URL parameters
    router.push('/shop', undefined, { shallow: true });
  };

  // Updated filters section with modern UI style

  // First, let's update the styles for a more attractive filter bar
  const styles = {
    shopContainer: {
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '0 10px'
    },
    contentWrapper: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    filterTopBar: {
      display: 'flex',
      flexDirection: 'column',
      background: 'white',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
      borderRadius: '6px',
      position: 'sticky',
      top: '80px',
      zIndex: 10,
      marginBottom: '16px',
      overflow: 'hidden'
    },
    topBarHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '14px 20px',
      borderBottom: '1px solid #f0f0f0',
      background: '#fafafa'
    },
    headerTitle: {
      fontSize: '18px',
      fontWeight: '600',
      margin: 0,
      color: '#333',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    headerCount: {
      fontSize: '13px',
      color: '#777',
      fontWeight: 'normal',
      marginLeft: '6px'
    },
    clearButton: {
      border: 'none',
      background: 'transparent',
      color: '#d05278',
      fontSize: '13px',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      transition: 'all 0.2s ease',
      borderRadius: '4px'
    },
    filterControls: {
      display: 'flex',
      flexWrap: 'wrap',
      padding: '16px 20px',
      gap: '20px',
      alignItems: 'flex-end',
      background: 'white'
    },
    filterGroup: {
      position: 'relative',
      flex: '1 1 170px',
      minWidth: '150px'
    },
    filterLabel: {
      fontSize: '12px',
      color: '#777',
      marginBottom: '6px',
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    filterSelect: {
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #e0e0e0',
      borderRadius: '4px',
      fontSize: '14px',
      color: '#333',
      background: 'white',
      cursor: 'pointer',
      appearance: 'none',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23666' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 12px center',
      paddingRight: '30px',
      transition: 'all 0.2s ease'
    },
    inlineSearch: {
      position: 'relative',
      flex: '2 1 300px'
    },
    searchInputInline: {
      width: '100%',
      padding: '10px 12px',
      paddingLeft: '36px',
      border: '1px solid #e0e0e0',
      borderRadius: '4px',
      fontSize: '14px',
      outline: 'none',
      transition: 'all 0.2s ease'
    },
    searchIconInline: {
      position: 'absolute',
      left: '10px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#aaa'
    },
    filterCheckboxGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flexWrap: 'wrap'
    },
    checkboxInline: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
      padding: '4px 8px',
      borderRadius: '4px',
      transition: 'all 0.2s ease'
    },
    checkboxActive: {
      background: '#fdf1f6'
    },
    priceRangeSection: {
      padding: '0 20px 20px',
      borderTop: '1px solid #f0f0f0',
      marginTop: '6px'
    },
    priceRangeInline: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      paddingTop: '16px'
    },
    rangeContainer: {
      padding: '0 8px',
      marginTop: '10px'
    },
    priceDisplay: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '12px',
      color: '#777',
      marginTop: '6px',
      fontWeight: '500'
    },
    collapseButton: {
      position: 'absolute',
      right: '16px',
      top: '14px',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      color: '#777',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4px',
      borderRadius: '4px',
      transition: 'all 0.2s ease',
      transform: 'rotate(0deg)'
    },
    collapseButtonActive: {
      transform: 'rotate(180deg)'
    },
    mobileFilterToggle: {
      display: 'none',
      margin: '0 0 16px',
      padding: '10px 16px',
      background: 'white',
      border: '1px solid #e0e0e0',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      color: '#333',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
    },
    mainContent: {
      display: 'flex',
      gap: '16px',
      position: 'relative'
    },
    productsGrid: {
      flex: 1,
      width: '100%'
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 0',
      color: '#666'
    },
    spinner: {
      width: '40px',
      height: '40px',
      border: '3px solid rgba(208, 82, 120, 0.2)',
      borderRadius: '50%',
      borderTop: '3px solid #d05278',
      animation: 'spin 1s linear infinite',
      marginBottom: '16px'
    },
    errorMessage: {
      padding: '30px',
      background: '#fff0f0',
      borderRadius: '8px',
      color: '#e53935',
      textAlign: 'center'
    },
    noProducts: {
      padding: '40px 20px',
      textAlign: 'center',
      background: '#f9f9f9',
      borderRadius: '8px'
    },
    noProductsTitle: {
      fontSize: '18px',
      marginBottom: '12px',
      color: '#333'
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#666'
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 90,
      opacity: 0,
      visibility: 'hidden',
      transition: 'opacity 0.3s ease',
      cursor: 'pointer'
    },
    overlayVisible: {
      opacity: 1,
      visibility: 'visible'
    }
  };

  // Get active filter count for badge
  const activeFilterCount = [
    filter.category,
    filter.brand,
    filter.isNew,
    filter.isSale,
    filter.search,
    filter.priceRange[0] !== priceRange[0] || filter.priceRange[1] !== priceRange[1]
  ].filter(Boolean).length;

  // First, let's fix how we detect mobile view and manage the filter display state

  // 1. Update the useEffect for window resizing
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      // Important: Reset showFilters state when transitioning between mobile and desktop
      if (!mobile && showFilters) {
        setShowFilters(false);
      }
    };
    
    // Set initial value
    if (typeof window !== 'undefined') {
      handleResize();
      
      // Add event listener
      window.addEventListener('resize', handleResize);
      
      // Clean up
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [showFilters]); // Add showFilters as dependency

  // Add a useEffect to initialize the price range when products are loaded:
  useEffect(() => {
    if (products.length > 0) {
      // Initialize price range filter with the full range of available products
      setFilter(prev => ({
        ...prev,
        priceRange: [priceRange[0], priceRange[1]]
      }));
    }
  }, [products, priceRange]);

  // Add state for collapsible price range
  const [priceRangeCollapsed, setPriceRangeCollapsed] = useState(false);

  // 3. Add effect to scroll to products when coming from featured categories
  useEffect(() => {
    // If we have a category parameter and products have loaded
    if (router.query.category && !loading && filteredProducts.length > 0) {
      // Scroll to products section after a short delay to ensure rendering is complete
      setTimeout(() => {
        const productsContainer = document.querySelector('.products-container');
        if (productsContainer) {
          productsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
      
      // Add a visual indicator of applied filter
      if (!isMobile) {
        // For desktop, we can animate the filter section briefly
        const filterSection = document.querySelector('.filter-top-bar');
        if (filterSection) {
          filterSection.classList.add('highlight-filter');
          // Remove highlight after animation completes
          setTimeout(() => {
            filterSection.classList.remove('highlight-filter');
          }, 2000);
        }
      }
    }
  }, [router.query.category, loading, filteredProducts.length, isMobile]);

  return (
    <div style={styles.shopContainer}>
      <div style={styles.contentWrapper}>
        {/* Mobile Filter Toggle Button - Enhanced to show active category */}
        <button 
          style={{
            ...styles.mobileFilterToggle,
            display: isMobile ? 'flex' : 'none',
            flexDirection: filter.category ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: filter.category ? 'flex-start' : 'center',
            background: filter.category ? '#fdf1f6' : '#f5f5f5',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            width: '100%',
            padding: filter.category ? '12px 20px 14px' : '12px 20px'
          }}
          onClick={() => {
            console.log("Opening mobile filters");
            setShowFilters(true);
          }}
          className={`mobile-filter-toggle ${filter.category ? 'has-category filter-active' : ''}`}
        >
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            width: '100%',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M7 12h10M11 18h2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ marginLeft: '8px' }}>
                Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
              </span>
            </div>
            
            {filter.category && (
              <span style={{ 
                fontSize: '13px',
                color: '#d05278',
                fontWeight: '600'
              }}>
                {categories.find(c => c.slug === filter.category)?.name || 'Category'}
              </span>
            )}
          </div>
          
          {filter.category && (
            <div className="active-filters" style={{ 
              marginTop: '8px',
              width: '100%'
            }}>
              <div className="category-pill">
                {categories.find(c => c.slug === filter.category)?.name || 'Category'}
                <span style={{ marginLeft: '6px', cursor: 'pointer' }} onClick={(e) => {
                  e.stopPropagation();
                  setFilter(prev => ({ ...prev, category: '' }));
                  router.push('/shop', undefined, { shallow: true });
                }}>×</span>
              </div>
              </div>
          )}
        </button>
        
        {/* Modern Filter Top Bar - Fix visibility logic */}
        <div 
          style={{
            ...styles.filterTopBar,
            ...(isMobile ? {
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 0,
              zIndex: 1000,
              maxHeight: '100vh',
              overflowY: 'auto',
              display: showFilters ? 'flex' : 'none'
            } : {})
          }} 
          className="filter-top-bar"
        >
          <div style={styles.topBarHeader}>
            <h2 style={styles.headerTitle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Filters
              <span style={styles.headerCount}>
                {filteredProducts.length} products found
              </span>
            </h2>
            
            {/* Close button - Make it more prominent for mobile */}
            {isMobile && (
              <button 
                style={{
                  ...styles.closeButton,
                  padding: '4px 8px',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#333'
                }}
                onClick={() => setShowFilters(false)}
                aria-label="Close filters"
              >
                &times;
              </button>
            )}
            
            {activeFilterCount > 0 && (
              <button 
                style={styles.clearButton}
                onClick={clearFilters}
                className="clear-filters-btn"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Clear all filters
              </button>
            )}
          </div>
          
          {/* Filter Controls */}
          <div style={styles.filterControls} className="filter-controls">
            {/* Search */}
            <div style={styles.inlineSearch}>
              <div style={styles.filterLabel}>Search</div>
              <input
                type='search'
                placeholder='Search products...'
                value={filter.search}
                onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                style={styles.searchInputInline}
                className="search-input"
              />
              <span style={styles.searchIconInline}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
                </div>
            
            {/* Category dropdown */}
            <div style={styles.filterGroup}>
              <div style={styles.filterLabel}>Category</div>
              <select 
                value={filter.category} 
                onChange={(e) => handleCategoryChange(e.target.value)}
                style={{
                  ...styles.filterSelect,
                  ...(filter.category ? {
                    borderColor: '#d05278',
                    boxShadow: '0 0 0 1px rgba(208, 82, 120, 0.2)'
                  } : {})
                }}
                className="filter-select"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
              </div>
            
            {/* Brand dropdown */}
            <div style={styles.filterGroup}>
              <div style={styles.filterLabel}>Brand</div>
              <select 
                value={filter.brand} 
                onChange={(e) => handleBrandChange(e.target.value)}
                style={styles.filterSelect}
                className="filter-select"
              >
                <option value="">All Brands</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.slug}>
                    {brand.name}
                  </option>
                ))}
              </select>
              </div>
            
            {/* Sort dropdown */}
            <div style={styles.filterGroup}>
              <div style={styles.filterLabel}>Sort By</div>
              <select 
                value={filter.sortOrder} 
                onChange={(e) => handleSort({ value: e.target.value })}
                style={styles.filterSelect}
                className="filter-select"
              >
                <option value="highToMin">Price: High to Low</option>
                <option value="minToHigh">Price: Low to High</option>
              </select>
            </div>
            
            {/* Special offers checkboxes */}
            <div style={styles.filterGroup}>
              <div style={styles.filterLabel}>Special Offers</div>
              <div style={styles.filterCheckboxGroup}>
                <label 
                  style={{
                    ...styles.checkboxInline,
                    ...(filter.isNew ? styles.checkboxActive : {})
                  }}
                  className={`checkbox-label ${filter.isNew ? 'active' : ''}`}
                >
                    <input
                    type="checkbox"
                    checked={filter.isNew}
                    onChange={toggleNewFilter}
                    style={{ accentColor: '#d05278' }}
                  />
                  <span>New Arrivals</span>
                  </label>
                
                <label 
                  style={{
                    ...styles.checkboxInline,
                    ...(filter.isSale ? styles.checkboxActive : {})
                  }}
                  className={`checkbox-label ${filter.isSale ? 'active' : ''}`}
                >
                    <input
                    type="checkbox"
                    checked={filter.isSale}
                    onChange={toggleSaleFilter}
                    style={{ accentColor: '#d05278' }}
                  />
                  <span>Sale Items</span>
                  </label>
                </div>
            </div>
          </div>
          
          {/* Price range slider - collapsible */}
          <div style={styles.priceRangeSection}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '4px',
              position: 'relative'
            }}>
              <div style={styles.filterLabel}>Price Range</div>
              <button 
                style={{
                  ...styles.collapseButton,
                  ...(priceRangeCollapsed ? styles.collapseButtonActive : {})
                }}
                onClick={() => setPriceRangeCollapsed(!priceRangeCollapsed)}
                aria-label={priceRangeCollapsed ? "Expand price range" : "Collapse price range"}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>
            
            {!priceRangeCollapsed && (
              <div style={styles.rangeContainer}>
                <Range
                  min={priceRange[0]}
                  max={priceRange[1]}
                  value={filter.priceRange}
                  onChange={handlePriceRangeChange}
                  trackStyle={[{ backgroundColor: '#d05278' }]}
                  handleStyle={[
                    { borderColor: '#d05278', backgroundColor: '#fff', boxShadow: '0 0 0 2px rgba(208, 82, 120, 0.2)' },
                    { borderColor: '#d05278', backgroundColor: '#fff', boxShadow: '0 0 0 2px rgba(208, 82, 120, 0.2)' }
                  ]}
                  railStyle={{ backgroundColor: '#eee' }}
                />
                <div style={styles.priceDisplay}>
                  <span>${filter.priceRange[0]}</span>
                  <span>${filter.priceRange[1]}</span>
                </div>
              </div>
            )}
              </div>

          {/* Mobile apply button - Make it more prominent */}
          {isMobile && (
            <div style={{
              padding: '16px 20px',
              borderTop: '1px solid #f0f0f0',
              display: 'flex',
              justifyContent: 'center',
              position: 'sticky',
              bottom: 0,
              background: 'white',
              boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
            }}>
              <button 
                style={{
                  background: '#d05278',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '12px 0',
                  fontWeight: '500',
                  cursor: 'pointer',
                  width: '100%',
                  fontSize: '16px'
                }}
                onClick={() => setShowFilters(false)}
              >
                Apply Filters
              </button>
            </div>
          )}
        </div>

        {/* Products Grid - same as before */}
        <div style={{ ...styles.mainContent, gap: 0 }}>
          <div style={{ ...styles.productsGrid, width: '100%' }}>
            {loading ? (
              <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <p>Loading products...</p>
              </div>
            ) : error ? (
              <div style={styles.errorMessage}>
                <p>{error}</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div style={styles.noProducts}>
                <h3 style={styles.noProductsTitle}>No products found</h3>
                <p>Try adjusting your filters to find what you're looking for.</p>
                <button 
                  onClick={clearFilters}
                  style={{
                    background: 'transparent',
                    border: '1px solid #d05278',
                    color: '#d05278',
                    padding: '8px 16px',
                    marginTop: '16px',
                    cursor: 'pointer'
                  }}
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="products-container" style={{ padding: '0' }}>
                <Products 
                  products={paginate.currentData()} 
                  paginate={paginate} 
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Overlay - Fix z-index and display logic */}
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999,
            opacity: showFilters && isMobile ? 1 : 0,
            visibility: showFilters && isMobile ? 'visible' : 'hidden',
            transition: 'opacity 0.3s ease',
            cursor: 'pointer'
          }}
          onClick={() => setShowFilters(false)}
        />
        
        {/* Add enhanced CSS for mobile responsiveness */}
        <style jsx global>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .filter-select:focus,
          .search-input:focus {
            border-color: #d05278;
            outline: none;
            box-shadow: 0 0 0 2px rgba(208, 82, 120, 0.1);
          }
          
          .checkbox-label:hover {
            background: #f9f9f9;
          }
          
          .checkbox-label.active {
            background: #fdf1f6;
            color: #d05278;
            font-weight: 500;
          }
          
          .clear-filters-btn:hover {
            background: rgba(208, 82, 120, 0.08);
          }
          
          /* Fix mobile filter animation */
          @keyframes slideInFromRight {
            0% { transform: translateX(100%); }
            100% { transform: translateX(0); }
          }
          
          @media (max-width: 768px) {
            .filter-top-bar {
              animation: slideInFromRight 0.3s forwards;
            }
            
            /* Prevent body scrolling when filter is open */
            ${showFilters ? `
              body {
                overflow: hidden;
              }
            ` : ''}
            
            .mobile-filter-toggle {
              display: flex !important;
            }
          }
          
          /* Add animation for highlighting the filter section */
          @keyframes highlightFilter {
            0% { box-shadow: 0 0 0 rgba(208, 82, 120, 0); }
            30% { box-shadow: 0 0 15px rgba(208, 82, 120, 0.4); }
            70% { box-shadow: 0 0 15px rgba(208, 82, 120, 0.4); }
            100% { box-shadow: 0 0 0 rgba(208, 82, 120, 0); }
          }
          
          .highlight-filter {
            animation: highlightFilter 2s ease-in-out;
          }
          
          /* Make active filter item more noticeable */
          .filter-select option:checked {
            background-color: #fdf1f6;
            color: #d05278;
          }
          
          /* Enhance mobile filter toggle when a category is selected */
          .mobile-filter-toggle.filter-active {
            background: #fdf1f6 !important;
            border-color: #d05278 !important;
            color: #d05278;
          }
          
          /* Make category pills more visible on mobile */
          .category-pill {
            display: inline-block;
            background: #fdf1f6;
            color: #d05278;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 13px;
            margin-right: 8px;
            margin-bottom: 8px;
            font-weight: 500;
          }
          
          /* Modify the mobile filter toggle to show active category */
          @media (max-width: 768px) {
            .mobile-filter-toggle.has-category {
              justify-content: space-between !important;
            }
            
            .mobile-filter-toggle .active-filters {
              display: flex;
              flex-wrap: wrap;
              margin-top: 8px;
            }
          }
        `}</style>
      </div>
    </div>
  );
};
