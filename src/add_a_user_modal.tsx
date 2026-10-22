import React, { useState } from 'react';

// Define explicit types for the component's interactive handlers
interface addAUserModalProps {
  onClose: () => void;
  onConfirm: (userEmail: string, userName: string, userPassword: string, userRole: string) => void;
}

export default function AddAUserModal({ onClose, onConfirm }: addAUserModalProps) {
    const [userRole, setUserRole] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    onConfirm(userEmail, userName, userPassword, userRole);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window-card" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header-row">
          <span className="modal-title-text">Add a user</span>
          <button type="button" className="btn-close-modal" onClick={onClose}>
            &times;
          </button>
        </div>
        
        <form className="modalForm" onSubmit={handleSubmit}>
          
          <div className="form-group-row">
                <div className="form-input-block">
                    <label>User Email</label>
                    <input type="text" value={userEmail} onChange={(e) => setUserEmail(e.target.value)}  />
                </div>
            </div>
          
          <div className="form-group-row">
                <div className="form-input-block">
                    <label>User Name</label>
                    <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)}  />
                </div>
            </div>
            <div className="form-group-row">
                <div className="form-input-block">
                    <label>User Password</label>
                    <input type="text" value={userPassword} onChange={(e) => setUserPassword(e.target.value)}  />
                </div>
            </div>
          
          <div className="form-group-row">
                <div className="form-input-block">
                    <label>User Role</label>
                    <input type="text" value={userRole} onChange={(e) => setUserRole(e.target.value)}  />
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