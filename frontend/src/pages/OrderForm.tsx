import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
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
  const [client, setClient] = useState({ name: '', phone: '', whatsapp: '', email: '', address: '' });
  const [motorcycle, setMotorcycle] = useState({ brand: '', model: '', plate: '', vin: '', year: '' });
  const [items, setItems] = useState<Array<{ productId: number; quantity: number }>>([]);
  const [description, setDescription] = useState('');
  const [totalLabor, setTotalLabor] = useState<number>(0);
  const [expectedAt, setExpectedAt] = useState<string>('');

  useEffect(() => {
    apiFetch<Product[]>('/api/products', {}, token).then(setProducts);
    apiFetch<Client[]>('/api/clients', {}, token).then(setClients).catch(()=>{});
  }, []);

  const addItem = (productId: number) => {
    const exists = items.find(i => i.productId === productId);
    if (exists) return;
    setItems([...items, { productId, quantity: 1 }]);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body: any = { description, motorcycle, items, totalLabor, expectedAt };
    if (useExistingClient && clientId) body.clientId = clientId;
    else body.client = client;
    await apiFetch('/api/orders', { method: 'POST', body: JSON.stringify(body) }, token);
    nav('/orders');
  };

  return (
    <form onSubmit={submit} className="grid gap-3 max-w-4xl">
      <h1 className="text-xl">Nueva Orden</h1>

      <div className="bg-grayish p-3 rounded">
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
            <input className="bg-dark p-2 rounded" placeholder="WhatsApp" onChange={e => setClient({ ...client, whatsapp: e.target.value })} />
            <input className="bg-dark p-2 rounded" placeholder="Email" onChange={e => setClient({ ...client, email: e.target.value })} />
            <input className="bg-dark p-2 rounded col-span-2" placeholder="Dirección" onChange={e => setClient({ ...client, address: e.target.value })} />
          </div>
        )}
      </div>

      <div className="bg-grayish p-3 rounded grid grid-cols-3 gap-2">
        <input className="bg-dark p-2 rounded" placeholder="Marca" onChange={e => setMotorcycle({ ...motorcycle, brand: e.target.value })} />
        <input className="bg-dark p-2 rounded" placeholder="Modelo" onChange={e => setMotorcycle({ ...motorcycle, model: e.target.value })} />
        <input className="bg-dark p-2 rounded" placeholder="Placa" onChange={e => setMotorcycle({ ...motorcycle, plate: e.target.value })} />
        <input className="bg-dark p-2 rounded" placeholder="VIN" onChange={e => setMotorcycle({ ...motorcycle, vin: e.target.value })} />
        <input className="bg-dark p-2 rounded" type="number" placeholder="Año" onChange={e => setMotorcycle({ ...motorcycle, year: e.target.value })} />
      </div>

      <div className="bg-grayish p-3 rounded">
        <div className="mb-2">Productos</div>
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

      <div className="grid md:grid-cols-2 gap-3">
        <div className="bg-grayish p-3 rounded">
          <label className="block text-xs text-gray-300 mb-1">Descripción</label>
          <textarea className="bg-dark p-2 rounded w-full" placeholder="Descripción" onChange={e => setDescription(e.target.value)} />
        </div>
        <div className="bg-grayish p-3 rounded grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-300 mb-1">Mano de obra</label>
            <input type="number" className="bg-dark p-2 rounded w-full" placeholder="0" value={totalLabor} onChange={e=>setTotalLabor(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-xs text-gray-300 mb-1">Fecha entrega estimada</label>
            <input type="date" className="bg-dark p-2 rounded w-full" value={expectedAt} onChange={e=>setExpectedAt(e.target.value)} />
          </div>
        </div>
      </div>

      <button className="bg-primary px-4 py-2 rounded">Crear Orden</button>
    </form>
  );
}
