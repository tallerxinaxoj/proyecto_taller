import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import { useAuth } from '../context/AuthContext';

type Product = { id: number; name: string; sku: string; stock: number; price: number; active: boolean };

export default function Products() {
  const { token, user } = useAuth();
  const [list, setList] = useState<Product[]>([]);
  const [form, setForm] = useState({ name: '', sku: '', stock: 0, price: 0 });
  const [edit, setEdit] = useState<Record<number, { stock: number; price: number }>>({});
  const [q, setQ] = useState('');

  const load = async () => setList(await apiFetch<Product[]>('/api/products', {}, token));
  useEffect(() => { load(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch('/api/products', { method: 'POST', body: JSON.stringify(form) }, token);
    setForm({ name: '', sku: '', stock: 0, price: 0 });
    await load();
  };

  const saveRow = async (p: Product) => {
    const changes = edit[p.id];
    if (!changes) return;
    await apiFetch(`/api/products/${p.id}`, { method: 'PATCH', body: JSON.stringify({ stock: changes.stock, price: changes.price }) }, token);
    const copy = { ...edit }; delete copy[p.id]; setEdit(copy);
    await load();
  };

  const removeRow = async (p: Product) => {
    if (!confirm(`Eliminar producto ${p.name}?`)) return;
    await apiFetch(`/api/products/${p.id}`, { method: 'DELETE' }, token);
    await load();
  };

  return (
    <div className="grid gap-4">
      {user?.role === 'ADMIN' && (
        <form onSubmit={create} className="bg-grayish p-3 rounded grid grid-cols-4 gap-3">
          <div className="col-span-1">
            <label htmlFor="p-name" className="block text-xs text-gray-300 mb-1">Nombre</label>
            <input id="p-name" className="bg-dark p-2 rounded w-full" placeholder="Nombre" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
          </div>
          <div className="col-span-1">
            <label htmlFor="p-sku" className="block text-xs text-gray-300 mb-1">SKU</label>
            <input id="p-sku" className="bg-dark p-2 rounded w-full" placeholder="SKU" value={form.sku} onChange={e=>setForm({...form,sku:e.target.value})}/>
          </div>
          <div className="col-span-1">
            <label htmlFor="p-stock" className="block text-xs text-gray-300 mb-1">Stock</label>
            <input id="p-stock" className="bg-dark p-2 rounded w-full" type="number" placeholder="0" value={form.stock} onChange={e=>setForm({...form,stock:Number(e.target.value)})}/>
          </div>
          <div className="col-span-1">
            <label htmlFor="p-price" className="block text-xs text-gray-300 mb-1">Precio</label>
            <input id="p-price" className="bg-dark p-2 rounded w-full" type="number" placeholder="0" value={form.price} onChange={e=>setForm({...form,price:Number(e.target.value)})}/>
          </div>
          <button className="bg-primary px-3 py-2 rounded col-span-4">Crear</button>
        </form>
      )}
      <input className="bg-dark p-2 rounded max-w-sm" placeholder="Buscar" value={q} onChange={e=>setQ(e.target.value)} />
      <div className="grid gap-2">
        {list.filter(p => `${p.name} ${p.sku}`.toLowerCase().includes(q.toLowerCase())).map(p => (
          <div key={p.id} className="bg-grayish p-3 rounded grid grid-cols-5 gap-2 items-center">
            <div className="col-span-2">{p.name} — {p.sku}</div>
            <input type="number" className="bg-dark p-1 rounded" defaultValue={p.stock} onChange={e=>setEdit({...edit, [p.id]: { stock: Number(e.target.value), price: edit[p.id]?.price ?? p.price }})} />
            <input type="number" className="bg-dark p-1 rounded" defaultValue={p.price} onChange={e=>setEdit({...edit, [p.id]: { stock: edit[p.id]?.stock ?? p.stock, price: Number(e.target.value) }})} />
            <div className="flex gap-2 justify-end">
              {user?.role === 'ADMIN' && (
                <>
                  <button className="bg-primary px-2 py-1 rounded" onClick={()=>saveRow(p)}>Guardar</button>
                  <button className="bg-dark px-2 py-1 rounded text-red-400" onClick={()=>removeRow(p)}>Eliminar</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
