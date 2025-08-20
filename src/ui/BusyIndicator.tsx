interface BusyIndicatorProps {
  isVisible: boolean;
  message?: string;
  className?: string;
}

const busyIndicatorStyles: React.CSSProperties = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  background: 'rgba(0, 0, 0, 0.8)',
  color: 'white',
  padding: '16px 24px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  zIndex: 10000,
  backdropFilter: 'blur(4px)',
};

const spinnerStyles: React.CSSProperties = {
  width: '20px',
  height: '20px',
  border: '2px solid transparent',
  borderTop: '2px solid #ffffff',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
};

export default function BusyIndicator({ 
  isVisible, 
  message = "Loading...", 
  className = "" 
}: BusyIndicatorProps) {
  if (!isVisible) return null;

  return (
    <>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .busy-spinner-ring {
            animation: none !important;
            border-right: 2px solid #ffffff;
          }
        }
      `}</style>
      
      <div style={busyIndicatorStyles} className={className}>
        <div style={spinnerStyles} className="busy-spinner-ring"></div>
        {message && <span style={{ fontSize: '14px', fontWeight: 500 }}>{message}</span>}
      </div>
    </>
  );
}
