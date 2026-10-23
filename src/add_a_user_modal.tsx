import React, { useState } from 'react';
import { dictionary, type LangCode } from './translations';
import hasAccess from './auth_roles';

// Define explicit types for the component's interactive handlers
interface addAUserModalProps {
  executionerRole: string;
  current_Lang: LangCode;
  onClose: () => void;
  onConfirm: (userEmail: string, userName: string, userPassword: string, userRole: string) => void;
}

export default function AddAUserModal({executionerRole, current_Lang, onClose, onConfirm }: addAUserModalProps) {
    
    const t = dictionary[current_Lang];

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
          <span className="modal-title-text">{t.add_a_user}</span>
          <button type="button" className="btn-close-modal" onClick={onClose}>
            &times;
          </button>
        </div>
        
        <form className="modalForm" onSubmit={handleSubmit}>
          
          <div className="form-group-row">
                <div className="form-input-block">
                    <label>{t.fieldEmail}</label>
                    <input type="text" value={userEmail} onChange={(e) => setUserEmail(e.target.value)}  />
                </div>
            </div>
          
          <div className="form-group-row">
                <div className="form-input-block">
                    <label>{t.fieldName}</label>
                    <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)}  />
                </div>
            </div>
            <div className="form-group-row">
                <div className="form-input-block">
                    <label>{t.fieldPassword}</label>
                    <input type="text" value={userPassword} onChange={(e) => setUserPassword(e.target.value)}  />
                </div>
            </div>
          
          <div className="form-group-row">
                <div className="form-input-block">
                    <label>User Role</label>
                    <select value={userRole} onChange={(e) => setUserRole(e.target.value)}>
                        {hasAccess(executionerRole, 'owner') && (
                          <option value={'owner'}>{t.role_owner}</option>
                        )}
                        {hasAccess(executionerRole, 'admin') && (
                          <option value={'admin'}>{t.role_admin}</option>
                        )}
                        <option value={'analyst'}>{t.role_analyst}</option>
                        <option value={'readonly'}>{t.role_readonly}</option>
                    </select>
                </div>
            </div>

          <div className="modal-footer" style={{ marginTop: '8px' }}>
            <div className='metrics-grid'>
                <button type="button" className="marketing-submit-btn" onClick={onClose}>
                {t.modalCloseBtn}
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