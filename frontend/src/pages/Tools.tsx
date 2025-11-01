import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import { useAuth } from '../context/AuthContext';

type Tool = { id: number; name: string; code?: string; quantity: number; location?: string };

export default function Tools() {
  const { token, user } = useAuth();
  const [list, setList] = useState<Tool[]>([]);
  const [form, setForm] = useState({ name: '', code: '', quantity: 1, location: '' });

  const load = async () => setList(await apiFetch<Tool[]>('/api/tools', {}, token));
  useEffect(() => { load(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch('/api/tools', { method: 'POST', body: JSON.stringify(form) }, token);
    setForm({ name: '', code: '', quantity: 1, location: '' });
    await load();
  };

  return (
    <div className="grid gap-4">
      {user?.role === 'ADMIN' && (
        <form onSubmit={create} className="bg-grayish p-3 rounded grid grid-cols-4 gap-2">
          <input className="bg-dark p-2 rounded" placeholder="Nombre" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
          <input className="bg-dark p-2 rounded" placeholder="Código" value={form.code} onChange={e=>setForm({...form,code:e.target.value})}/>
          <input className="bg-dark p-2 rounded" type="number" placeholder="Cantidad" value={form.quantity} onChange={e=>setForm({...form,quantity:Number(e.target.value)})}/>
          <input className="bg-dark p-2 rounded" placeholder="Ubicación" value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/>
          <button className="bg-primary px-3 py-1 rounded col-span-4">Crear</button>
        </form>
      )}
      <div className="grid gap-2">
        {list.map(t => (
          <div key={t.id} className="bg-grayish p-3 rounded flex justify-between">
            <div>{t.name} {t.code && `— ${t.code}`} — cant {t.quantity}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
