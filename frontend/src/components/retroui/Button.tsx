import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  loading?: boolean;
}

export function Button({ className = '', loading = false, children, disabled, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`retro-button ${loading ? 'retro-button--loading' : ''} ${className}`}
    >
      {loading ? (
        <span className="retro-button__spinner">⟳</span>
      ) : children}
    </button>
  );
}
