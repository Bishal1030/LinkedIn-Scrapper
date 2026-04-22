import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function Card({ children, className = '', title }: CardProps) {
  return (
    <div className={`retro-card ${className}`}>
      {title && <h3>{title}</h3>}
      {children}
    </div>
  );
}
