import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL, apiFetch } from '../lib/api';
import { useAuth } from '../context/AuthContext';

type OrderDetail = {
  id: number; code: string; status: string; description?: string; totalParts: number; totalLabor: number; expectedAt?: string;
  client: { name: string; whatsapp?: string };
  motorcycle: { brand: string; model: string; plate: string };
  items: Array<{ id: number; quantity: number; unitPrice: number; product: { id: number; name: string } }>;
  history: Array<{ id: number; status: string; note?: string; createdAt: string }>;
}

type OrderPhoto = { id: number; path: string; mimeType: string; size: number; createdAt: string };

export default function OrderDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState<OrderDetail>();
  const [error, setError] = useState('');
  const [photos, setPhotos] = useState<OrderPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);

  useEffect(() => {
    apiFetch<OrderDetail>(`/api/orders/${id}`, {}, token).then(setOrder).catch((e:any)=>setError(e.message));
    apiFetch<OrderPhoto[]>(`/api/orders/${id}/photos`, {}, token).then(setPhotos).catch(()=>{});
  }, [id]);

  const doUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files || files.length === 0) return;
    const fd = new FormData();
    Array.from(files).forEach(f => fd.append('photos', f));
    setUploading(true);
    try {
      const res = await fetch(`${API_URL}/api/orders/${id}/photos`, {
        method: 'POST',
        body: fd,
        headers: token ? { Authorization: `Bearer ${token}` } as any : undefined
      });
      if (!res.ok) throw new Error((await res.json().catch(()=>({}))).error || `Error ${res.status}`);
      const created = await res.json();
      setPhotos(prev => [...created, ...prev]);
      setFiles(null);
    } catch (e:any) {
      alert(e.message || 'No se pudieron subir las fotos');
    } finally { setUploading(false); }
  };

  const removePhoto = async (p: OrderPhoto) => {
    if (!confirm('Eliminar foto?')) return;
    try {
      await apiFetch(`/api/orders/${id}/photos/${p.id}`, { method: 'DELETE' }, token);
      setPhotos(photos.filter(x => x.id !== p.id));
    } catch (e: any) {
      alert(e.message || 'No se pudo eliminar');
    }
  };

  if (error) return <div className="text-red-400">{error}</div>;
  if (!order) return <div>Cargando...</div>;

  const total = Number(order.totalParts) + Number(order.totalLabor);

  return (
    <div className="grid gap-4 max-w-4xl">
      <h1 className="text-2xl font-semibold">Orden {order.code}</h1>
      <div className="grid md:grid-cols-2 gap-3">
        <div className="bg-grayish p-3 rounded">
          <div className="font-medium">Cliente</div>
          <div>{order.client.name}</div>
          {order.client.whatsapp && <div className="text-sm text-gray-300">WhatsApp: {order.client.whatsapp}</div>}
        </div>
        <div className="bg-grayish p-3 rounded">
          <div className="font-medium">Moto</div>
          <div>{order.motorcycle.brand} {order.motorcycle.model}</div>
          <div className="text-sm text-gray-300">Placa: {order.motorcycle.plate}</div>
        </div>
      </div>

      <div className="bg-grayish p-3 rounded">
        <div className="font-medium mb-2">Items</div>
        <div className="grid gap-1">
          {order.items.map(it => (
            <div key={it.id} className="flex justify-between">
              <div>{it.product.name} × {it.quantity}</div>
              <div>Q {Number(it.unitPrice) * it.quantity}</div>
            </div>
          ))}
          {order.items.length === 0 && <div className="text-sm text-gray-300">Sin productos</div>}
        </div>
      </div>

      <div className="bg-grayish p-3 rounded">
        <div className="font-medium mb-2">Totales</div>
        <div className="flex justify-between"><span>Partes</span><span>Q {Number(order.totalParts)}</span></div>
        <div className="flex justify-between"><span>Mano de obra</span><span>Q {Number(order.totalLabor)}</span></div>
        <div className="flex justify-between font-semibold"><span>Total</span><span>Q {total}</span></div>
        {order.expectedAt && <div className="mt-2 text-sm text-gray-300">Entrega estimada: {new Date(order.expectedAt).toLocaleDateString()}</div>}
      </div>

      <div className="bg-grayish p-3 rounded">
        <div className="font-medium mb-2">Historial</div>
        <div className="grid gap-2">
          {order.history.map(h => (
            <div key={h.id} className="flex justify-between text-sm">
              <div>{new Date(h.createdAt).toLocaleString()}</div>
              <div className="text-primary">{h.status}</div>
              <div className="text-gray-300">{h.note || ''}</div>
            </div>
          ))}
          {order.history.length === 0 && <div className="text-sm text-gray-300">Sin historial</div>}
        </div>
      </div>

      <div className="bg-grayish p-3 rounded">
        <div className="font-medium mb-2">Fotos</div>
        <form onSubmit={doUpload} className="flex items-center gap-2 mb-3">
          <input type="file" accept="image/*" multiple onChange={(e)=>setFiles(e.target.files)} />
          <button className="bg-primary px-3 py-1 rounded" disabled={uploading || !files || files.length===0}>{uploading ? 'Subiendo...' : 'Subir'}</button>
        </form>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {photos.map(p => (
            <div key={p.id} className="relative group">
              <img src={`${API_URL}${p.path}`} alt="foto" className="w-full h-36 object-cover rounded" />
              <button type="button" onClick={()=>removePhoto(p)} className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100">Eliminar</button>
            </div>
          ))}
          {photos.length === 0 && <div className="text-sm text-gray-300">Sin fotos</div>}
        </div>
      </div>
    </div>
  );
}
