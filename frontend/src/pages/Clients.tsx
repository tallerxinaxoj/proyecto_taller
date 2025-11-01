import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import { useAuth } from '../context/AuthContext';

type Client = { id: number; name: string; phone: string; whatsapp: string; email?: string; address?: string };

export default function Clients() {
  const { token } = useAuth();
  const [list, setList] = useState<Client[]>([]);
  const [form, setForm] = useState({ name: '', phone: '', whatsapp: '', email: '', address: '' });

  const load = async () => setList(await apiFetch<Client[]>('/api/clients', {}, token));
  useEffect(() => { load(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch('/api/clients', { method: 'POST', body: JSON.stringify(form) }, token);
    setForm({ name: '', phone: '', whatsapp: '', email: '', address: '' });
    await load();
  };

  return (
    <div className="grid gap-4">
      <form onSubmit={create} className="bg-grayish p-3 rounded grid grid-cols-3 gap-2">
        <input className="bg-dark p-2 rounded" placeholder="Nombre" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
        <input className="bg-dark p-2 rounded" placeholder="Teléfono" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
        <input className="bg-dark p-2 rounded" placeholder="WhatsApp" value={form.whatsapp} onChange={e=>setForm({...form,whatsapp:e.target.value})}/>
        <input className="bg-dark p-2 rounded" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
        <input className="bg-dark p-2 rounded col-span-2" placeholder="Dirección" value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/>
        <button className="bg-primary px-3 py-1 rounded">Crear</button>
      </form>
      <div className="grid gap-2">
        {list.map(c => (
          <div key={c.id} className="bg-grayish p-3 rounded">
            {c.name} — {c.whatsapp} {c.email && `— ${c.email}`}
          </div>
        ))}
      </div>
    </div>
  );
}

