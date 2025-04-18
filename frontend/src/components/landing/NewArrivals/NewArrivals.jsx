import { ProductsCarousel } from 'components/Product/Products/ProductsCarousel';
import { SectionTitle } from 'components/shared/SectionTitle/SectionTitle';
import { useEffect, useState } from 'react';
import { getProducts } from 'services/productService';

export const NewArrivals = () => {
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
        
        // Filter new products after transformation
        const newProducts = transformedProducts.filter(product => product.isNew === true);
        setProducts(newProducts);
      } catch (err) {
        setError('Failed to load new arrivals');
        console.error('Error fetching new arrivals:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // If no new products, don't render the section
  if (!loading && products.length === 0) {
    return null;
  }
  
  return (
    <>
      {/* <!-- BEGIN NEW ARRIVALS --> */}
      <section className='trending'>
        <div className='trending-content'>
          <SectionTitle
            subTitle="Fresh & New"
            title="New Arrivals"
            body="Discover our latest additions to the collection. Shop the newest beauty products that just arrived."
          />
          <div className='tab-wrap trending-tabs'>
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading new arrivals...</p>
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
          .trending {
            padding: 60px 0;
            background-color: #fff;
          }
          
          .trending-content {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 10px;
          }
          
          .tab-wrap {
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
            .trending {
              padding: 40px 0;
            }
          }
        `}</style>
      </section>
      {/* <!-- NEW ARRIVALS EOF --> */}
    </>
  );
};
