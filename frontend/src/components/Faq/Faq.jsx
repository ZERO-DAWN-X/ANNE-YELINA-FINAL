import { useState, useEffect } from 'react';
import { getProducts } from 'services/adminService';
import Link from 'next/link';

export const Faq = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);

  // FAQ data
  const faqData = [
    {
      category: "Shopping & Orders",
      questions: [
        {
          q: "How do I place an order?",
          a: "You can place an order by browsing our products, adding items to your cart, and proceeding to checkout. Follow the simple steps to enter your shipping and payment information."
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and other secure payment methods."
        },
        {
          q: "How can I track my order?",
          a: "Once your order ships, you'll receive a tracking number via email. You can use this to track your package's journey to you."
        }
      ]
    },
    {
      category: "Shipping & Delivery",
      questions: [
        {
          q: "How long does shipping take?",
          a: "Standard shipping typically takes 3-5 business days. Express shipping options are available at checkout."
        },
        {
          q: "Do you ship internationally?",
          a: "Yes, we ship to most countries worldwide. Shipping times and costs vary by location."
        }
      ]
    },
    {
      category: "Returns & Refunds",
      questions: [
        {
          q: "What is your return policy?",
          a: "We offer a 30-day return policy for unused items in their original packaging. Contact our customer service to initiate a return."
        },
        {
          q: "How long do refunds take to process?",
          a: "Refunds typically process within 5-7 business days after we receive your return."
        }
      ]
    },
    {
      category: "Product Information",
      questions: [
        {
          q: "Are your products cruelty-free?",
          a: "Yes, all our products are cruelty-free and we never test on animals."
        },
        {
          q: "Do you offer samples?",
          a: "Yes, you can request samples with your order. Some restrictions apply."
        }
      ]
    }
  ];

  // Fetch all products initially
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Handle search input changes
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsSearching(query.length > 0);

    // Filter products based on search query
    if (query) {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  };

  // Filter questions based on search query
  const filteredFaq = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(
      item => 
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="faq-container">
      <div className="search-section">
        <h1>How can we help you?</h1>
        <div className="search-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search products or questions..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Product Search Results */}
        {isSearching && (
          <div className="search-results">
            {loading ? (
              <div className="loading">Searching products...</div>
            ) : filteredProducts.length > 0 ? (
              <div className="product-results">
                <h3>Products ({filteredProducts.length})</h3>
                <div className="product-grid">
                  {filteredProducts.map((product) => (
                    <Link href={`/product/${product.id}`} key={product.id}>
                      <a className="product-card">
                        <div className="product-image">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            onError={(e) => {
                              e.target.src = '/assets/img/placeholder.jpg';
                            }}
                          />
                        </div>
                        <div className="product-info">
                          <h4>{product.name}</h4>
                          <p className="product-category">{product.category}</p>
                          <span className="product-price">${product.price}</span>
                        </div>
                      </a>
                    </Link>
                  ))}
                </div>
              </div>
            ) : searchQuery.length > 0 ? (
              <div className="no-results">
                No products found matching "{searchQuery}"
              </div>
            ) : null}
          </div>
        )}

        {/* Original FAQ Content */}
        {!isSearching && (
          <div className="faq-content">
            {filteredFaq.map((category, categoryIndex) => (
              <div key={categoryIndex} className="faq-category">
                <h2>{category.category}</h2>
                <div className="faq-questions">
                  {category.questions.map((item, index) => (
                    <div 
                      key={index} 
                      className={`faq-item ${activeIndex === `${categoryIndex}-${index}` ? 'active' : ''}`}
                    >
                      <button 
                        className="faq-question"
                        onClick={() => setActiveIndex(activeIndex === `${categoryIndex}-${index}` ? null : `${categoryIndex}-${index}`)}
                      >
                        {item.q}
                        <span className="icon">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d={activeIndex === `${categoryIndex}-${index}` ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"}/>
                          </svg>
                        </span>
                      </button>
                      <div className="faq-answer">
                        <p>{item.a}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .faq-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .search-section {
          text-align: center;
          margin-bottom: 50px;
        }

        .search-section h1 {
          font-size: 32px;
          color: #333;
          margin-bottom: 24px;
        }

        .search-box {
          max-width: 600px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          background: white;
          border: 2px solid #eee;
          border-radius: 30px;
          padding: 12px 20px;
          transition: all 0.3s ease;
        }

        .search-box:focus-within {
          border-color: #d05278;
          box-shadow: 0 0 0 4px rgba(208, 82, 120, 0.1);
        }

        .search-results {
          margin-top: 30px;
          text-align: left;
        }

        .product-results h3 {
          font-size: 18px;
          color: #333;
          margin-bottom: 20px;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .product-card {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
          text-decoration: none;
          color: inherit;
        }

        .product-card:hover {
          transform: translateY(-5px);
        }

        .product-image {
          position: relative;
          padding-top: 100%;
          background: #f5f5f5;
        }

        .product-image img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-info {
          padding: 15px;
        }

        .product-info h4 {
          margin: 0 0 5px;
          font-size: 16px;
          color: #333;
        }

        .product-category {
          color: #666;
          font-size: 14px;
          margin: 0 0 8px;
        }

        .product-price {
          color: #d05278;
          font-weight: 600;
          font-size: 16px;
        }

        .loading {
          text-align: center;
          padding: 20px;
          color: #666;
        }

        .no-results {
          text-align: center;
          padding: 30px;
          color: #666;
          background: #f9f9f9;
          border-radius: 8px;
        }

        .faq-content {
          margin-top: 40px;
        }

        .faq-category {
          margin-bottom: 40px;
        }

        .faq-category h2 {
          color: #333;
          font-size: 24px;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #f0f0f0;
        }

        .faq-item {
          background: white;
          border-radius: 8px;
          margin-bottom: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          overflow: hidden;
        }

        .faq-question {
          width: 100%;
          text-align: left;
          padding: 20px;
          background: none;
          border: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          font-size: 16px;
          color: #333;
          font-weight: 500;
        }

        .faq-question:hover {
          color: #d05278;
        }

        .icon {
          display: flex;
          align-items: center;
          transition: transform 0.3s ease;
        }

        .faq-item.active .icon {
          transform: rotate(180deg);
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-out;
        }

        .faq-item.active .faq-answer {
          max-height: 500px;
          transition: max-height 0.5s ease-in;
        }

        .faq-answer p {
          padding: 0 20px 20px;
          color: #666;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .product-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .faq-container {
            padding: 20px 15px;
          }

          .faq-category h2 {
            font-size: 20px;
          }

          .faq-question {
            font-size: 15px;
            padding: 15px;
          }
        }

        @media (max-width: 480px) {
          .product-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
