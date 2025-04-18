import { X, AlertTriangle } from 'lucide-react';

const DeleteConfirmPopup = ({ show, item, itemName, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div className="popup-overlay" onClick={onCancel}>
      <div className="delete-popup" onClick={e => e.stopPropagation()}>
        <div className="popup-icon">
          <AlertTriangle size={32} />
        </div>
        
        <h4>Delete {item}?</h4>
        
        <p>Are you sure you want to delete <strong>{itemName}</strong>?</p>
        <p className="warning-text">This action cannot be undone.</p>
        
        <div className="popup-actions">
          <button 
            className="cancel-btn" 
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            className="confirm-btn" 
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
        
        <button className="close-popup" onClick={onCancel}>
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmPopup; 