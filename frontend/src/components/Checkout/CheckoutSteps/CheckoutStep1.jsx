import { useAuth } from 'context/AuthContext';
import { useState, useEffect } from 'react';

export const CheckoutStep1 = ({ handleNext }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    postalCode: ''
  });

  // Auto-populate form with user data when available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ')[1] || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address?.street || '',
        city: user.address?.city || '',
        country: user.address?.country || '',
        postalCode: user.address?.postalCode || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleNext(formData);
  };

  return (
    <div className="checkout-step-1">
      <div className="checkout-step-header">
        <h2>Shipping Information</h2>
        <p>Please enter your shipping details</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              placeholder="Enter your first name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              placeholder="Enter your last name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Enter your street address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              placeholder="Enter your city"
            />
          </div>

          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              placeholder="Enter your country"
            />
          </div>

          <div className="form-group">
            <label htmlFor="postalCode">Postal Code</label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              required
              placeholder="Enter postal code"
            />
          </div>
        </div>

        <div className="form-footer">
          <button type="submit" className="btn-continue">
            Continue to Payment
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </form>
      
      <style jsx>{`
        .checkout-step-1 {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .checkout-step-header {
          margin-bottom: 36px;
          text-align: center;
        }
        
        .checkout-step-header h2 {
          font-size: 28px;
          margin-bottom: 8px;
          color: #333;
        }
        
        .checkout-step-header p {
          color: #666;
          font-size: 16px;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
        }
        
        .form-group.full-width {
          grid-column: span 2;
        }
        
        label {
          margin-bottom: 8px;
          font-weight: 500;
          color: #444;
          font-size: 14px;
        }
        
        input {
          padding: 12px 16px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 15px;
          transition: all 0.3s;
        }
        
        input:focus {
          outline: none;
          border-color: #d05278;
          box-shadow: 0 0 0 3px rgba(208, 82, 120, 0.1);
        }
        
        input::placeholder {
          color: #999;
        }
        
        .form-footer {
          display: flex;
          justify-content: flex-end;
          margin-top: 16px;
        }
        
        .btn-continue {
          background: #d05278;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .btn-continue:hover {
          background: #b93d63;
        }
        
        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .form-group.full-width {
            grid-column: span 1;
          }
        }
      `}</style>
    </div>
  );
};
