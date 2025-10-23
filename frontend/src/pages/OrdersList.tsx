import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

type Order = {
  id: number; code: string; status: string;
  client: { name: string; whatsapp?: string };
  motorcycle: { brand: string; model: string; plate: string };
  history: Array<{ id: number; status: string; createdAt: string }>;
};

export default function OrdersList() {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const data = await apiFetch<Order[]>('/api/orders', {}, token);
      setOrders(data);
    } catch (e: any) { setError(e.message); }
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await apiFetch(`/api/orders/${id}/status`, { method: 'POST', body: JSON.stringify({ status }) }, token);
      await load();
    } catch (e: any) { alert(e.message); }
  };

  const statuses = ['RECIBIDA','DIAGNOSTICO','EN_PROCESO','LISTA','ENTREGADA'];

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-xl">Órdenes</h1>
        <Link to="/orders/new" className="bg-primary px-3 py-1 rounded">Nueva Orden</Link>
      </div>
      {error && <div className="text-red-400">{error}</div>}
      <div className="grid gap-3">
        {orders.map(o => (
          <div key={o.id} className="bg-grayish p-3 rounded">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">{o.code} — {o.client?.name}</div>
                <div className="text-sm text-gray-300">{o.motorcycle?.brand} {o.motorcycle?.model} · {o.motorcycle?.plate}</div>
                <div className="text-sm">Estado: <span className="text-primary">{o.status}</span></div>
              </div>
              {user?.role && (
                <div className="flex gap-2">
                  {statuses.map(s => (
                    <button key={s} disabled={o.status===s} onClick={() => updateStatus(o.id, s)} className={`px-2 py-1 rounded ${o.status===s?'bg-gray-700':'bg-dark'}`}>{s}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

