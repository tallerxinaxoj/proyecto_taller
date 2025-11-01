import { API_URL, apiFetch } from '../lib/api';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { token } = useAuth();
  const [to, setTo] = useState('');
  const [body, setBody] = useState('Mensaje de prueba desde Taller');
  const [msg, setMsg] = useState('');
  const [provider, setProvider] = useState<string>('');
  const [status, setStatus] = useState<{ provider: string; ready: boolean; reason?: string }|null>(null);
  useEffect(() => {
    apiFetch<{provider:string}>('/api/notifications/config', {}, token).then(r=>setProvider(r.provider)).catch(()=>{});
    apiFetch('/api/notifications/status', {}, token).then(setStatus).catch(()=>{});
  }, []);
  const send = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg('');
    try {
      await apiFetch('/api/notifications/test', { method: 'POST', body: JSON.stringify({ to, body }) }, token);
      setMsg('Enviado correctamente. Revisa consola o WhatsApp según proveedor.');
    } catch (e: any) { setMsg(e.message); }
  };
  return (
    <div className="grid gap-6 max-w-3xl">
      <h1 className="text-2xl font-semibold">Ajustes</h1>

      <section className="bg-grayish p-4 rounded">
        <h2 className="font-medium mb-2">Aplicación</h2>
        <div className="text-sm text-gray-300">API actual: {API_URL}</div>
      </section>

      <section className="bg-grayish p-4 rounded">
        <h2 className="font-medium mb-2">Notificaciones WhatsApp</h2>
        <p className="text-sm text-gray-300 mb-1">Proveedor actual: <span className="text-primary">{status?.provider || provider || '...'}</span></p>
        {status && (
          <p className="text-sm mb-3 {status.ready? 'text-green-400':'text-red-400'}">{status.ready ? 'Listo para enviar.' : `No listo: ${status.reason}`}</p>
        )}
        <p className="text-sm text-gray-300 mb-3">Configura en backend/.env. Para Twilio (sandbox), une tu WhatsApp al número de Twilio con el join code desde la consola.</p>
        <form onSubmit={send} className="grid grid-cols-3 gap-2">
          <input className="bg-dark p-2 rounded col-span-1" placeholder="WhatsApp destino (+502...)" value={to} onChange={e=>setTo(e.target.value)} />
          <input className="bg-dark p-2 rounded col-span-2" placeholder="Mensaje" value={body} onChange={e=>setBody(e.target.value)} />
          <button className="bg-primary px-3 py-2 rounded col-span-3" disabled={status ? !status.ready : false}>Enviar prueba</button>
        </form>
        {msg && <div className="text-sm mt-2">{msg}</div>}
      </section>
    </div>
  );
}
