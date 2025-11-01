import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import { useAuth } from '../context/AuthContext';

type Product = { id: number; name: string; sku: string; stock: number; price: number; active: boolean };

export default function Products() {
  const { token, user } = useAuth();
  const [list, setList] = useState<Product[]>([]);
  const [form, setForm] = useState({ name: '', sku: '', stock: 0, price: 0 });

  const load = async () => setList(await apiFetch<Product[]>('/api/products', {}, token));
  useEffect(() => { load(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch('/api/products', { method: 'POST', body: JSON.stringify(form) }, token);
    setForm({ name: '', sku: '', stock: 0, price: 0 });
    await load();
  };

  return (
    <div className="grid gap-4">
      {user?.role === 'ADMIN' && (
        <form onSubmit={create} className="bg-grayish p-3 rounded grid grid-cols-4 gap-2">
          <input className="bg-dark p-2 rounded" placeholder="Nombre" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
          <input className="bg-dark p-2 rounded" placeholder="SKU" value={form.sku} onChange={e=>setForm({...form,sku:e.target.value})}/>
          <input className="bg-dark p-2 rounded" type="number" placeholder="Stock" value={form.stock} onChange={e=>setForm({...form,stock:Number(e.target.value)})}/>
          <input className="bg-dark p-2 rounded" type="number" placeholder="Precio" value={form.price} onChange={e=>setForm({...form,price:Number(e.target.value)})}/>
          <button className="bg-primary px-3 py-1 rounded col-span-4">Crear</button>
        </form>
      )}
      <div className="grid gap-2">
        {list.map(p => (
          <div key={p.id} className="bg-grayish p-3 rounded flex justify-between">
            <div>{p.name} — {p.sku} — stock {p.stock} — ${p.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
