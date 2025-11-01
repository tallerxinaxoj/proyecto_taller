import React from 'react';

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
};

export default function Select({ label, className = '', children, ...rest }: Props) {
  return (
    <label className="block">
      {label && <span className="block text-xs text-gray-300 mb-1">{label}</span>}
      <select className={`bg-dark p-2 rounded w-full ${className}`} {...rest}>{children}</select>
    </label>
  );
}

