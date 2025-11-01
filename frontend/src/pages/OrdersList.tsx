import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

type Order = {
  id: number; code: string; status: string;
  client: { name: string; whatsapp?: string };
  motorcycle: { brand: string; model: string; plate: string };
  history: Array<{ id: number; status: string; createdAt: string }>;
  items?: Array<{ id: number; quantity: number; unitPrice: number; product: { id: number; name: string } }>
};
type Product = { id: number; name: string; stock: number };

export default function OrdersList() {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const data = await apiFetch<Order[]>('/api/orders', {}, token);
      setOrders(data);
    } catch (e: any) { setError(e.message); }
  };

  useEffect(() => { load(); apiFetch<Product[]>('/api/products', {}, token).then(setProducts); }, []);

  const updateStatus = async (id: number, status: string, note?: string) => {
    try {
      await apiFetch(`/api/orders/${id}/status`, { method: 'POST', body: JSON.stringify({ status, note }) }, token);
      await load();
    } catch (e: any) { alert(e.message); }
  };

  const statuses = ['RECIBIDA','DIAGNOSTICO','EN_PROCESO','LISTA','ENTREGADA'];

  const addItem = async (orderId: number, productId: number, qty: number) => {
    try {
      await apiFetch(`/api/orders/${orderId}/items`, { method: 'POST', body: JSON.stringify({ productId, quantity: qty }) }, token);
      await load();
    } catch (e: any) { alert(e.message); }
  };

  const removeItem = async (orderId: number, itemId: number) => {
    try {
      await apiFetch(`/api/orders/${orderId}/items/${itemId}`, { method: 'DELETE' }, token);
      await load();
    } catch (e: any) { alert(e.message); }
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-xl">Órdenes</h1>
        <Link to="/orders/new" className="bg-primary px-3 py-1 rounded">Nueva Orden</Link>
      </div>
      {error && <div className="text-red-400">{error}</div>}
      <div className="grid gap-3">
        {orders.map(o => (
          <div key={o.id} className="bg-grayish p-3 rounded grid gap-3">
            <div className="flex justify-between gap-3 flex-wrap">
              <div>
                <div className="font-semibold">{o.code} — {o.client?.name}</div>
                <div className="text-sm text-gray-300">{o.motorcycle?.brand} {o.motorcycle?.model} · {o.motorcycle?.plate}</div>
                <div className="text-sm">Estado: <span className="text-primary">{o.status}</span></div>
              </div>
              {user?.role && (
                <div className="flex gap-2 items-center">
                  <select id={`st-${o.id}`} className="bg-dark p-1 rounded">
                    {statuses.map(s => <option key={s} value={s} selected={o.status===s}>{s}</option>)}
                  </select>
                  <input id={`nt-${o.id}`} className="bg-dark p-1 rounded" placeholder="Nota (opcional)" />
                  <button className="bg-primary px-2 py-1 rounded" onClick={() => {
                    const st = (document.getElementById(`st-${o.id}`) as HTMLSelectElement).value;
                    const nt = (document.getElementById(`nt-${o.id}`) as HTMLInputElement).value;
                    updateStatus(o.id, st, nt);
                  }}>Actualizar</button>
                  <Link to={`/orders/${o.id}`} className="bg-dark px-2 py-1 rounded">Ver detalle</Link>
                </div>
              )}
            </div>

            {/* Items de la orden */}
            <div className="bg-dark p-2 rounded">
              <div className="text-sm font-medium mb-2">Productos en la orden</div>
              <div className="grid gap-1 mb-2">
                {o.items?.map(it => (
                  <div key={it.id} className="flex justify-between text-sm">
                    <div>{it.product.name} × {it.quantity}</div>
                    <button className="text-red-400" onClick={()=>removeItem(o.id, it.id)}>Quitar</button>
                  </div>
                ))}
                {(!o.items || o.items.length===0) && <div className="text-gray-300 text-sm">Sin productos</div>}
              </div>
              {/* Agregar producto rápido */}
              <div className="flex gap-2 items-center">
                <select id={`p-${o.id}`} className="bg-grayish p-1 rounded">
                  <option value="">Selecciona producto</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name} (stock {p.stock})</option>)}
                </select>
                <input id={`q-${o.id}`} className="bg-grayish p-1 rounded w-20" type="number" min={1} defaultValue={1} />
                <button className="bg-primary px-2 py-1 rounded" onClick={() => {
                  const s = document.getElementById(`p-${o.id}`) as HTMLSelectElement;
                  const q = document.getElementById(`q-${o.id}`) as HTMLInputElement;
                  if (!s.value) return;
                  addItem(o.id, Number(s.value), Number(q.value||1));
                }}>Agregar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
