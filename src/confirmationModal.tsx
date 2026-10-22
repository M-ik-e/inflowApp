import React, { useState } from 'react';

// Define explicit types for the component's interactive handlers
interface ConfirmationModalProps {
    clickSource: string;
    onClose: () => void;
    onConfirm: (confirmation: boolean) => void;
}

export default function ConfirmationModal({onClose, onConfirm }: ConfirmationModalProps) {
    const [confirmation, setConfirmation] = useState<boolean>(false);


    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        console.log("Confirmation hit");
        setConfirmation(true);
        onConfirm(confirmation);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
        <div className="modal-window-card" onClick={(e) => e.stopPropagation()}>
            
            <div className="modal-header-row">
            <span className="modal-title-text">Confirmation Required</span>
            <button type="button" className="btn-close-modal" onClick={onClose}>
                &times;
            </button>
            </div>
            
            <form className="modalForm" onSubmit={handleSubmit}>
            <h3 className="modal-title-text">
                Please confirm action
            </h3>
            
            <div className="modal-footer" style={{ marginTop: '8px' }}>
                <div className='metrics-grid'>
                    <button type="button" className="marketing-submit-btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="submit" className="marketing-submit-btn">
                        Confirm
                    </button>
                </div>
            </div>
            </form>
            
        </div>
        </div>
    );
}