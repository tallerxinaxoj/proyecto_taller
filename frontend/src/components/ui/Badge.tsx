import React from 'react';

const palette: Record<string, string> = {
  RECIBIDA: 'bg-gray-700 text-gray-200',
  DIAGNOSTICO: 'bg-yellow-700 text-yellow-100',
  EN_PROCESO: 'bg-blue-700 text-blue-100',
  LISTA: 'bg-green-700 text-green-100',
  ENTREGADA: 'bg-primary text-white'
};

export default function Badge({ value }: { value: string }) {
  const cls = palette[value] || 'bg-gray-700 text-gray-200';
  return <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{value}</span>;
}

