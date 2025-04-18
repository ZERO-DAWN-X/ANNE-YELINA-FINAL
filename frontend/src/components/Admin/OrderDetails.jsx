import { useState, useEffect } from 'react';

export const OrderDetails = ({ order, onClose = () => {} }) => {
  const [showFullImage, setShowFullImage] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Animation mount effect
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Handle click outside
  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Smooth closing animation
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // Parse order items
  const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
  const shippingInfo = typeof order.shippingInfo === 'string' ? JSON.parse(order.shippingInfo) : order.shippingInfo;

  // Status styles
  const getStatusStyle = (status) => {
    const styles = {
      COMPLETED: {
        bg: 'rgba(16, 185, 129, 0.1)',
        color: '#059669',
        icon: (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        )
      },
      PENDING: {
        bg: 'rgba(245, 158, 11, 0.1)',
        color: '#d97706',
        icon: (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
        )
      },
      CANCELLED: {
        bg: 'rgba(239, 68, 68, 0.1)',
        color: '#dc2626',
        icon: (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M15 9l-6 6M9 9l6 6"/>
          </svg>
        )
      }
    };
    return styles[status] || styles.PENDING;
  };

  const statusStyle = getStatusStyle(order.status);

  return (
    <div 
      onClick={handleOutsideClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease',
        zIndex: 1000
      }}
    >
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflow: 'auto',
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'transform 0.3s ease',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
      }}>
        {/* Premium Header */}
        <div style={{
          position: 'sticky',
          top: 0,
          backgroundColor: '#fff',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          padding: '24px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 1
        }}>
          <div>
            <h2 style={{
              margin: '0',
              fontSize: '24px',
              fontWeight: '600',
              color: '#111827',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{
                padding: '8px',
                backgroundColor: '#f3f4f6',
                borderRadius: '8px',
                color: '#6b7280'
              }}>#{order.orderNumber}</span>
            </h2>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '20px',
              backgroundColor: statusStyle.bg,
              color: statusStyle.color,
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {statusStyle.icon}
              {order.status}
            </div>
            
            <button
              onClick={handleClose}
              style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                backgroundColor: '#f3f4f6',
                borderRadius: '8px',
                cursor: 'pointer',
                color: '#6b7280',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#e5e7eb';
                e.currentTarget.style.color = '#374151';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                e.currentTarget.style.color = '#6b7280';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div style={{
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px'
        }}>
          {/* Info Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px'
          }}>
            {/* Customer Info Card */}
            <InfoCard
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              }
              title="Customer"
              content={
                <>
                  <p style={{ margin: '0', fontSize: '15px', color: '#111827', fontWeight: '500' }}>
                    {order.user?.name || 'Guest Customer'}
                  </p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
                    {order.user?.email || 'N/A'}
                  </p>
                </>
              }
            />

            {/* Shipping Info Card */}
            <InfoCard
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              }
              title="Shipping Address"
              content={
                shippingInfo && (
                  <div style={{ fontSize: '14px', color: '#374151' }}>
                    <p style={{ margin: '0', fontWeight: '500' }}>{shippingInfo.address}</p>
                    <p style={{ margin: '4px 0 0 0' }}>{shippingInfo.city}, {shippingInfo.state}</p>
                    <p style={{ margin: '4px 0 0 0' }}>{shippingInfo.zipCode}</p>
                    <p style={{ margin: '4px 0 0 0', color: '#6b7280' }}>{shippingInfo.phone}</p>
                  </div>
                )
              }
            />

            {/* Order Summary Card */}
            <InfoCard
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 17h6M9 12h6M9 7h6M3 17V3h18v14M3 21h18"/>
                </svg>
              }
              title="Order Summary"
              content={
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#6b7280' }}>
                    <span>Subtotal</span>
                    <span>${order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#6b7280' }}>
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div style={{
                    marginTop: '8px',
                    paddingTop: '12px',
                    borderTop: '1px dashed #e5e7eb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#111827'
                  }}>
                    <span>Total</span>
                    <span>${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              }
            />
          </div>

          {/* Items Section */}
          <div>
            <h3 style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              color: '#374151',
              fontWeight: '600'
            }}>Order Items</h3>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {items.map((item, index) => (
                <OrderItem key={index} item={item} />
              ))}
            </div>
          </div>

          {/* Payment Proof Section */}
          <PaymentProofSection
            paymentProof={order.paymentProof}
            onViewImage={() => setShowFullImage(true)}
          />
        </div>
      </div>

      {/* Image Modal */}
      {showFullImage && (
        <ImageModal
          imageUrl={`${process.env.NEXT_PUBLIC_API_URL}${order.paymentProof}`}
          onClose={() => setShowFullImage(false)}
        />
      )}
    </div>
  );
};

