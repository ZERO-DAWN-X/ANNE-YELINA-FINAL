import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DeleteUserModal = ({ show, onClose, onConfirm, userName, isLoading }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="delete-modal">
        <div className="modal-header">
          <h3>Confirm User Deletion</h3>
          <button className="close-button" onClick={onClose} disabled={isLoading}>
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="warning-icon">
            <AlertTriangle size={48} color="#e74c3c" />
          </div>
          <p>Are you sure you want to delete <strong>{userName}</strong>?</p>
          <p className="warning-text">This action cannot be undone. All user data will be permanently removed.</p>
        </div>
        
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
          <button className="confirm-delete-btn" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Deleting...' : 'Yes, Delete User'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal; 