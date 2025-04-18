import { useCart } from 'context/CartContext';
import { Card } from './Card/Card';
import { useEffect, useState } from 'react';

export const CheckoutOrders = ({ activeStep }) => {
  const { cart } = useCart();
  const [orderItems, setOrderItems] = useState([]);
  const [orderTotal, setOrderTotal] = useState(0);

  useEffect(() => {
    // If we're on step 3 and cart is empty, try to get items from lastOrder
    if (activeStep === 3 && cart.length === 0) {
      const savedOrder = localStorage.getItem('lastOrder');
      if (savedOrder) {
        try {
          const orderData = JSON.parse(savedOrder);
          setOrderItems(orderData.items || []);
          setOrderTotal(orderData.total || 0);
        } catch (error) {
          console.error('Error parsing saved order:', error);
          setOrderItems([]);
          setOrderTotal(0);
        }
      }
    } else {
      // Use current cart for all other cases
      setOrderItems(cart);
      const total = cart.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0
      );
      setOrderTotal(total);
    }
  }, [cart, activeStep]);

  return (
    <div className="order-summary-section">
      <div className="order-summary-header">
        <h3>Order Summary</h3>
        <span className="order-items-count">{orderItems.length} {orderItems.length === 1 ? 'item' : 'items'}</span>
      </div>
      
      {orderItems.length > 0 ? (
        <div className="order-content">
          <div className="order-items">
            {orderItems.map((order) => (
              <div key={order.id} className="order-item">
                <div className="item-image">
                  {order.image && (
                    <img src={order.image} alt={order.name} />
                  )}
                  <span className="item-quantity">{order.quantity}</span>
                </div>
                <div className="item-details">
                  <h4>{order.name}</h4>
                  {order.color && (
                    <div className="item-color">
                      <span className="color-dot" style={{ backgroundColor: order.color }}></span>
                      <span>Color</span>
                    </div>
                  )}
                </div>
                <div className="item-price">
                  ${(Number(order.price) * order.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="price-details">
            <div className="subtotal-row">
              <span>Subtotal</span>
              <span>${orderTotal.toFixed(2)}</span>
            </div>
            <div className="shipping-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="divider"></div>
            <div className="total-row">
              <span>Total</span>
              <span className="total-amount">${orderTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-cart-message">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <p>Your cart is empty</p>
        </div>
      )}
      
      {activeStep !== 3 && orderItems.length > 0 && (
        <div className="secure-checkout-notice">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span>Secure checkout</span>
        </div>
      )}
      
      <style jsx>{`
        .order-summary-section {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
          overflow: hidden;
        }
        
        .order-summary-header {
          padding: 20px;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .order-summary-header h3 {
          margin: 0;
          font-size: 18px;
          color: #333;
        }
        
        .order-items-count {
          color: #888;
          font-size: 14px;
        }
        
        .order-content {
          padding: 0;
        }
        
        .order-items {
          padding: 0;
          max-height: 320px;
          overflow-y: auto;
        }
        
        .order-item {
          display: flex;
          padding: 16px 20px;
          border-bottom: 1px solid #f0f0f0;
          align-items: center;
        }
        
        .item-image {
          position: relative;
          width: 60px;
          height: 60px;
          border-radius: 8px;
          overflow: hidden;
          background: #f9f9f9;
          border: 1px solid #eee;
          margin-right: 16px;
          flex-shrink: 0;
        }
        
        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .item-quantity {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #d05278;
          color: white;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }
        
        .item-details {
          flex: 1;
          min-width: 0;
        }
        
        .item-details h4 {
          margin: 0 0 6px;
          font-size: 14px;
          font-weight: 500;
          color: #333;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .item-color {
          display: flex;
          align-items: center;
          font-size: 12px;
          color: #888;
        }
        
        .color-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          margin-right: 6px;
          border: 1px solid rgba(0,0,0,0.1);
        }
        
        .item-price {
          font-weight: 600;
          color: #333;
          font-size: 14px;
          flex-shrink: 0;
        }
        
        .price-details {
          padding: 16px 20px;
          background: #f9f9f9;
        }
        
        .subtotal-row,
        .shipping-row,
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        
        .subtotal-row,
        .shipping-row {
          color: #666;
          font-size: 14px;
        }
        
        .divider {
          height: 1px;
          background: #e0e0e0;
          margin: 12px 0;
        }
        
        .total-row {
          font-weight: 600;
          font-size: 16px;
          color: #333;
          margin-bottom: 0;
        }
        
        .total-amount {
          color: #d05278;
        }
        
        .empty-cart-message {
          padding: 30px 20px;
          text-align: center;
          color: #888;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        
        .empty-cart-message p {
          margin: 0;
          font-size: 15px;
        }
        
        .secure-checkout-notice {
          padding: 12px 20px;
          background: #f0f7f0;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #388e3c;
          font-size: 13px;
          border-top: 1px solid #e0efe0;
        }
        
        @media (max-width: 767px) {
          .order-items {
            max-height: 240px;
          }
          
          .item-image {
            width: 50px;
            height: 50px;
          }
        }
      `}</style>
    </div>
  );
};
