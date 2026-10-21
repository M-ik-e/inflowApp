import React, { useState } from 'react';

// Define explicit types for the component's interactive handlers
interface AccountModalProps {
  onClose: () => void;
  onConfirm: (companyName: string) => void;
}

export default function AccountCreateModal({ onClose, onConfirm }: AccountModalProps) {
  const [companyName, setCompanyName] = useState('');

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    onConfirm(companyName);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window-card" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header-row">
          <span className="modal-title-text">Create an account</span>
          <button type="button" className="btn-close-modal" onClick={onClose}>
            &times;
          </button>
        </div>
        
        <form className="modalForm" onSubmit={handleSubmit}>
          
          <div className="form-group-row">
                <div className="form-input-block">
                    <label>Company Name</label>
                    <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
                </div>
            </div>

          <div className="modal-footer" style={{ marginTop: '8px' }}>
            <div className='metrics-grid'>
                <button type="button" className="marketing-submit-btn" onClick={onClose}>
                Cancel
                </button>
                <button type="submit" className="marketing-submit-btn">
                OK
                </button>
            </div>
          </div>
        </form>
        
      </div>
    </div>
  );
}