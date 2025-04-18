import { ProductsCarousel } from 'components/Product/Products/ProductsCarousel';
import { SectionTitle } from 'components/shared/SectionTitle/SectionTitle';
import { useEffect, useState } from 'react';
import { getProducts } from 'services/productService';

export const Trending = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productsData = await getProducts();
        
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
        
        // Filter trending products after transformation
        const trendingProducts = transformedProducts.filter(product => product.isSale === true);
        setProducts(trendingProducts);
      } catch (err) {
        setError('Failed to load trending products');
        console.error('Error fetching trending products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // If no trending products, don't render the section
  if (!loading && products.length === 0) {
    return null;
  }
  
  return (
    <>
      {/* <!-- BEGIN TRENDING PRODUCTS --> */}
      <section className='trending-products'>
        <div className='trending-products__content'>
          <SectionTitle
            subTitle="Popular Choices"
            title="Trending Products"
            body="Discover our most popular beauty essentials. These customer favorites are flying off the shelves."
          />
          <div className='trending-products__tabs'>
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading trending products...</p>
              </div>
            ) : error ? (
              <div className="error-message">
                {error}
              </div>
            ) : (
              <div className='products-carousel-container'>
                <ProductsCarousel products={products} />
              </div>
            )}
          </div>
        </div>
        
        <style jsx>{`
          .trending-products {
            padding: 60px 0;
            margin-top: 100px;
          }
          
          .trending-products__content {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 10px;
          }
          
          .trending-products__tabs {
            margin-top: 40px;
          }
          
          .products-carousel-container {
            position: relative;
          }
          
          .products-carousel-container :global(.slick-list) {
            margin: 0 -15px;
          }
          
          .products-carousel-container :global(.slick-slide) {
            padding: 0 15px;
          }
          
          .products-carousel-container :global(.product-card) {
            margin-bottom: 10px;
          }
          
          /* Add styling for arrow buttons if needed */
          .products-carousel-container :global(.slick-prev),
          .products-carousel-container :global(.slick-next) {
            width: 40px;
            height: 40px;
            background: white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            z-index: 1;
            transition: all 0.3s ease;
          }
          
          .products-carousel-container :global(.slick-prev:hover),
          .products-carousel-container :global(.slick-next:hover) {
            background: #d05278;
          }
          
          .products-carousel-container :global(.slick-prev:hover:before),
          .products-carousel-container :global(.slick-next:hover:before) {
            color: white;
          }
          
          .products-carousel-container :global(.slick-prev:before),
          .products-carousel-container :global(.slick-next:before) {
            color: #333;
            font-size: 18px;
            transition: color 0.3s ease;
          }
          
          .products-carousel-container :global(.slick-prev) {
            left: -5px;
          }
          
          .products-carousel-container :global(.slick-next) {
            right: -5px;
          }
          
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px 0;
          }
          
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(208, 82, 120, 0.2);
            border-radius: 50%;
            border-top-color: #d05278;
            animation: spin 1s linear infinite;
            margin-bottom: 15px;
          }
          
          .error-message {
            text-align: center;
            color: #e74c3c;
            padding: 20px;
            background: #fdf0f0;
            border-radius: 8px;
          }
          
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
          
          @media (max-width: 768px) {
            .trending-products {
              padding: 40px 0;
            }
            
            .products-carousel-container :global(.slick-prev) {
              left: 0;
            }
            
            .products-carousel-container :global(.slick-next) {
              right: 0;
            }
          }
        `}</style>
      </section>
      {/* <!-- TRENDING PRODUCTS EOF --> */}
    </>
  );
};
