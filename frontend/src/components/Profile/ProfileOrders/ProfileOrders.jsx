import { useState, useEffect } from 'react';
import { useAuth } from 'context/AuthContext';

export const ProfileOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/users/${user.id}/orders`);
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchOrders();
    }
  }, [user]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return '#f59e0b';
      case 'COMPLETED':
        return '#10b981';
      case 'CANCELLED':
        return '#ef4444';
      default:
        return '#666';
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </div>
        <h3>No Orders Yet</h3>
        <p>When you make a purchase, your orders will appear here.</p>
      </div>
    );
  }

  return (
    <div className="orders-container">
      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <div className="order-number">
              <span className="label">Order #</span>
              <span className="value">{order.orderNumber}</span>
            </div>
            <div 
              className="order-status"
              style={{ backgroundColor: `${getStatusColor(order.status)}15`, color: getStatusColor(order.status) }}
            >
              {order.status}
            </div>
          </div>

          <div className="order-details">
            <div className="order-info">
              <div className="info-item">
                <span className="label">Order Date</span>
                <span className="value">{formatDate(order.createdAt)}</span>
              </div>
              <div className="info-item">
                <span className="label">Total Amount</span>
                <span className="value">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="order-items">
              {JSON.parse(order.items).map((item, index) => (
                <div key={index} className="item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <div className="item-price">
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      <style jsx>{`
        .orders-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .order-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          overflow: hidden;
        }

        .order-header {
          padding: 16px 20px;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .order-number {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .order-number .label {
          color: #666;
          font-size: 14px;
        }

        .order-number .value {
          font-weight: 600;
          color: #333;
        }

        .order-status {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
        }

        .order-details {
          padding: 20px;
        }

        .order-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-item .label {
          color: #666;
          font-size: 13px;
        }

        .info-item .value {
          color: #333;
          font-weight: 500;
        }

        .order-items {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px;
          background: #f9f9f9;
          border-radius: 8px;
        }

        .item-image {
          width: 50px;
          height: 50px;
          border-radius: 6px;
          overflow: hidden;
          background: white;
          border: 1px solid #eee;
        }

        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .item-details {
          flex: 1;
          min-width: 0;
        }

        .item-details h4 {
          margin: 0 0 4px;
          font-size: 14px;
          color: #333;
        }

        .item-details p {
          margin: 0;
          font-size: 13px;
          color: #666;
        }

        .item-price {
          font-weight: 600;
          color: #333;
        }

        .loading-state {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        .spinner {
          width: 30px;
          height: 30px;
          border: 2px solid #f0f0f0;
          border-top-color: #d05278;
          border-radius: 50%;
          margin: 0 auto 12px;
          animation: spin 1s linear infinite;
        }

        .empty-state {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        .empty-icon {
          margin-bottom: 16px;
        }

        .empty-state h3 {
          margin: 0 0 8px;
          color: #333;
        }

        .empty-state p {
          margin: 0;
          color: #666;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .order-info {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .item {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .item-price {
            align-self: flex-end;
          }
        }
      `}</style>
    </div>
  );
};
