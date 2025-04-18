import { useState } from 'react';

export const CheckoutStep2 = ({ handleNext, handleBack }) => {
  const [paymentProof, setPaymentProof] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };
  
  const processFile = (file) => {
    setPaymentProof(file);
    
    // Create preview URL for the uploaded image
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!paymentProof) {
      alert('Please upload payment proof');
      return;
    }
    
    // Create a payment object with all necessary info
    const paymentData = {
      paymentProof: paymentProof,
      paymentMethod: 'bank_transfer',
      paymentDate: new Date().toISOString()
    };
    
    // Pass the payment data to parent component
    handleNext(paymentData);
  };

  return (
    <div className="checkout-step-2">
      <div className="checkout-step-header">
        <h2>Payment Details</h2>
        <p>Please complete your payment and upload the proof</p>
      </div>
      
      {/* Bank Details Card */}
      <div className="bank-details-card">
        <div className="bank-card-header">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d05278" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2"></rect>
            <line x1="2" y1="10" x2="22" y2="10"></line>
          </svg>
          <h3>Bank Transfer Details</h3>
        </div>
        
        <div className="bank-details-content">
          <div className="bank-detail-row">
            <span className="detail-label">Bank Name:</span>
            <span className="detail-value">Anne Yelina Bank</span>
          </div>
          <div className="bank-detail-row">
            <span className="detail-label">Account Number:</span>
            <span className="detail-value">019020709480</span>
          </div>
          <div className="bank-detail-row">
            <span className="detail-label">Account Name:</span>
            <span className="detail-value">M.A.M DHARMASENA</span>
          </div>
          <div className="bank-detail-row">
            <span className="detail-label">Swift Code:</span>
            <span className="detail-value">ANNYEL123</span>
          </div>
        </div>
        
        <div className="bank-note">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e67700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p>Please transfer the total amount to the bank account above and upload your payment slip below.</p>
        </div>
      </div>
      
      {/* Upload Section */}
      <form onSubmit={handleSubmit}>
        <div className="upload-section">
          <h3>Upload Payment Proof</h3>
          
          <div 
            className={`upload-area ${isDragging ? 'dragging' : ''} ${previewUrl ? 'has-file' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input 
              type="file"
              id="payment-proof"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="file-input"
            />
            
            {previewUrl ? (
              <div className="file-preview">
                <img src={previewUrl} alt="Payment Proof" />
                <div className="file-info">
                  <span className="file-name">{paymentProof?.name}</span>
                  <span className="file-size">{(paymentProof?.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <label htmlFor="payment-proof" className="change-file-btn">
                  Change File
                </label>
              </div>
            ) : (
              <div className="upload-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#bbbbbb" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <h4>Drag and drop your file here</h4>
                <p>or</p>
                <label htmlFor="payment-proof" className="browse-btn">
                  Browse Files
                </label>
                <p className="file-types">Supported formats: JPG, PNG, PDF (Max: 5MB)</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            onClick={handleBack}
            className="back-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back
          </button>
          
          <button 
            type="submit" 
            className={`continue-btn ${!paymentProof ? 'disabled' : ''}`}
            disabled={!paymentProof}
          >
            Continue
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </form>
      
      <style jsx>{`
        .checkout-step-2 {
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
        
        .bank-details-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          overflow: hidden;
          margin-bottom: 30px;
        }
        
        .bank-card-header {
          background: #f9f9f9;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid #eee;
        }
        
        .bank-card-header h3 {
          margin: 0;
          font-size: 18px;
          color: #333;
        }
        
        .bank-details-content {
          padding: 24px;
        }
        
        .bank-detail-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .bank-detail-row:last-child {
          border-bottom: none;
        }
        
        .detail-label {
          color: #666;
          font-size: 15px;
        }
        
        .detail-value {
          font-weight: 600;
          color: #333;
          font-size: 15px;
        }
        
        .bank-note {
          background: #fff9eb;
          padding: 16px 24px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          border-top: 1px solid #f0e5d2;
        }
        
        .bank-note p {
          margin: 0;
          color: #664d03;
          font-size: 14px;
          line-height: 1.5;
        }
        
        .upload-section {
          margin-bottom: 30px;
        }
        
        .upload-section h3 {
          font-size: 18px;
          margin-bottom: 16px;
          color: #333;
        }
        
        .upload-area {
          border: 2px dashed #ddd;
          border-radius: 12px;
          padding: 36px 24px;
          text-align: center;
          transition: all 0.3s;
          background: #fafafa;
          position: relative;
        }
        
        .upload-area.dragging {
          border-color: #d05278;
          background: #fdf5f8;
        }
        
        .upload-area.has-file {
          border-style: solid;
          border-color: #d0d0d0;
          background: white;
        }
        
        .file-input {
          position: absolute;
          width: 0.1px;
          height: 0.1px;
          opacity: 0;
          overflow: hidden;
          z-index: -1;
        }
        
        .upload-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        
        .upload-placeholder h4 {
          margin: 0;
          font-size: 16px;
          color: #555;
        }
        
        .upload-placeholder p {
          margin: 0;
          color: #777;
          font-size: 14px;
        }
        
        .browse-btn {
          background: #d05278;
          color: white;
          padding: 10px 20px;
          border-radius: 6px;
          display: inline-block;
          margin: 8px 0;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s;
          font-size: 14px;
        }
        
        .browse-btn:hover {
          background: #b93d63;
        }
        
        .file-types {
          font-size: 12px !important;
          color: #999 !important;
          margin-top: 8px !important;
        }
        
        .file-preview {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        
        .file-preview img {
          max-width: 260px;
          max-height: 180px;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.12);
          object-fit: contain;
          background: white;
        }
        
        .file-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        
        .file-name {
          font-weight: 500;
          color: #333;
          font-size: 15px;
        }
        
        .file-size {
          color: #777;
          font-size: 13px;
        }
        
        .change-file-btn {
          background: #f0f0f0;
          color: #555;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .change-file-btn:hover {
          background: #e0e0e0;
        }
        
        .form-actions {
          display: flex;
          justify-content: space-between;
          gap: 20px;
        }
        
        .back-btn, .continue-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          border: none;
        }
        
        .back-btn {
          background: #f0f0f0;
          color: #555;
        }
        
        .back-btn:hover {
          background: #e0e0e0;
        }
        
        .continue-btn {
          background: #d05278;
          color: white;
        }
        
        .continue-btn:hover {
          background: #b93d63;
        }
        
        .continue-btn.disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        @media (max-width: 768px) {
          .bank-detail-row {
            flex-direction: column;
            gap: 4px;
          }
          
          .detail-value {
            font-size: 16px;
          }
          
          .form-actions {
            flex-direction: column;
          }
          
          .back-btn, .continue-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};
