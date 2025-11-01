import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import { useAuth } from '../context/AuthContext';

type Tool = { id: number; name: string; code?: string; quantity: number; location?: string };

export default function Tools() {
  const { token, user } = useAuth();
  const [list, setList] = useState<Tool[]>([]);
  const [edit, setEdit] = useState<Record<number, { quantity: number; location?: string }>>({});
  const [q, setQ] = useState('');
  const [form, setForm] = useState({ name: '', code: '', quantity: 1, location: '' });

  const load = async () => setList(await apiFetch<Tool[]>('/api/tools', {}, token));
  useEffect(() => { load(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch('/api/tools', { method: 'POST', body: JSON.stringify(form) }, token);
    setForm({ name: '', code: '', quantity: 1, location: '' });
    await load();
  };

  const saveRow = async (t: Tool) => {
    const changes = edit[t.id];
    if (!changes) return;
    await apiFetch(`/api/tools/${t.id}`, { method: 'PATCH', body: JSON.stringify({ quantity: changes.quantity, location: changes.location }) }, token);
    const copy = { ...edit }; delete copy[t.id]; setEdit(copy);
    await load();
  };

  const removeRow = async (t: Tool) => {
    if (!confirm(`Eliminar herramienta ${t.name}?`)) return;
    await apiFetch(`/api/tools/${t.id}`, { method: 'DELETE' }, token);
    await load();
  };

  return (
    <div className="grid gap-4">
      {user?.role === 'ADMIN' && (
      <form onSubmit={create} className="bg-grayish p-3 rounded grid grid-cols-4 gap-3">
        <div>
          <label htmlFor="t-name" className="block text-xs text-gray-300 mb-1">Nombre</label>
          <input id="t-name" className="bg-dark p-2 rounded w-full" placeholder="Nombre" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
        </div>
        <div>
          <label htmlFor="t-code" className="block text-xs text-gray-300 mb-1">Código</label>
          <input id="t-code" className="bg-dark p-2 rounded w-full" placeholder="Código" value={form.code} onChange={e=>setForm({...form,code:e.target.value})}/>
        </div>
        <div>
          <label htmlFor="t-qty" className="block text-xs text-gray-300 mb-1">Cantidad</label>
          <input id="t-qty" className="bg-dark p-2 rounded w-full" type="number" placeholder="1" value={form.quantity} onChange={e=>setForm({...form,quantity:Number(e.target.value)})}/>
        </div>
        <div>
          <label htmlFor="t-loc" className="block text-xs text-gray-300 mb-1">Ubicación</label>
          <input id="t-loc" className="bg-dark p-2 rounded w-full" placeholder="Ubicación" value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/>
        </div>
        <button className="bg-primary px-3 py-2 rounded col-span-4">Crear</button>
      </form>
      )}
      <input className="bg-dark p-2 rounded max-w-sm" placeholder="Buscar" value={q} onChange={e=>setQ(e.target.value)} />
      <div className="grid gap-2">
        {list.filter(t => `${t.name} ${t.code||''}`.toLowerCase().includes(q.toLowerCase())).map(t => (
          <div key={t.id} className="bg-grayish p-3 rounded grid grid-cols-5 gap-2 items-center">
            <div className="col-span-2">{t.name} {t.code && `— ${t.code}`}</div>
            <input type="number" className="bg-dark p-1 rounded" defaultValue={t.quantity} onChange={e=>setEdit({...edit, [t.id]: { quantity: Number(e.target.value), location: edit[t.id]?.location ?? t.location }})} />
            <input className="bg-dark p-1 rounded" defaultValue={t.location} onChange={e=>setEdit({...edit, [t.id]: { quantity: edit[t.id]?.quantity ?? t.quantity, location: e.target.value }})} />
            <div className="flex gap-2 justify-end">
              {user?.role === 'ADMIN' && (
                <>
                  <button className="bg-primary px-2 py-1 rounded" onClick={()=>saveRow(t)}>Guardar</button>
                  <button className="bg-dark px-2 py-1 rounded text-red-400" onClick={()=>removeRow(t)}>Eliminar</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
