import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import { useAuth } from '../context/AuthContext';

type Client = { id: number; name: string; phone: string; whatsapp: string; email?: string; address?: string };

export default function Clients() {
  const { token } = useAuth();
  const [list, setList] = useState<Client[]>([]);
  const [form, setForm] = useState({ name: '', phone: '', whatsapp: '', email: '', address: '' });
  const [edit, setEdit] = useState<Record<number, Partial<Client>>>({});
  const [q, setQ] = useState('');

  const load = async () => setList(await apiFetch<Client[]>('/api/clients', {}, token));
  useEffect(() => { load(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch('/api/clients', { method: 'POST', body: JSON.stringify(form) }, token);
    setForm({ name: '', phone: '', whatsapp: '', email: '', address: '' });
    await load();
  };

  const saveRow = async (c: Client) => {
    const changes = edit[c.id];
    if (!changes) return;
    await apiFetch(`/api/clients/${c.id}`, { method: 'PATCH', body: JSON.stringify(changes) }, token);
    const copy = { ...edit }; delete copy[c.id]; setEdit(copy);
    await load();
  };

  const removeRow = async (c: Client) => {
    if (!confirm(`Eliminar cliente ${c.name}?`)) return;
    await apiFetch(`/api/clients/${c.id}`, { method: 'DELETE' }, token);
    await load();
  };

  return (
    <div className="grid gap-4">
      <form onSubmit={create} className="bg-grayish p-3 rounded grid grid-cols-3 gap-3">
        <div>
          <label htmlFor="c-name" className="block text-xs text-gray-300 mb-1">Nombre</label>
          <input id="c-name" className="bg-dark p-2 rounded w-full" placeholder="Nombre" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
        </div>
        <div>
          <label htmlFor="c-phone" className="block text-xs text-gray-300 mb-1">Teléfono</label>
          <input id="c-phone" className="bg-dark p-2 rounded w-full" placeholder="Teléfono" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
        </div>
        <div>
          <label htmlFor="c-wa" className="block text-xs text-gray-300 mb-1">WhatsApp</label>
          <input id="c-wa" className="bg-dark p-2 rounded w-full" placeholder="WhatsApp" value={form.whatsapp} onChange={e=>setForm({...form,whatsapp:e.target.value})}/>
        </div>
        <div>
          <label htmlFor="c-email" className="block text-xs text-gray-300 mb-1">Email</label>
          <input id="c-email" className="bg-dark p-2 rounded w-full" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
        </div>
        <div className="col-span-2">
          <label htmlFor="c-addr" className="block text-xs text-gray-300 mb-1">Dirección</label>
          <input id="c-addr" className="bg-dark p-2 rounded w-full" placeholder="Dirección" value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/>
        </div>
        <button className="bg-primary px-3 py-2 rounded">Crear</button>
      </form>
      <input className="bg-dark p-2 rounded max-w-sm" placeholder="Buscar" value={q} onChange={e=>setQ(e.target.value)} />
      <div className="grid gap-2">
        {list.filter(c => `${c.name} ${c.phone} ${c.whatsapp} ${c.email||''}`.toLowerCase().includes(q.toLowerCase())).map(c => (
          <div key={c.id} className="bg-grayish p-3 rounded grid grid-cols-6 gap-2 items-center">
            <input className="bg-dark p-1 rounded" defaultValue={c.name} onChange={e=>setEdit({...edit, [c.id]: { ...(edit[c.id]||{}), name: e.target.value }})} />
            <input className="bg-dark p-1 rounded" defaultValue={c.phone} onChange={e=>setEdit({...edit, [c.id]: { ...(edit[c.id]||{}), phone: e.target.value }})} />
            <input className="bg-dark p-1 rounded" defaultValue={c.whatsapp} onChange={e=>setEdit({...edit, [c.id]: { ...(edit[c.id]||{}), whatsapp: e.target.value }})} />
            <input className="bg-dark p-1 rounded" defaultValue={c.email} onChange={e=>setEdit({...edit, [c.id]: { ...(edit[c.id]||{}), email: e.target.value }})} />
            <input className="bg-dark p-1 rounded" defaultValue={c.address} onChange={e=>setEdit({...edit, [c.id]: { ...(edit[c.id]||{}), address: e.target.value }})} />
            <div className="flex gap-2 justify-end">
              <button className="bg-primary px-2 py-1 rounded" onClick={()=>saveRow(c)}>Guardar</button>
              <button className="bg-dark px-2 py-1 rounded text-red-400" onClick={()=>removeRow(c)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