// Helper Components
const InfoCard = ({ icon, title, content }) => (
  <div style={{
    padding: '24px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
    }
  }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '16px'
    }}>
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        backgroundColor: '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#6b7280'
      }}>
        {icon}
      </div>
      <h3 style={{
        margin: 0,
        fontSize: '15px',
        fontWeight: '600',
        color: '#374151'
      }}>{title}</h3>
    </div>
    {content}
  </div>
);

const OrderItem = ({ item }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    transition: 'transform 0.2s ease',
    ':hover': {
      transform: 'translateY(-2px)'
    }
  }}>
    <div style={{
      width: '64px',
      height: '64px',
      borderRadius: '8px',
      overflow: 'hidden',
      marginRight: '16px',
      border: '1px solid #f3f4f6'
    }}>
      <img
        src={item.image}
        alt={item.name}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
    </div>
    <div style={{ flex: 1 }}>
      <h4 style={{
        margin: '0 0 4px 0',
        fontSize: '15px',
        fontWeight: '500',
        color: '#111827'
      }}>{item.name}</h4>
      <p style={{
        margin: '0',
        fontSize: '14px',
        color: '#6b7280'
      }}>Quantity: {item.quantity}</p>
    </div>
    <div style={{
      fontSize: '15px',
      fontWeight: '600',
      color: '#111827'
    }}>
      ${(item.price * item.quantity).toFixed(2)}
    </div>
  </div>
);

const PaymentProofSection = ({ paymentProof, onViewImage }) => (
  <div style={{
    backgroundColor: '#f9fafb',
    borderRadius: '12px',
    padding: '24px'
  }}>
    <h3 style={{
      margin: '0 0 20px 0',
      fontSize: '16px',
      color: '#374151',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="17 8 12 3 7 8"/>
        <line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
      Payment Proof
    </h3>

    {paymentProof ? (
      <div style={{
        position: 'relative',
        backgroundColor: '#fff',
        padding: '16px',
        borderRadius: '12px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '300px',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
        }}>
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}${paymentProof}`}
            alt="Payment Proof"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              cursor: 'pointer',
              transition: 'transform 0.3s ease'
            }}
            onClick={onViewImage}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        </div>
      </div>
    ) : (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        backgroundColor: '#fff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        color: '#6b7280'
      }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" style={{ marginBottom: '12px' }}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        <p style={{ margin: 0, fontSize: '15px' }}>No payment proof uploaded</p>
      </div>
    )}
  </div>
);

const ImageModal = ({ imageUrl, onClose }) => (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.9)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      opacity: 1,
      transition: 'opacity 0.3s ease'
    }}
    onClick={onClose}
  >
    <div style={{
      position: 'relative',
      maxWidth: '90%',
      maxHeight: '90vh',
      transform: 'scale(1)',
      transition: 'transform 0.3s ease'
    }}>
      <img
        src={imageUrl}
        alt="Payment Proof"
        style={{
          maxWidth: '100%',
          maxHeight: '90vh',
          objectFit: 'contain',
          borderRadius: '8px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
        }}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  </div>
); 