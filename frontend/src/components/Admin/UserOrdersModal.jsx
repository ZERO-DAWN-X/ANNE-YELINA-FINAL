import React from 'react';
import { X, ExternalLink } from 'lucide-react';

const UserOrdersModal = ({ show, onClose, user, orders, isLoading }) => {
  if (!show) return null;

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="modal-overlay">
      <div className="user-orders-modal">
        <div className="modal-header">
          <h3>{user?.name}'s Orders</h3>
          <button className="close-button" onClick={onClose} disabled={isLoading}>
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-body">
          {isLoading ? (
            <div className="modal-loading">
              <div className="spinner"></div>
              <p>Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="no-orders">
              <p>This user has no orders yet.</p>
            </div>
          ) : (
            <div className="user-orders-list">
              {orders.map(order => (
                <div key={order.id} className="user-order-item">
                  <div className="order-left">
                    <h4>#{order.orderNumber}</h4>
                    <p className="order-date">{formatDate(order.createdAt)}</p>
                    <div className={`order-status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </div>
                  </div>
                  
                  <div className="order-right">
                    <div className="order-amount">${order.totalAmount.toFixed(2)}</div>
                    <a href="#" className="view-details" onClick={(e) => {
                      e.preventDefault();
                      onClose();
                      // Navigate to orders tab
                      window.dispatchEvent(new CustomEvent('navigateToOrder', { 
                        detail: { orderId: order.id } 
                      }));
                    }}>
                      <ExternalLink size={16} />
                      View Details
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserOrdersModal; 