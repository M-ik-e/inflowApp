import React, { useState } from 'react';
import { dictionary, type LangCode } from './translations';
import hasAccess from './auth_roles';

// Define explicit types for the component's interactive handlers
interface changeUserRoleModalProps {
    executionerRole: string;
    current_Lang: LangCode;
    onClose: () => void;
    onConfirm: (confirmation: boolean, user_role: string) => void;
}

export default function ChangeUserRoleModal( {executionerRole, current_Lang, onClose, onConfirm }: changeUserRoleModalProps) {
    const t = dictionary[current_Lang];

    const [userRole, setUserRole] = useState('');
    
    const [confirmation, setConfirmation] = useState<boolean>(false);

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        console.log("Confirmation hit");
        setConfirmation(true);
        onConfirm(confirmation, userRole);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
        <div className="modal-window-card" onClick={(e) => e.stopPropagation()}>
            
            <div className="modal-header-row">
            <span className="modal-title-text">{t.confirmation_required}</span>
            <button type="button" className="btn-close-modal" onClick={onClose}>
                &times;
            </button>
            </div>
            
            <form className="modalForm" onSubmit={handleSubmit}>
            <h3 className="modal-title-text">
                {t.changeARole}
            </h3>

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
                        {t.cancel}
                    </button>
                    <button type="submit" className="marketing-submit-btn">
                        {t.confirm}
                    </button>
                </div>
            </div>
            </form>
            
        </div>
        </div>
    );
}