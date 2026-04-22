import React, { useEffect, useState } from 'react';

interface AlertProps {
  children: React.ReactNode;
  /** Auto-dismiss duration in ms. Default 5000. Set 0 to disable. */
  duration?: number;
  /** Called when alert is dismissed */
  onClose?: () => void;
}

export function Alert({ children, duration = 5000, onClose }: AlertProps) {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (duration <= 0) return;
    const fadeTimer = setTimeout(() => setFading(true), duration - 400);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '1.5rem',
      right: '1.5rem',
      zIndex: 9999,
      maxWidth: '420px',
      width: '100%',
      border: '2px solid #000',
      background: '#fff',
      boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
      fontFamily: 'monospace',
      opacity: fading ? 0 : 1,
      transform: fading ? 'translateY(-12px)' : 'translateY(0)',
      transition: 'opacity 0.4s ease, transform 0.4s ease',
      overflow: 'hidden',
    }}>
      {/* Red top accent bar */}
      <div style={{ height: '4px', background: '#ef4444', width: '100%' }} />
      <div style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
        <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>⚠</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          {children}
        </div>
        <button
          onClick={() => { setVisible(false); onClose?.(); }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'monospace',
            fontSize: '1rem',
            fontWeight: 'bold',
            lineHeight: 1,
            padding: 0,
          }}
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

Alert.Title = function AlertTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '0.2rem', color: '#000' }}>
      {children}
    </div>
  );
};

Alert.Description = function AlertDescription({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: '0.8rem',
      color: '#444',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }}
      title={typeof children === 'string' ? children : ''}
    >
      {children}
    </div>
  );
};
