import React, { useState } from 'react';

// Define explicit types for the component's interactive handlers
interface PasswordModalProps {
  onClose: () => void;
  onConfirm: (oldPass: string, newPass: string) => void;
}

export default function PasswordChangeModal({ onClose, onConfirm }: PasswordModalProps) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      alert("Please fill out both fields.");
      return;
    }
    onConfirm(oldPassword, newPassword);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window-card" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header-row">
          <span className="modal-title-text">🔑 Change Password</span>
          <button type="button" className="btn-close-modal" onClick={onClose}>
            &times;
          </button>
        </div>
        
        <form className="modalForm" onSubmit={handleSubmit}>
          
          <div className="form-group-row">
                <div className="form-input-block">
                    <label>Current Password</label>
                    <input type="text" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}  />
                </div>
            </div>
          
          <div className="form-group-row">
                <div className="form-input-block">
                    <label>New Password</label>
                    <input type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}  />
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