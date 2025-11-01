import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { useAuth } from '../context/AuthContext';

type OrderDetail = {
  id: number; code: string; status: string; description?: string; totalParts: number; totalLabor: number; expectedAt?: string;
  client: { name: string; whatsapp?: string };
  motorcycle: { brand: string; model: string; plate: string };
  items: Array<{ id: number; quantity: number; unitPrice: number; product: { id: number; name: string } }>;
  history: Array<{ id: number; status: string; note?: string; createdAt: string }>;
}

export default function OrderDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState<OrderDetail>();
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch<OrderDetail>(`/api/orders/${id}`, {}, token).then(setOrder).catch((e:any)=>setError(e.message));
  }, [id]);

  if (error) return <div className="text-red-400">{error}</div>;
  if (!order) return <div>Cargando...</div>;

  const total = Number(order.totalParts) + Number(order.totalLabor);

  return (
    <div className="grid gap-4 max-w-4xl">
      <h1 className="text-2xl font-semibold">Orden {order.code}</h1>
      <div className="grid md:grid-cols-2 gap-3">
        <div className="bg-grayish p-3 rounded">
          <div className="font-medium">Cliente</div>
          <div>{order.client.name}</div>
          {order.client.whatsapp && <div className="text-sm text-gray-300">WhatsApp: {order.client.whatsapp}</div>}
        </div>
        <div className="bg-grayish p-3 rounded">
          <div className="font-medium">Moto</div>
          <div>{order.motorcycle.brand} {order.motorcycle.model}</div>
          <div className="text-sm text-gray-300">Placa: {order.motorcycle.plate}</div>
        </div>
      </div>

      <div className="bg-grayish p-3 rounded">
        <div className="font-medium mb-2">Items</div>
        <div className="grid gap-1">
          {order.items.map(it => (
            <div key={it.id} className="flex justify-between">
              <div>{it.product.name} × {it.quantity}</div>
              <div>Q {Number(it.unitPrice) * it.quantity}</div>
            </div>
          ))}
          {order.items.length === 0 && <div className="text-sm text-gray-300">Sin productos</div>}
        </div>
      </div>

      <div className="bg-grayish p-3 rounded">
        <div className="font-medium mb-2">Totales</div>
        <div className="flex justify-between"><span>Partes</span><span>Q {Number(order.totalParts)}</span></div>
        <div className="flex justify-between"><span>Mano de obra</span><span>Q {Number(order.totalLabor)}</span></div>
        <div className="flex justify-between font-semibold"><span>Total</span><span>Q {total}</span></div>
        {order.expectedAt && <div className="mt-2 text-sm text-gray-300">Entrega estimada: {new Date(order.expectedAt).toLocaleDateString()}</div>}
      </div>

      <div className="bg-grayish p-3 rounded">
        <div className="font-medium mb-2">Historial</div>
        <div className="grid gap-2">
          {order.history.map(h => (
            <div key={h.id} className="flex justify-between text-sm">
              <div>{new Date(h.createdAt).toLocaleString()}</div>
              <div className="text-primary">{h.status}</div>
              <div className="text-gray-300">{h.note || ''}</div>
            </div>
          ))}
          {order.history.length === 0 && <div className="text-sm text-gray-300">Sin historial</div>}
        </div>
      </div>
    </div>
  );
}
