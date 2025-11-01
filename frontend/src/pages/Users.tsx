import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import { useAuth } from '../context/AuthContext';

type User = { id: number; name: string; email: string; role: 'ADMIN'|'MECANICO'; createdAt: string };

export default function Users() {
  const { token } = useAuth();
  const [list, setList] = useState<User[]>([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'MECANICO' as 'ADMIN'|'MECANICO' });
  const [edit, setEdit] = useState<Record<number, { role?: 'ADMIN'|'MECANICO'; password?: string }>>({});
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const data = await apiFetch<User[]>('/api/auth/users', {}, token);
      setList(data);
    } catch (e: any) { setError(e.message); }
  };
  useEffect(() => { load(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    try {
      await apiFetch('/api/auth/users', { method: 'POST', body: JSON.stringify(form) }, token);
      setForm({ name: '', email: '', password: '', role: 'MECANICO' });
      await load();
    } catch (e: any) { setError(e.message); }
  };

  const save = async (u: User) => {
    const changes = edit[u.id];
    if (!changes) return;
    await apiFetch(`/api/auth/users/${u.id}`, { method: 'PATCH', body: JSON.stringify(changes) }, token);
    const cp = { ...edit }; delete cp[u.id]; setEdit(cp);
    await load();
  };

  const removeUser = async (u: User) => {
    if (!confirm(`Eliminar usuario ${u.name}?`)) return;
    await apiFetch(`/api/auth/users/${u.id}`, { method: 'DELETE' }, token);
    await load();
  };

  return (
    <div className="grid gap-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold">Usuarios (ADMIN)</h1>
      {error && <div className="text-red-400">{error}</div>}

      <form onSubmit={create} className="bg-grayish p-4 rounded grid grid-cols-4 gap-2">
        <input className="bg-dark p-2 rounded col-span-2" placeholder="Nombre" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
        <input className="bg-dark p-2 rounded col-span-2" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
        <input className="bg-dark p-2 rounded col-span-2" type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
        <select className="bg-dark p-2 rounded" value={form.role} onChange={e=>setForm({...form,role:e.target.value as any})}>
          <option value="MECANICO">Mecánico</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button className="bg-primary px-3 py-2 rounded">Crear usuario</button>
      </form>

      <div className="grid gap-2">
        {list.map(u => (
          <div key={u.id} className="bg-grayish p-3 rounded grid grid-cols-6 gap-2 items-center">
            <div className="col-span-2">
              <div className="font-medium">{u.name}</div>
              <div className="text-sm text-gray-300">{u.email}</div>
            </div>
            <select className="bg-dark p-2 rounded" defaultValue={u.role} onChange={e=>setEdit({...edit, [u.id]: { ...(edit[u.id]||{}), role: e.target.value as any }})}>
              <option value="MECANICO">Mecánico</option>
              <option value="ADMIN">Admin</option>
            </select>
            <input className="bg-dark p-2 rounded" type="password" placeholder="Nueva contraseña (opcional)" onChange={e=>setEdit({...edit, [u.id]: { ...(edit[u.id]||{}), password: e.target.value }})} />
            <div className="text-xs text-gray-400">{new Date(u.createdAt).toLocaleString()}</div>
            <div className="flex gap-2 justify-end">
              <button className="bg-primary px-2 py-1 rounded" onClick={()=>save(u)}>Guardar</button>
              <button className="bg-dark px-2 py-1 rounded text-red-400" onClick={()=>removeUser(u)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
