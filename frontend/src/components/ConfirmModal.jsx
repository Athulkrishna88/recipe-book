import React from 'react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, isProcessing }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel} id="confirm-modal">
      <div
        className="modal-content"
        style={{ maxWidth: '440px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-body confirm-box">
          <div className="confirm-icon">⚠️</div>
          <h3 className="modal-title" style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>
            {title || 'Are you sure?'}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
            {message || 'This action cannot be undone. Are you sure you want to proceed?'}
          </p>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'center' }}>
          <button
            type="button"
            className="btn btn-secondary"
            id="cancel-confirm-btn"
            onClick={onCancel}
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            id="accept-confirm-btn"
            onClick={onConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
