import { useEffect, useState } from 'react';
import { API_URL, apiFetch } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

type Product = { id: number; name: string; stock: number; price: number };
type Client = { id: number; name: string; whatsapp: string };

export default function OrderForm() {
  const { token } = useAuth();
  const nav = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [useExistingClient, setUseExistingClient] = useState(true);
  const [clientId, setClientId] = useState<number>();
  const [client, setClient] = useState({ name: '', phone: '', whatsapp: '+502', dpi: '', email: '', address: '' });
  const [motorcycle, setMotorcycle] = useState({ brand: '', model: '', plate: '', vin: '', year: '' });
  const [items, setItems] = useState<Array<{ productId: number; quantity: number }>>([]);
  const [description, setDescription] = useState('');
  const [totalLabor, setTotalLabor] = useState<string>('');
  const [expectedAt, setExpectedAt] = useState<string>('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [showCam, setShowCam] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    apiFetch<Product[]>('/api/products', {}, token).then(setProducts);
    apiFetch<Client[]>('/api/clients', {}, token).then(setClients).catch(()=>{});
  }, []);

  const addItem = (productId: number) => {
    const exists = items.find(i => i.productId === productId);
    if (exists) return;
    setItems([...items, { productId, quantity: 1 }]);
  };

  // Util para formatear DPI (####-#####-####) desde solo dígitos
  const fmtDpi = (raw: string) => {
    const d = (raw || '').replace(/\D/g, '').slice(0, 13);
    const a = d.slice(0, 4), b = d.slice(4, 9), c = d.slice(9, 13);
    return [a, b, c].filter(Boolean).join('-');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const laborStr = (totalLabor ?? '').toString().trim();
    const labor = laborStr === '' ? 0 : Number(laborStr);
    const body: any = { description, motorcycle, items, totalLabor: labor, expectedAt };
    if (useExistingClient && clientId) body.clientId = clientId;
    else body.client = { ...client, dpi: fmtDpi(client.dpi) };
    const created = await apiFetch<any>('/api/orders', { method: 'POST', body: JSON.stringify(body) }, token);
    // Subir fotos si hay seleccionadas
    if (photos.length > 0) {
      const fd = new FormData();
      photos.forEach(f => fd.append('photos', f));
      await fetch(`${API_URL}/api/orders/${created.id}/photos`, {
        method: 'POST',
        body: fd,
        headers: token ? { Authorization: `Bearer ${token}` } as any : undefined
      }).catch(()=>{});
    }
    nav(`/orders/${created.id}`);
  };

  const onFiles = (fl: FileList | null) => {
    if (!fl) return;
    const arr = Array.from(fl).filter(f => f.type.startsWith('image/'));
    setPhotos(prev => [...prev, ...arr]);
  };

  const openCamera = async () => {
    try {
      // Obtener permisos y dispositivos
      const st = await navigator.mediaDevices.getUserMedia({ video: deviceId ? { deviceId: { exact: deviceId } } : { facingMode: 'environment' } });
      setStream(st);
      const devs = await navigator.mediaDevices.enumerateDevices();
      setDevices(devs.filter(d => d.kind === 'videoinput'));
      setShowCam(true);
    } catch (e) {
      alert('No se pudo acceder a la cámara. Asegúrate de dar permisos y usar HTTPS/localhost.');
    }
  };

  const closeCamera = () => {
    stream?.getTracks().forEach(t => t.stop());
    setStream(null);
    setShowCam(false);
  };

  const capturePhoto = async () => {
    const video = document.getElementById('cam-video') as HTMLVideoElement | null;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const blob = await new Promise<Blob | null>(res => canvas.toBlob(b => res(b), 'image/jpeg', 0.85));
    if (!blob) return;
    const file = new File([blob], `captura-${Date.now()}.jpg`, { type: 'image/jpeg' });
    setPhotos(prev => [file, ...prev]);
  };

  return (
    <form onSubmit={submit} className="grid gap-4 max-w-3xl mx-auto">
      <h1 className="text-xl">Nueva Orden</h1>

      {/* Sección: Cliente */}
      <div className="bg-grayish p-3 rounded">
        <div className="text-base font-semibold mb-2">Cliente</div>
        <label className="flex items-center gap-2 mb-2">
          <input type="checkbox" checked={useExistingClient} onChange={e => setUseExistingClient(e.target.checked)} />
          Usar cliente existente
        </label>
        {useExistingClient ? (
          <select className="bg-dark p-2 rounded w-full" onChange={e => setClientId(Number(e.target.value))}>
            <option>Seleccione cliente</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.whatsapp})</option>)}
          </select>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <input className="bg-dark p-2 rounded" placeholder="Nombre" onChange={e => setClient({ ...client, name: e.target.value })} />
            <input className="bg-dark p-2 rounded" placeholder="Teléfono" onChange={e => setClient({ ...client, phone: e.target.value })} />
            <input
              className="bg-dark p-2 rounded"
              placeholder="+502XXXXXXXX"
              value={client.whatsapp}
              onChange={e => {
                // Formato fijo +502 y 8 dígitos locales
                const only = e.target.value.replace(/\D/g, '');
                const local = only.startsWith('502') ? only.slice(3) : only;
                const limited = local.slice(0, 8);
                setClient({ ...client, whatsapp: `+502${limited}` });
              }}
            />
            <input className="bg-dark p-2 rounded" placeholder="DPI (####-#####-####)"
              value={fmtDpi(client.dpi)}
              onChange={e => {
                const digits = e.target.value.replace(/\D/g, '').slice(0,13);
                setClient({ ...client, dpi: digits });
              }} />
            <input className="bg-dark p-2 rounded" placeholder="Email" onChange={e => setClient({ ...client, email: e.target.value })} />
            <input className="bg-dark p-2 rounded col-span-2" placeholder="Dirección" onChange={e => setClient({ ...client, address: e.target.value })} />
          </div>
        )}
      </div>

      {/* Sección: Motocicleta */}
      <div className="bg-grayish p-3 rounded grid grid-cols-3 gap-2">
        <div className="col-span-3 text-base font-semibold mb-1">Motocicleta</div>
        <input className="bg-dark p-2 rounded" placeholder="Marca" onChange={e => setMotorcycle({ ...motorcycle, brand: e.target.value })} />
        <input className="bg-dark p-2 rounded" placeholder="Modelo" onChange={e => setMotorcycle({ ...motorcycle, model: e.target.value })} />
        <input className="bg-dark p-2 rounded" placeholder="Placa" onChange={e => setMotorcycle({ ...motorcycle, plate: e.target.value })} />
        <input className="bg-dark p-2 rounded" placeholder="VIN" onChange={e => setMotorcycle({ ...motorcycle, vin: e.target.value })} />
        <input className="bg-dark p-2 rounded" type="number" placeholder="Año" onChange={e => setMotorcycle({ ...motorcycle, year: e.target.value })} />
      </div>

      <div className="bg-grayish p-3 rounded">
        <div className="text-base font-semibold mb-2">Productos</div>
        <div className="flex gap-2 flex-wrap mb-3">
          {products.map(p => (
            <button type="button" key={p.id} className="bg-dark px-2 py-1 rounded"
              disabled={items.some(i => i.productId===p.id) || p.stock<=0}
              onClick={() => addItem(p.id)}>
              {p.name} (stock {p.stock})
            </button>
          ))}
        </div>
        <div className="grid gap-2">
          {items.map((i, idx) => {
            const p = products.find(pp => pp.id===i.productId)!;
            return (
              <div key={i.productId} className="flex items-center gap-2">
                <div className="w-48">{p.name}</div>
                <input type="number" className="bg-dark p-1 rounded w-24" min={1} max={p.stock}
                  value={i.quantity} onChange={e => {
                    const v = Number(e.target.value);
                    const arr = [...items]; arr[idx] = { ...i, quantity: v }; setItems(arr);
                  }} />
                <button type="button" className="text-red-400" onClick={() => setItems(items.filter(x=>x.productId!==i.productId))}>Quitar</button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sección: Detalles */}
      <div className="grid md:grid-cols-2 gap-3">
        <div className="bg-grayish p-3 rounded">
          <div className="text-base font-semibold mb-2">Detalles</div>
          <label className="block text-xs text-gray-300 mb-1">Descripción</label>
          <textarea className="bg-dark p-2 rounded w-full" placeholder="Descripción" onChange={e => setDescription(e.target.value)} />
        </div>
        <div className="bg-grayish p-3 rounded grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-300 mb-1">Mano de obra</label>
            <input type="text" inputMode="decimal" className="bg-dark p-2 rounded w-full" placeholder="0" value={totalLabor} onChange={e=>setTotalLabor(e.target.value.replace(/^0+(?=\d)/,''))} />
          </div>
          <div>
            <label className="block text-xs text-gray-300 mb-1">Fecha entrega estimada</label>
            <input type="date" className="bg-dark p-2 rounded w-full" value={expectedAt} onChange={e=>setExpectedAt(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="bg-grayish p-3 rounded grid gap-2">
        <div className="text-base font-semibold">Fotos de la moto (opcional)</div>
        <div className="flex items-center gap-2">
          <input type="file" accept="image/*" multiple capture="environment" onChange={e=>onFiles(e.target.files)} />
          <button type="button" className="bg-dark px-3 py-1 rounded" onClick={openCamera}>Tomar foto</button>
        </div>
        {photos.length>0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {photos.map((f, i) => (
              <div key={i} className="relative group">
                <img src={URL.createObjectURL(f)} alt="preview" className="w-full h-28 object-cover rounded" />
                <button type="button" className="absolute top-1 right-1 text-xs bg-red-600 px-2 py-1 rounded opacity-0 group-hover:opacity-100" onClick={()=>setPhotos(photos.filter((_,idx)=>idx!==i))}>Quitar</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="bg-primary px-4 py-2 rounded">Crear Orden</button>

      {showCam && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-grayish p-3 rounded w-full max-w-xl grid gap-2">
            <div className="flex items-center justify-between">
              <div className="font-medium">Cámara</div>
              <button type="button" onClick={closeCamera}>Cerrar</button>
            </div>
            {devices.length>0 && (
              <select className="bg-dark p-2 rounded" value={deviceId} onChange={e=>setDeviceId(e.target.value)}>
                <option value="">(Predeterminada)</option>
                {devices.map(d => (<option key={d.deviceId} value={d.deviceId}>{d.label || 'Cámara'}</option>))}
              </select>
            )}
            <video id="cam-video" className="w-full h-64 bg-black rounded" autoPlay playsInline muted ref={(v)=>{ if (v && stream) v.srcObject = stream as any; }} />
            <div className="flex gap-2">
              <button type="button" className="bg-dark px-3 py-1 rounded" onClick={async()=>{ closeCamera(); await openCamera(); }}>Cambiar/Refrescar</button>
              <button type="button" className="bg-primary px-3 py-1 rounded" onClick={capturePhoto}>Capturar</button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
