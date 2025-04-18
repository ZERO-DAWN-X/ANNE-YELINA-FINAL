import { useState } from 'react';
import { OrderDetails } from './OrderDetails';

const Orders = () => {
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <div className="order-card">
      {/* ... existing order info ... */}
      
      {/* Add Payment Proof Preview */}
      <div style={{
        marginTop: '16px',
        padding: '16px',
        borderTop: '1px solid #eee'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '12px'
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <span style={{ fontSize: '14px', color: '#666' }}>Payment Proof</span>
        </div>

        {order.paymentProof ? (
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid #eee'
          }}>
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}${order.paymentProof}`}
              alt="Payment Proof"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                cursor: 'pointer'
              }}
              onClick={() => {
                // Open OrderDetails modal or expand image
                setSelectedOrder(order);
                setShowOrderDetails(true);
              }}
            />
          </div>
        ) : (
          <div style={{
            padding: '12px',
            backgroundColor: '#f9fafb',
            borderRadius: '6px',
            fontSize: '13px',
            color: '#666',
            textAlign: 'center'
          }}>
            No payment proof available
          </div>
        )}
      </div>
    </div>
  );
};

{/* Add OrderDetails Modal */}
{showOrderDetails && selectedOrder && (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  }}>
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      width: '100%',
      maxWidth: '800px',
      maxHeight: '90vh',
      overflow: 'auto'
    }}>
      <OrderDetails order={selectedOrder} />
      <div style={{
        padding: '16px',
        borderTop: '1px solid #eee',
        textAlign: 'right'
      }}>
        <button
          onClick={() => setShowOrderDetails(false)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f3f4f6',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            color: '#374151'
          }}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)} 