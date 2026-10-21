import { useState } from 'react';

interface ApiModalProps {
  apiError: string | null;
  apiSuccessData: any; // Replace 'any' with your actual API type if available
  onClose: () => void;
}

export default function ApiResultModal({ apiError, apiSuccessData, onClose }: ApiModalProps) {
  // If there is no data and no error, do not render the modal at all
  if (!apiError && !apiSuccessData) return null;

  return (
    /* 1. Modal Overlay Backdrop */
    <div 
      onClick={onClose} // Closes modal if clicking outside the window box
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
    >
      {/* 2. Modal Content Container Box */}
      <div 
        onClick={(e) => e.stopPropagation()} // Prevents clicks inside the box from closing the modal
        style={{
          backgroundColor: '#1e1e1e', // Dark theme background matching code blocks
          color: '#ffffff',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '650px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '85vh',
          border: '1px solid #333'
        }}
      >
        {/* 3. Modal Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '15px 20px',
          borderBottom: '1px solid #333'
        }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
            {apiError ? '❌ Execution Failed' : '🚀 Execution Results'}
          </h3>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#aaa',
              fontSize: '1.5rem',
              cursor: 'pointer',
              lineHeight: 1
            }}
          >
            &times;
          </button>
        </div>

        {/* 4. Modal Body Panel */}
        <div style={{ padding: '20px', overflowY: 'auto' }}>
          {/* Error View Block */}
          {apiError && (
            <div className="activity-feed error-alert" style={{ color: '#ff6b6b' }}>
              <p style={{ margin: 0 }}>⚠️ {apiError}</p>
            </div>
          )}

          {/* Success View Block */}
          {apiSuccessData && (
            <div className="activity-feed success-alert">
              <h4 style={{ margin: '0 0 10px 0', color: '#FFD700' }}>✅ Function Execution Complete:</h4>
              <pre style={{ 
                margin: 0, 
                overflowX: 'auto', 
                whiteSpace: 'pre-wrap', 
                wordBreak: 'break-all',
                backgroundColor: '#121212',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #292929',
                fontSize: '0.85rem' 
              }}>
                {JSON.stringify(apiSuccessData, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* 5. Modal Footer Action Bar */}
        <div style={{
          padding: '15px 20px',
          borderTop: '1px solid #333',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button 
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: '#333',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}