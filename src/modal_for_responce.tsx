import { useState } from 'react';
import { dictionary, type LangCode } from './translations';

interface ApiModalProps {
  functionOrigin: string;
  current_Lang: LangCode;
  apiError: string | null;
  apiSuccessData: any; // Replace 'any' with your actual API type if available
  onClose: () => void;
}

export default function ApiResultModal({functionOrigin, current_Lang, apiError, apiSuccessData, onClose }: ApiModalProps) {
  
  // If there is no data and no error, do not render the modal at all
  if (!apiError && !apiSuccessData) return null;
      
  const t = dictionary[current_Lang];

  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const [textColor, setTextColor] = useState<string>('white'); // Default starting color

   // 1. Separate the main link from the rest of the metadata
  //const { source_status, ...otherAttributes } = apiSuccessData || ('');

  let targetLink = 'nothing to see here';
  let expansionPart_prepare = {};
  let expansionPart;
  let KPI_strip = {};
  let bottom_part;
  
  if(functionOrigin === 'IncrementalityTest'){
    switch(apiSuccessData.source_status){
      case 'Cannibalization':
        targetLink = t.warning;
        setTextColor('red');
        break;
      case 'Neutral' :
        targetLink = t.muted;
        setTextColor('gray');
        break;
      case 'Pure Growth' :
        targetLink = t.positive;
        setTextColor('lightgreen');
        break;
      case 'Baseline':
        targetLink = t.neutral;
        setTextColor('white');
    }
    expansionPart_prepare = {
      "deposits": apiSuccessData.deposits,
      "total_conversions": apiSuccessData.total_conversions,
      "incremental_conversions": apiSuccessData.incremental_conversions,
      "cannibalized_conversions": apiSuccessData.cannibalized_conversions,
      "incremental_revenue": apiSuccessData.incremental_revenue,
      "cannibalized_revenue": apiSuccessData.cannibalized_revenue,
      "incrementality_share_pct": apiSuccessData.incrementality_share_pct,
      "cannibalization_rate_pct": apiSuccessData.cannibalization_rate_pct
    };

    expansionPart = Object.entries(expansionPart_prepare)
      .map(([label, value]) => `${label}=${value}`)
      .join('\n');

    KPI_strip = {
      "returning_players": apiSuccessData.returning_players,
      "total_revenue": apiSuccessData.total_revenue,
      "cost": apiSuccessData.cost,
      "iroi": apiSuccessData.iroi
    }

    bottom_part = Object.entries(KPI_strip)
      .map(([label, value]) => `${label}=${value}`)
      .join('\n');

  } else if(functionOrigin === 'UpliftAnalysis'){

  }else if(functionOrigin === 'CohortAnalysis'){
    
  }else if(functionOrigin === 'EventNamesAnalysis'){
    
  }else if(functionOrigin === 'TrackingLink'){
    targetLink = apiSuccessData?.tracking_url;
  }else if(functionOrigin === 'splitAndRetargeting'){
    
  }else if(functionOrigin === 'listCampaignSpends'){
    
  }else if(functionOrigin === 'recordCampaignSpend'){
    
  }
  
  const handleCopy = async () => {
    
    //setProcessedResponce(targetLink);
    // 1. Try modern secure-context API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(targetLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      } catch (err) {
        console.warn("Modern clipboard write failed, trying fallback...", err);
      }
    }

    // 2. Fallback method for HTTP / Non-Secure environments
    try {
      // Create a temporary hidden textarea element
      const textArea = document.createElement("textarea");
      textArea.value = targetLink;
      
      // Position it off-screen so the user doesn't see it blink
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      
      // Highlight and copy the text content
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea); // Clean up the DOM element

      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        throw new Error("execCommand copy returned false");
      }
    } catch (err) {
      console.error("Universal clipboard fallback failed:", err);
      alert("Copying failed. Please copy the text manually.");
    }
  };

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
            {apiError ? `❌${t.execution_failed}` : `✅${t.execution_complete}` }
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
               
                {/* Left side click toggle to trigger section expansion */}
              <div 
                onClick={() => setIsOpen(!isOpen)} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  cursor: 'pointer',
                  flex: 1,
                  minWidth: 0 // Allows text truncation to work inside flex boxes
                }}
              >
                {/* Rotating carets depending on open state */}
                <span style={{ color: '#8b949e', fontSize: '0.75rem', transform: isOpen ? 'rotate(90deg)' : 'none', display: 'inline-block', transition: 'transform 0.15s' }}>
                  ▶
                </span>
                <span style={{ 
                  fontSize: '0.85rem', 
                  color: textColor,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontFamily: 'monospace'
                }}>
                  {targetLink}
                </span>
              </div>
              {/* 3. DYNAMICALLY EXPANDABLE DROP PANEL */}
              {isOpen && (
                <div style={{
                  backgroundColor: '#0d1117',
                  borderLeft: '1px solid #30363d',
                  borderRight: '1px solid #30363d',
                  borderBottom: '1px solid #30363d',
                  borderRadius: '0 0 6px 6px',
                  padding: '12px'
                  }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8b949e', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {expansionPart}
                    </div>
                   {/* Render remaining variables or fallback to formatting what's left */}
                    {(bottom_part) ? (
                      <pre style={{
                        margin: 0,
                        fontSize: '0.8rem',
                        color: '#c9d1d9',
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                        backgroundColor: '#161b22',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #21262d'
                      }}>
                        {bottom_part}
                      </pre>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: '#484f58', fontStyle: 'italic' }}>
                          No alternative tracking configurations detected.
                        </span>
                      )}

                </div>
            )}
              <button 
                  onClick={handleCopy}
                  style={{
                    background: copied ? '#1e3a1e' : '#242424',
                    border: copied ? '1px solid #22c55e' : '1px solid #333',
                    borderRadius: '4px',
                    color: copied ? '#22c55e' : '#a0a0a0',
                    fontSize: '0.75rem',
                    padding: '4px 10px',
                    cursor: 'pointer',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.15s ease-in-out'
                  }}
                >
                  {copied ? '✅ Copied!' : '📋 Copy JSON'}
                </button>

                  


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
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}