import { useState } from 'react';
import { CheckoutOrders } from './CheckoutOrder/CheckoutOrders';
import { CheckoutStep1 } from './CheckoutSteps/CheckoutStep1';
import { CheckoutStep2 } from './CheckoutSteps/CheckoutStep2';
import { CheckoutStep3 } from './CheckoutSteps/CheckoutStep3';
import { useRouter } from 'next/router';
import { createOrder } from 'services/orderService';
import { useAuth } from 'context/AuthContext';
import { useCart } from 'context/CartContext';

export const Checkout = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [checkoutData, setCheckoutData] = useState({
    shipping: null,
    payment: null
  });
  const router = useRouter();
  const { user } = useAuth();
  const { cart, clearCart } = useCart();

  const handleNext = async (data) => {
    if (activeStep === 1) {
      setCheckoutData(prev => ({ ...prev, shipping: data }));
      setActiveStep(2);
    } else if (activeStep === 2) {
      try {
        // Store payment information before clearing the cart
        setCheckoutData(prev => ({ ...prev, payment: data }));
        
        // Calculate order total
        const orderTotal = cart.reduce((total, item) => 
          total + (Number(item.price) * Number(item.quantity)), 0
        );
        
        // Store cart items before clearing
        const cartItems = [...cart];
        
        const orderData = {
          items: cartItems,
          shippingInfo: checkoutData.shipping,
          totalAmount: orderTotal,
          paymentProof: data.paymentProof // Add payment proof file
        };

        // Create order in database
        const order = await createOrder(orderData);
        
        if (order) {
          localStorage.setItem('lastOrder', JSON.stringify({
            items: cartItems,
            total: orderTotal,
            orderNumber: order.orderNumber,
            orderDate: new Date().toISOString(),
            shippingInfo: checkoutData.shipping,
            paymentProofUrl: order.paymentProof // Store payment proof URL
          }));
          
          setActiveStep(3);
          clearCart();
        }
      } catch (error) {
        console.error('Error creating order:', error);
        alert('Failed to create order. Please try again.');
      }
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <>
      <div className='checkout-container'>
        {/* Steps indicator */}
        <div className='checkout-steps-indicator'>
          {[1, 2, 3].map(step => (
            <div 
              key={step} 
              className={`step-item ${activeStep >= step ? 'active' : ''} ${activeStep > step ? 'completed' : ''}`}
            >
              <div className="step-circle">
                {activeStep > step ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  step
                )}
              </div>
              <div className="step-label">
                {step === 1 ? 'Shipping' : step === 2 ? 'Payment' : 'Confirmation'}
              </div>
            </div>
          ))}
        </div>
        
        {/* Main checkout content */}
        <div className='checkout-main'>
          <div className='checkout-form-container'>
            {activeStep === 1 && (
              <CheckoutStep1 
                handleNext={handleNext} 
              />
            )}
            
            {activeStep === 2 && (
              <CheckoutStep2
                handleNext={handleNext}
                handleBack={handleBack}
              />
            )}
            
            {activeStep === 3 && (
              <CheckoutStep3 
                handleBack={handleBack}
              />
            )}
          </div>
          
          <div className='checkout-sidebar'>
            <CheckoutOrders activeStep={activeStep} />
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .checkout-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .checkout-steps-indicator {
          display: flex;
          justify-content: space-between;
          margin: 40px auto 60px;
          max-width: 600px;
          position: relative;
        }
        
        .checkout-steps-indicator::before {
          content: '';
          position: absolute;
          top: 16px;
          left: 0;
          right: 0;
          height: 2px;
          background-color: #e0e0e0;
          z-index: 0;
        }
        
        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 1;
          width: 100px;
        }
        
        .step-circle {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background-color: white;
          border: 2px solid #e0e0e0;
          color: #888;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          margin-bottom: 8px;
          transition: all 0.3s ease;
        }
        
        .step-label {
          font-size: 14px;
          color: #888;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .step-item.active .step-circle {
          background-color: #d05278;
          border-color: #d05278;
          color: white;
        }
        
        .step-item.active .step-label {
          color: #333;
          font-weight: 600;
        }
        
        .step-item.completed .step-circle {
          background-color: #4CAF50;
          border-color: #4CAF50;
          color: white;
        }
        
        .checkout-main {
          display: flex;
          gap: 30px;
          margin-bottom: 60px;
        }
        
        .checkout-form-container {
          flex: 1;
          min-width: 0;
        }
        
        .checkout-sidebar {
          width: 380px;
          flex-shrink: 0;
        }
        
        @media (max-width: 992px) {
          .checkout-main {
            flex-direction: column;
          }
          
          .checkout-sidebar {
            width: 100%;
            order: -1;
            margin-bottom: 30px;
          }
          
          .checkout-steps-indicator {
            margin: 30px auto 40px;
          }
        }
        
        @media (max-width: 768px) {
          .step-item {
            width: auto;
          }
          
          .step-label {
            font-size: 12px;
          }
        }
        
        @media (max-width: 480px) {
          .checkout-container {
            padding: 0 15px;
          }
          
          .checkout-steps-indicator {
            margin: 20px auto 30px;
          }
          
          .step-circle {
            width: 30px;
            height: 30px;
            font-size: 14px;
          }
        }
      `}</style>
    </>
  );
};
