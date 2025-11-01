import React from 'react';

export default function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-grayish p-4 rounded shadow-sm ${className}`}>{children}</div>;
}

