import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DeleteModal = ({ show, onClose, onConfirm, productName, isLoading }) => {
  if (!show) return null;

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <div className="delete-modal-header">
          <h3>Confirm Deletion</h3>
          <button className="close-button" onClick={onClose} disabled={isLoading}>
            <X size={24} />
          </button>
        </div>
        <div className="delete-modal-body">
          <div className="delete-modal-icon">
            <AlertTriangle size={48} color="#e74c3c" />
          </div>
          <p>Are you sure you want to delete <strong>{productName}</strong>?</p>
          <p className="delete-warning">This action cannot be undone.</p>
        </div>
        <div className="delete-modal-footer">
          <button className="cancel-btn" onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
          <button className="confirm-delete-btn" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal; 