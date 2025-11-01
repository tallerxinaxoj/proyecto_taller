import React from 'react';

type Props = {
  data: Array<{ label: string; value: number }>
  height?: number
};

export default function SimpleBar({ data, height = 140 }: Props) {
  const max = Math.max(1, ...data.map(d => d.value));
  const barW = 42;
  const gap = 36; // mayor separación entre barras
  const width = data.length * (barW + gap) + gap;
  return (
    <svg width={width} height={height} className="bg-grayish rounded">
      {data.map((d, i) => {
        const h = Math.round((d.value / max) * (height - 40));
        const x = gap + i * (barW + gap);
        const y = height - 20 - h;
        const label = (d.label || '').replace(/_/g, ' ');
        // Partimos etiqueta en dos líneas si es larga
        const words = label.split(' ');
        let line1 = label;
        let line2 = '';
        if (words.length > 1) {
          const mid = Math.ceil(words.length / 2);
          line1 = words.slice(0, mid).join(' ');
          line2 = words.slice(mid).join(' ');
        }
        return (
          <g key={d.label}>
            <rect x={x} y={y} width={barW} height={h} fill="#ef4444" />
            {line2 ? (
              <text x={x + barW / 2} y={height - 18} textAnchor="middle" fontSize="10" fill="#cbd5e1">
                <tspan x={x + barW / 2} dy={0}>{line1}</tspan>
                <tspan x={x + barW / 2} dy={12}>{line2}</tspan>
              </text>
            ) : (
              <text x={x + barW / 2} y={height - 6} textAnchor="middle" fontSize="10" fill="#cbd5e1">{line1}</text>
            )}
            <text x={x + barW / 2} y={y - 6} textAnchor="middle" fontSize="11" fill="#e5e7eb">{d.value}</text>
          </g>
        );
      })}
    </svg>
  );
}
