import { useEffect, useMemo, useState } from 'react';
import { apiFetch, API_URL } from '../lib/api';
import { useAuth } from '../context/AuthContext';

type Row = {
  id: number; code: string; createdAt: string; status: string;
  client: { name: string; phone: string; whatsapp: string };
  motorcycle: { brand: string; model: string; plate: string };
  totalParts: number; totalLabor: number; expectedAt?: string;
};

export default function Reports() {
  const { token } = useAuth();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [status, setStatus] = useState('');
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState('');

  const load = async () => {
    setError('');
    const q = new URLSearchParams();
    if (from) q.set('from', from);
    if (to) q.set('to', to);
    if (status) q.set('status', status);
    try {
      const data = await apiFetch<Row[]>(`/api/reports/orders?${q.toString()}`, {}, token);
      setRows(data);
    } catch (e: any) { setError(e.message); }
  };

  useEffect(() => { load(); }, []);

  const total = useMemo(() => rows.reduce((acc, r) => acc + Number(r.totalParts) + Number(r.totalLabor), 0), [rows]);
  const csvUrl = useMemo(() => {
    const q = new URLSearchParams();
    if (from) q.set('from', from);
    if (to) q.set('to', to);
    if (status) q.set('status', status);
    return `${API_URL}/api/reports/orders.csv?${q.toString()}`;
  }, [from, to, status]);

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold">Reportes</h1>

      <div className="bg-grayish p-3 rounded grid md:grid-cols-5 gap-2">
        <div>
          <label className="block text-xs text-gray-300 mb-1">Desde</label>
          <input type="date" className="bg-dark p-2 rounded w-full" value={from} onChange={e=>setFrom(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-gray-300 mb-1">Hasta</label>
          <input type="date" className="bg-dark p-2 rounded w-full" value={to} onChange={e=>setTo(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-gray-300 mb-1">Estado</label>
          <select className="bg-dark p-2 rounded w-full" value={status} onChange={e=>setStatus(e.target.value)}>
            <option value="">Todos</option>
            <option value="RECIBIDA">RECIBIDA</option>
            <option value="DIAGNOSTICO">DIAGNOSTICO</option>
            <option value="EN_PROCESO">EN_PROCESO</option>
            <option value="LISTA">LISTA</option>
            <option value="ENTREGADA">ENTREGADA</option>
          </select>
        </div>
        <div className="flex items-end gap-2">
          <button className="bg-primary px-3 py-2 rounded" onClick={load}>Aplicar</button>
          <a className="bg-dark px-3 py-2 rounded" href={csvUrl} target="_blank" rel="noreferrer">Descargar CSV</a>
          <button className="bg-dark px-3 py-2 rounded" onClick={()=>window.print()}>Imprimir (PDF)</button>
        </div>
      </div>

      {error && <div className="text-red-400">{error}</div>}

      <div className="bg-grayish p-3 rounded overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-gray-300">
            <tr>
              <th className="p-2">Código</th>
              <th className="p-2">Fecha</th>
              <th className="p-2">Cliente</th>
              <th className="p-2">Moto</th>
              <th className="p-2">Estado</th>
              <th className="p-2">Partes</th>
              <th className="p-2">Mano Obra</th>
              <th className="p-2">Total</th>
              <th className="p-2">Entrega Est.</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-t border-gray-700">
                <td className="p-2">{r.code}</td>
                <td className="p-2">{new Date(r.createdAt).toLocaleString()}</td>
                <td className="p-2">{r.client.name}</td>
                <td className="p-2">{r.motorcycle.brand} {r.motorcycle.model} ({r.motorcycle.plate})</td>
                <td className="p-2">{r.status}</td>
                <td className="p-2">{Number(r.totalParts)}</td>
                <td className="p-2">{Number(r.totalLabor)}</td>
                <td className="p-2">{Number(r.totalParts) + Number(r.totalLabor)}</td>
                <td className="p-2">{r.expectedAt ? new Date(r.expectedAt).toLocaleDateString() : '-'}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-700">
              <td className="p-2 font-medium" colSpan={7}>Total</td>
              <td className="p-2 font-medium">{total}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

