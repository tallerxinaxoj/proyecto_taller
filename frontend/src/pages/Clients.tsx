import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import { useAuth } from '../context/AuthContext';

type Client = { id: number; name: string; phone: string; whatsapp: string; dpi: string; email?: string; address?: string };

export default function Clients() {
  const { token } = useAuth();
  const [list, setList] = useState<Client[]>([]);
  const [form, setForm] = useState({ name: '', phone: '', whatsapp: '+502', dpi: '', email: '', address: '' });
  const [edit, setEdit] = useState<Record<number, Partial<Client>>>({});
  const [q, setQ] = useState('');

  const fmtDpi = (raw: string) => {
    const d = (raw || '').replace(/\D/g, '').slice(0, 13);
    const a = d.slice(0, 4), b = d.slice(4, 9), c = d.slice(9, 13);
    return [a, b, c].filter(Boolean).join('-');
  };

  const load = async () => setList(await apiFetch<Client[]>('/api/clients', {}, token));
  useEffect(() => { load(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validaciones simples
    if (!/^\+502\d{8}$/.test(form.whatsapp)) return alert('WhatsApp de Guatemala debe ser +502 seguido de 8 dígitos');
    const dpiDigits = (form.dpi || '').replace(/\D/g, '');
    if (dpiDigits.length !== 13) return alert('DPI debe tener 13 dígitos');
    const payload = { ...form, dpi: fmtDpi(dpiDigits) };
    await apiFetch('/api/clients', { method: 'POST', body: JSON.stringify(payload) }, token);
    setForm({ name: '', phone: '', whatsapp: '', dpi: '', email: '', address: '' });
    await load();
  };

  const saveRow = async (c: Client) => {
    const changes = edit[c.id];
    if (!changes) return;
    // Normaliza DPI y WhatsApp si fueron editados
    const payload: any = { ...changes, dpi: changes.dpi ? fmtDpi(changes.dpi) : changes.dpi };
    if (typeof changes.whatsapp === 'string') {
      const only = changes.whatsapp.replace(/\D/g, '');
      const local = only.startsWith('502') ? only.slice(3) : only;
      const limited = local.slice(0, 8);
      payload.whatsapp = `+502${limited}`;
      if (!/^\+502\d{8}$/.test(payload.whatsapp)) {
        alert('WhatsApp de Guatemala debe ser +502 seguido de 8 dígitos');
        return;
      }
    }
    await apiFetch(`/api/clients/${c.id}`, { method: 'PATCH', body: JSON.stringify(payload) }, token);
    const copy = { ...edit }; delete copy[c.id]; setEdit(copy);
    await load();
  };

  const removeRow = async (c: Client) => {
    if (!confirm(`Eliminar cliente ${c.name}?`)) return;
    await apiFetch(`/api/clients/${c.id}`, { method: 'DELETE' }, token);
    await load();
  };

  return (
    <div className="grid gap-4 max-w-6xl mx-auto">
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
          <input id="c-wa" className="bg-dark p-2 rounded w-full" placeholder="+502XXXXXXXX" value={form.whatsapp} onChange={e=>setForm({...form,whatsapp:e.target.value})}/>
        </div>
        <div>
          <label htmlFor="c-dpi" className="block text-xs text-gray-300 mb-1">DPI</label>
          <input id="c-dpi" className="bg-dark p-2 rounded w-full" placeholder="3232-70816-1326"
            value={fmtDpi(form.dpi)}
            onChange={e=>{
              const digits = e.target.value.replace(/\D/g,'').slice(0,13);
              setForm({...form,dpi: digits});
            }}/>
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
        {list.filter(c => `${c.name} ${c.phone} ${c.whatsapp} ${c.dpi||''} ${c.email||''}`.toLowerCase().includes(q.toLowerCase())).map(c => (
          <div key={c.id} className="bg-grayish p-3 rounded grid grid-cols-7 gap-2 items-center">
            <input className="bg-dark p-1 rounded" defaultValue={c.name} onChange={e=>setEdit({...edit, [c.id]: { ...(edit[c.id]||{}), name: e.target.value }})} />
            <input className="bg-dark p-1 rounded" defaultValue={c.phone} onChange={e=>setEdit({...edit, [c.id]: { ...(edit[c.id]||{}), phone: e.target.value }})} />
            <input className="bg-dark p-1 rounded" defaultValue={c.whatsapp}
              onChange={e=>{
                const only = e.target.value.replace(/\D/g,'');
                const local = only.startsWith('502') ? only.slice(3) : only;
                const limited = local.slice(0,8);
                setEdit({...edit, [c.id]: { ...(edit[c.id]||{}), whatsapp: `+502${limited}` }});
              }} />
            <input className="bg-dark p-1 rounded" defaultValue={c.dpi} onChange={e=>setEdit({...edit, [c.id]: { ...(edit[c.id]||{}), dpi: e.target.value }})} />
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
