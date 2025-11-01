import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import { useAuth } from '../context/AuthContext';

type DashboardData = {
  totalClients: number;
  totalProducts: number;
  lowStock: number;
  byStatus: Record<string, number>;
}

export default function Dashboard() {
  const { token } = useAuth();
  const [data, setData] = useState<DashboardData>();
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch<DashboardData>('/api/dashboard', {}, token).then(setData).catch((e:any)=>setError(e.message));
  }, []);

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-semibold">Tablero</h1>
      {error && <div className="text-red-400">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-grayish p-4 rounded"><div className="text-sm text-gray-300">Clientes</div><div className="text-3xl font-bold">{data?.totalClients ?? '-'}</div></div>
        <div className="bg-grayish p-4 rounded"><div className="text-sm text-gray-300">Productos</div><div className="text-3xl font-bold">{data?.totalProducts ?? '-'}</div></div>
        <div className="bg-grayish p-4 rounded"><div className="text-sm text-gray-300">Bajo stock (&lt;5)</div><div className="text-3xl font-bold text-primary">{data?.lowStock ?? '-'}</div></div>
      </div>
      <div className="bg-grayish p-4 rounded">
        <div className="font-medium mb-3">Órdenes por estado</div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {data && Object.entries(data.byStatus).map(([s, c]) => (
            <div key={s} className="bg-dark p-3 rounded text-center">
              <div className="text-xs text-gray-300">{s}</div>
              <div className="text-2xl font-bold">{c}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

