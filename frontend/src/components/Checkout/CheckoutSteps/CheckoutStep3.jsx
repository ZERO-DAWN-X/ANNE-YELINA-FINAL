import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useCart } from 'context/CartContext';

export const CheckoutStep3 = ({ handleNext, handleBack }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();
  const { cart } = useCart();
  const [orderDetails, setOrderDetails] = useState({
    items: [],
    subtotal: 0,
    total: 0,
    orderNumber: '',
    orderDate: '',
    deliveryDate: ''
  });
  
  // Initialize order details on component mount
  useEffect(() => {
    // Try to get the last order from localStorage
    const savedOrder = localStorage.getItem('lastOrder');
    if (savedOrder) {
      try {
        const orderData = JSON.parse(savedOrder);
        
        // Format dates
        const orderDate = new Date(orderData.orderDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        
        const deliveryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        
        setOrderDetails({
          items: orderData.items || [],
          subtotal: orderData.total || 0,
          total: orderData.total || 0,
          orderNumber: orderData.orderNumber || '',
          orderDate: orderDate,
          deliveryDate: deliveryDate
        });
      } catch (error) {
        console.error('Error parsing saved order:', error);
        initializeEmptyOrder();
      }
    } else {
      initializeEmptyOrder();
    }
  }, []);

  // Helper function to initialize with empty order if no saved order exists
  const initializeEmptyOrder = () => {
    // Generate random order details for demo
    const orderNumber = `AY-${Math.floor(Math.random() * 100000)}`;
    const orderDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const deliveryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Get cart data from localStorage if cart is empty
    let cartItems = cart;
    let subtotal = 0;
    
    if (cartItems.length === 0) {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          cartItems = JSON.parse(savedCart);
          subtotal = cartItems.reduce(
            (total, item) => total + (Number(item.price) * Number(item.quantity)), 
            0
          );
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    } else {
      subtotal = cartItems.reduce(
        (total, item) => total + (Number(item.price) * Number(item.quantity)), 
        0
      );
    }
    
    setOrderDetails({
      items: cartItems,
      subtotal,
      total: subtotal,
      orderNumber,
      orderDate,
      deliveryDate
    });
  };

  const handleDownloadInvoice = async () => {
    setIsGenerating(true);
    try {
      const { default: jsPDF } = await import('jspdf');
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      
      // Get customer data from localStorage
      const savedOrder = localStorage.getItem('lastOrder');
      const orderData = savedOrder ? JSON.parse(savedOrder) : {};
      const shippingInfo = orderData.shippingInfo || {};
      
      // ========== HEADER ==========
      // Modern header with subtle gradient
      doc.setFillColor(208, 82, 120); // #d05278 - Main brand color
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      // Add subtle design element - small circles
      doc.setFillColor(255, 255, 255, 0.1); // White with opacity
      for (let i = 0; i < 6; i++) {
        const circleSize = 40;
        doc.circle(pageWidth + 10 - (i * 25), 20, circleSize, 'F');
      }
      
      // Logo/Brand Name
      doc.setFont("helvetica", "bold");
      doc.setFontSize(28);
      doc.setTextColor(255, 255, 255);
      doc.text("ANNE YELINA", margin, 25);
      
      // Add small invoice title in top right
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255, 0.9);
      doc.text("INVOICE", pageWidth - margin, 15, { align: "right" });
      
      // ========== INVOICE INFO SECTION ==========
      const infoStartY = 50;
      
      // Invoice title 
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(60, 60, 60);
      doc.text("Invoice", margin, infoStartY);
      
      // Invoice details and dates - left side
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(90, 90, 90);
      
      // Invoice box
      const invoiceBoxY = infoStartY + 5;
      const invoiceBoxHeight = 30;
      doc.setFillColor(248, 248, 248);
      doc.roundedRect(margin, invoiceBoxY, 75, invoiceBoxHeight, 3, 3, 'F');
      
      // Invoice number and date
      doc.setFont("helvetica", "bold");
      doc.setTextColor(70, 70, 70);
      doc.text("Invoice Number:", margin + 5, invoiceBoxY + 8);
      doc.text("Invoice Date:", margin + 5, invoiceBoxY + 16);
      doc.text("Order Status:", margin + 5, invoiceBoxY + 24);
      
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      doc.text(orderDetails.orderNumber, margin + 40, invoiceBoxY + 8);
      doc.text(orderDetails.orderDate, margin + 40, invoiceBoxY + 16);
      doc.text("Paid", margin + 40, invoiceBoxY + 24);
      
      // ========== CUSTOMER INFO ==========
      // Customer info box - right side
      const customerBoxX = pageWidth - margin - 75;
      doc.setFillColor(248, 248, 248);
      doc.roundedRect(customerBoxX, invoiceBoxY, 75, invoiceBoxHeight + 15, 3, 3, 'F');
      
      // Safely format customer info with fallbacks
      const customerName = shippingInfo.firstName && shippingInfo.lastName ? 
        `${shippingInfo.firstName} ${shippingInfo.lastName}` : 'N/A';
      const customerEmail = shippingInfo.email || 'N/A';
      const customerPhone = shippingInfo.phone || 'N/A';
      const customerAddress = shippingInfo.address || 'N/A';
      const customerLocation = shippingInfo.city && shippingInfo.country ? 
        `${shippingInfo.city}, ${shippingInfo.country}` : 'N/A';
      const customerPostal = shippingInfo.postalCode || 'N/A';
      
      // Title
      doc.setFont("helvetica", "bold");
      doc.setTextColor(70, 70, 70);
      doc.text("BILL TO:", customerBoxX + 5, invoiceBoxY + 8);
      
      // Customer details
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      doc.text(customerName, customerBoxX + 5, invoiceBoxY + 16);
      doc.text(customerEmail, customerBoxX + 5, invoiceBoxY + 24);
      doc.text(customerAddress, customerBoxX + 5, invoiceBoxY + 32);
      doc.text(`${customerLocation} ${customerPostal}`, customerBoxX + 5, invoiceBoxY + 40);
      
      // ========== ITEMS TABLE ==========
      const tableStartY = invoiceBoxY + invoiceBoxHeight + 25;
      
      // Table header
      doc.setFillColor(248, 248, 248);
      doc.roundedRect(margin, tableStartY, pageWidth - (margin * 2), 10, 2, 2, 'F');
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(70, 70, 70);
      
      // Table header columns
      doc.text("PRODUCT", margin + 5, tableStartY + 6.5);
      doc.text("QTY", pageWidth - margin - 65, tableStartY + 6.5);
      doc.text("PRICE", pageWidth - margin - 45, tableStartY + 6.5);
      doc.text("TOTAL", pageWidth - margin - 20, tableStartY + 6.5);
      
      // Table rows
      let y = tableStartY + 15;
      let calculatedSubtotal = 0;
      
      orderDetails.items.forEach((item, index) => {
        // Add zebra striping for better readability
        if (index % 2 === 1) {
          doc.setFillColor(252, 252, 252);
          doc.rect(margin, y - 5, pageWidth - (margin * 2), 10, 'F');
        }
        
        const name = item.name ? item.name.substring(0, 50) : 'Unnamed Product';
        const price = Number(item.price).toFixed(2);
        const qty = Number(item.quantity);
        const itemTotal = (qty * Number(price)).toFixed(2);
        
        calculatedSubtotal += Number(itemTotal);
        
        // Item details
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(60, 60, 60);
        doc.text(name, margin + 5, y);
        doc.text(qty.toString(), pageWidth - margin - 65, y);
        doc.text(`$${price}`, pageWidth - margin - 45, y);
        
        // Item total with right alignment
        doc.text(`$${itemTotal}`, pageWidth - margin - 5, y, { align: 'right' });
        
        y += 10;
      });
      
      // ========== TOTALS SECTION ==========
      // Draw a line above totals
      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(0.5);
      doc.line(pageWidth - margin - 75, y + 5, pageWidth - margin, y + 5);
      
      y += 15;
      
      // Subtotal
      doc.setFont("helvetica", "normal");
      doc.setTextColor(70, 70, 70);
      doc.text("Subtotal:", pageWidth - margin - 75, y);
      doc.text(`$${calculatedSubtotal.toFixed(2)}`, pageWidth - margin - 5, y, { align: 'right' });
      
      // Total with brand color background
      y += 10;
      doc.setFillColor(208, 82, 120, 0.9);
      doc.roundedRect(pageWidth - margin - 75, y - 7, 75, 14, 2, 2, 'F');
      
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text("TOTAL:", pageWidth - margin - 70, y);
      doc.text(`$${orderDetails.total.toFixed(2)}`, pageWidth - margin - 8, y, { align: 'right' });
      
      // ========== PAID WATERMARK ==========
      // Add "PAID" watermark
      doc.saveGraphicsState();
      doc.setGState(new doc.GState({ opacity: 0.08 }));
      doc.setFont("helvetica", "bold");
      doc.setFontSize(80);
      doc.setTextColor(208, 82, 120);
      doc.text("PAID", pageWidth/2, pageHeight/2, { 
        align: "center", 
        angle: 35 
      });
      doc.restoreGraphicsState();
      
      // ========== THANK YOU SECTION ==========
      // Footer with thank you note
      const footerY = pageHeight - 25;
      
      // Footer background
      doc.setFillColor(248, 248, 248);
      doc.rect(0, footerY - 15, pageWidth, 30, 'F');
      
      // Add small brand accent
      doc.setFillColor(208, 82, 120);
      doc.rect(0, footerY - 15, pageWidth, 3, 'F');
      
      // Thank you text
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(70, 70, 70);
      doc.text("Thank you for shopping with us!", pageWidth/2, footerY, { align: "center" });
      
      // Contact info
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text("www.anneyelina.com | support@anneyelina.com | +1 (800) 555-0123", pageWidth/2, footerY + 8, { align: "center" });
      
      // Wait a moment to simulate processing and then save
      setTimeout(() => {
        setIsGenerating(false);
        doc.save(`anne-yelina-invoice-${orderDetails.orderNumber}.pdf`);
      }, 1500);
      
      return doc;
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Failed to generate invoice. Please try again.');
      setIsGenerating(false);
    }
  };

  const handleContinueShopping = () => {
    router.push('/shop');
  };

  return (
    <div className="checkout-step-3">
      <div className="success-header">
        <div className="success-icon">
          <svg viewBox="0 0 24 24" width="50" height="50" stroke="#d05278" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h2>Thank you for your order!</h2>
        <p>Your order has been placed successfully. We've sent a confirmation to your email.</p>
      </div>
      
      <div className="order-details-card">
        <h3 className="card-title">Order Summary</h3>
        
        <div className="order-info">
          <div className="info-row">
            <span className="info-label">Order Number:</span>
            <span className="info-value">{orderDetails.orderNumber}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Order Date:</span>
            <span className="info-value">{orderDetails.orderDate}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Order Status:</span>
            <span className="info-value status-pending">Processing</span>
          </div>
          <div className="info-row">
            <span className="info-label">Estimated Delivery:</span>
            <span className="info-value">{orderDetails.deliveryDate}</span>
          </div>
        </div>
        
        <div className="order-items">
          <h4>Items in Your Order</h4>
          
          <div className="items-list">
            {orderDetails.items.map((item, index) => (
              <div key={index} className="order-item">
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="item-details">
                  <h5>{item.name}</h5>
                  <div className="item-meta">
                    <span className="item-quantity">Qty: {item.quantity}</span>
                    <span className="item-price">${(Number(item.price) * Number(item.quantity)).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="order-total">
            <span>Total Amount:</span>
            <span>${orderDetails.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="invoice-section">
        <div className="invoice-info">
          <div className="invoice-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="#d05278" strokeWidth="2" fill="none">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <div>
            <h4>Download Your Invoice</h4>
            <p>Get a PDF copy of your invoice for your records</p>
          </div>
        </div>
        
        <button 
          onClick={handleDownloadInvoice} 
          className={`download-btn ${isGenerating ? 'generating' : ''}`}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <div className="spinner"></div>
              Generating...
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download Invoice
            </>
          )}
        </button>
      </div>
      
      <div className="next-steps">
        <button onClick={handleContinueShopping} className="continue-shopping-btn">
          Continue Shopping
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
      
      <style jsx>{`
        .checkout-step-3 {
          max-width: 800px;
          margin: 0 auto;
          padding-bottom: 60px;
        }
        
        .success-header {
          text-align: center;
          margin-bottom: 40px;
        }
        
        .success-icon {
          width: 100px;
          height: 100px;
          background: rgba(208, 82, 120, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
        }
        
        .success-header h2 {
          font-size: 28px;
          margin-bottom: 12px;
          color: #333;
        }
        
        .success-header p {
          color: #666;
          font-size: 16px;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .order-details-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          overflow: hidden;
          margin-bottom: 30px;
        }
        
        .card-title {
          background: #f9f9f9;
          padding: 20px 24px;
          margin: 0;
          font-size: 18px;
          color: #333;
          border-bottom: 1px solid #eee;
        }
        
        .order-info {
          padding: 24px;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
        }
        
        .info-label {
          color: #666;
          font-size: 15px;
        }
        
        .info-value {
          font-weight: 600;
          color: #333;
          font-size: 15px;
        }
        
        .status-pending {
          color: #f59e0b;
        }
        
        .order-items {
          padding: 24px;
        }
        
        .order-items h4 {
          margin-top: 0;
          margin-bottom: 20px;
          font-size: 16px;
          color: #333;
        }
        
        .items-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }
        
        .order-item {
          display: flex;
          gap: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .order-item:last-child {
          border-bottom: none;
        }
        
        .item-image {
          width: 60px;
          height: 60px;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid #eee;
        }
        
        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .item-details {
          flex: 1;
        }
        
        .item-details h5 {
          margin: 0 0 8px 0;
          font-size: 15px;
          color: #333;
        }
        
        .item-meta {
          display: flex;
          justify-content: space-between;
          color: #666;
          font-size: 14px;
        }
        
        .order-total {
          display: flex;
          justify-content: space-between;
          padding-top: 16px;
          margin-top: 16px;
          border-top: 1px solid #eee;
          font-size: 18px;
          font-weight: 600;
        }
        
        .order-total span:last-child {
          color: #d05278;
        }
        
        .invoice-section {
          background: #f5f8ff;
          border-radius: 12px;
          padding: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 36px;
        }
        
        .invoice-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .invoice-icon {
          width: 50px;
          height: 50px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0,0,0,0.08);
        }
        
        .invoice-info h4 {
          margin: 0 0 6px 0;
          font-size: 16px;
          color: #333;
        }
        
        .invoice-info p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }
        
        .download-btn {
          background: #4a7bff;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px 20px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .download-btn:hover {
          background: #3464e0;
        }
        
        .download-btn.generating {
          background: #6c8ad6;
          cursor: wait;
        }
        
        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        .next-steps {
          text-align: center;
        }
        
        .continue-shopping-btn {
          background: #d05278;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 14px 28px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        
        .continue-shopping-btn:hover {
          background: #b93d63;
        }
        
        @media (max-width: 768px) {
          .invoice-section {
            flex-direction: column;
            gap: 20px;
            align-items: flex-start;
          }
          
          .download-btn {
            width: 100%;
            justify-content: center;
          }
          
          .info-row {
            flex-direction: column;
            gap: 4px;
            margin-bottom: 8px;
          }
          
          .info-value {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
};