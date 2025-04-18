import { useCart } from 'context/CartContext';
import { useAuth } from 'context/AuthContext';
import { PublicLayout } from 'layout/PublicLayout';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const breadcrumbsData = [
  {
    label: 'Home',
    path: '/',
  },
  {
    label: 'Cart',
    path: '/cart',
  },
];

const CartPage = () => {
  const { cart, updateItemQuantity, removeItem, isAuthenticated } = useCart();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push({
        pathname: '/login',
        query: { redirect: '/cart' }, // So we can redirect back after login
      });
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted || !isAuthenticated) {
    return null;
  }

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) return;
    updateItemQuantity(id, quantity);
  };
  
  const handleRemoveItem = (id) => {
    removeItem(id);
  };

  return (
    <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle='Shopping Cart'>
      <div className="cart-page">
        <div className="wrapper">
          {!isAuthenticated ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#d05278" strokeWidth="1">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
              <h2>Please Log In</h2>
              <p>You need to be logged in to view your cart</p>
              <Link href="/login">
                <a className="btn">Log In</a>
              </Link>
            </div>
          ) : cart.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#d05278" strokeWidth="1">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
              <h2>Your cart is empty</h2>
              <p>Looks like you haven't added any products to your cart yet.</p>
              <Link href="/shop">
                <a className="btn">Continue Shopping</a>
              </Link>
            </div>
          ) : (
            <div className="cart-content">
              <div className="cart-products">
                <div className="cart-header">
                  <div className="cart-header-product">Product</div>
                  <div className="cart-header-price">Price</div>
                  <div className="cart-header-quantity">Quantity</div>
                  <div className="cart-header-total">Total</div>
                  <div className="cart-header-remove"></div>
                </div>
                
                {cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-product">
                      <div className="cart-product-image">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="cart-product-details">
                        <h3 className="cart-product-title">
                          <Link href={`/product/${item.slug}`}>
                            <a>{item.name}</a>
                          </Link>
                        </h3>
                        {item.color && (
                          <div className="cart-product-color">
                            <span className="color-label">Color:</span>
                            <span 
                              className="color-dot" 
                              style={{ backgroundColor: item.color }}
                            ></span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="cart-price">${parseFloat(item.price).toFixed(2)}</div>
                    
                    <div className="cart-quantity">
                      <div className="quantity-selector">
                        <button 
                          className="quantity-btn minus" 
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                        <input 
                          type="number" 
                          min="1" 
                          value={item.quantity} 
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                        />
                        <button 
                          className="quantity-btn plus" 
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="cart-item-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    
                    <div className="cart-remove">
                      <button 
                        className="remove-btn" 
                        onClick={() => handleRemoveItem(item.id)}
                        aria-label="Remove item"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="cart-footer">
                <div className="cart-total">
                  <span className="cart-total-label">Total:</span>
                  <span className="cart-total-value">${totalPrice.toFixed(2)}</span>
                </div>
                
                <div className="cart-actions-buttons">
                  <button 
                    className="btn-continue-shopping" 
                    onClick={() => router.push('/shop')}
                  >
                    Continue Shopping
                  </button>
                  <button 
                    className="btn-checkout" 
                    onClick={() => router.push('/checkout')}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .cart-page {
          padding: 40px 0 80px;
        }
        
        .empty-cart {
          text-align: center;
          padding: 60px 20px;
          max-width: 500px;
          margin: 0 auto;
        }
        
        .empty-cart-icon {
          margin-bottom: 24px;
        }
        
        .empty-cart h2 {
          font-size: 28px;
          margin-bottom: 12px;
          color: #333;
        }
        
        .empty-cart p {
          color: #666;
          margin-bottom: 24px;
          font-size: 16px;
        }
        
        .empty-cart .btn {
          padding: 12px 32px;
          background: #d05278;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-block;
        }
        
        .empty-cart .btn:hover {
          background: #b93d63;
        }
        
        .cart-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .cart-products {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        
        .cart-header {
          display: grid;
          grid-template-columns: 3fr 1fr 1.5fr 1fr 0.5fr;
          padding: 16px 24px;
          background: #f5f5f5;
          color: #666;
          font-weight: 600;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .cart-item {
          display: grid;
          grid-template-columns: 3fr 1fr 1.5fr 1fr 0.5fr;
          padding: 24px;
          border-bottom: 1px solid #eee;
          align-items: center;
        }
        
        .cart-item:last-child {
          border-bottom: none;
        }
        
        .cart-product {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .cart-product-image {
          width: 80px;
          height: 80px;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid #eee;
        }
        
        .cart-product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .cart-product-title {
          font-size: 16px;
          margin: 0 0 4px;
        }
        
        .cart-product-title a {
          color: #333;
          text-decoration: none;
          transition: color 0.2s;
        }
        
        .cart-product-title a:hover {
          color: #d05278;
        }
        
        .cart-product-color {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #666;
          font-size: 14px;
        }
        
        .color-dot {
          display: inline-block;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 1px solid #ddd;
        }
        
        .cart-price {
          font-weight: 500;
          color: #555;
        }
        
        .quantity-selector {
          display: flex;
          align-items: center;
          max-width: 120px;
          border: 1px solid #ddd;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .quantity-btn {
          background: #f5f5f5;
          border: none;
          width: 32px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #555;
          transition: all 0.2s;
        }
        
        .quantity-btn:hover:not(:disabled) {
          background: #eee;
          color: #333;
        }
        
        .quantity-btn:disabled {
          color: #aaa;
          cursor: not-allowed;
        }
        
        .quantity-selector input {
          width: 50px;
          height: 36px;
          text-align: center;
          border: none;
          border-left: 1px solid #ddd;
          border-right: 1px solid #ddd;
          font-size: 14px;
          -moz-appearance: textfield;
        }
        
        .quantity-selector input::-webkit-outer-spin-button,
        .quantity-selector input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        
        .cart-item-total {
          font-weight: 600;
          color: #333;
        }
        
        .remove-btn {
          background: transparent;
          border: none;
          color: #999;
          cursor: pointer;
          transition: color 0.2s;
          padding: 8px;
          border-radius: 4px;
        }
        
        .remove-btn:hover {
          color: #d05278;
          background: #fdf1f6;
        }
        
        .cart-footer {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .cart-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #eee;
        }
        
        .cart-total-label {
          font-size: 18px;
          font-weight: 600;
          color: #333;
        }
        
        .cart-total-value {
          font-size: 24px;
          font-weight: 700;
          color: #d05278;
        }
        
        .cart-actions-buttons {
          display: flex;
          gap: 16px;
          margin-top: 8px;
        }
        
        .btn-continue-shopping, .btn-checkout {
          flex: 1;
          padding: 12px 16px;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }
        
        .btn-continue-shopping {
          background: white;
          border: 1px solid #ddd;
          color: #666;
        }
        
        .btn-continue-shopping:hover {
          background: #f5f5f5;
          border-color: #ccc;
        }
        
        .btn-checkout {
          background: #d05278;
          border: none;
          color: white;
        }
        
        .btn-checkout:hover {
          background: #b93d63;
        }
        
        @media (max-width: 768px) {
          .cart-header {
            display: none;
          }
          
          .cart-item {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .cart-product {
            grid-column: 1 / -1;
          }
          
          .cart-price, .cart-quantity, .cart-item-total, .cart-remove {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-top: 1px dashed #eee;
          }
          
          .cart-price::before, .cart-quantity::before, .cart-item-total::before {
            font-weight: 500;
            color: #666;
          }
          
          .cart-price::before {
            content: "Price:";
          }
          
          .cart-quantity::before {
            content: "Quantity:";
          }
          
          .cart-item-total::before {
            content: "Total:";
          }
          
          .cart-remove {
            justify-content: flex-end;
            border-top: none;
            padding-top: 0;
          }
          
          .quantity-selector {
            max-width: 100px;
          }
          
          .cart-actions-buttons {
            flex-direction: column;
          }
          
          .btn-continue-shopping, .btn-checkout {
            width: 100%;
          }
        }
      `}</style>
    </PublicLayout>
  );
};

export default CartPage;
