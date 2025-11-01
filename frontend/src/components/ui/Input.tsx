import React from 'react';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export default function Input({ label, className = '', ...rest }: Props) {
  return (
    <label className="block">
      {label && <span className="block text-xs text-gray-300 mb-1">{label}</span>}
      <input className={`bg-dark p-2 rounded w-full ${className}`} {...rest} />
    </label>
  );
}

