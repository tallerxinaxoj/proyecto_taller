import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import Card from '../components/ui/Card';
import SimpleBar from '../components/charts/SimpleBar';
import { Link } from 'react-router-dom';

type DashboardData = {
  totalClients: number;
  totalProducts: number;
  lowStock: number;
  byStatus: Record<string, number>;
}

export default function Dashboard() {
  const { token } = useAuth();
  const [data, setData] = useState<DashboardData>();
  const [error, setError] = useState('');
  const [products, setProducts] = useState<Array<{id:number; name:string; stock:number}>>([]);

  useEffect(() => {
    apiFetch<DashboardData>('/api/dashboard', {}, token).then(setData).catch((e:any)=>setError(e.message));
    apiFetch<Array<{id:number; name:string; stock:number}>>('/api/products', {}, token).then(setProducts).catch(()=>{});
  }, []);

  const lowList = useMemo(() => products.filter(p => p.stock < 5).sort((a,b)=>a.stock-b.stock).slice(0,5), [products]);
  const barData = useMemo(() => data ? Object.entries(data.byStatus).map(([label,value])=>({label, value})) : [], [data]);

  return (
    <div className="grid gap-6 max-w-6xl mx-auto">
      <PageHeader title="Tablero" subtitle="Resumen rápido de la operación" />
      {error && <div className="text-red-400">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><div className="text-sm text-gray-300">Clientes</div><div className="text-3xl font-bold">{data?.totalClients ?? '-'}</div></Card>
        <Card><div className="text-sm text-gray-300">Productos</div><div className="text-3xl font-bold">{data?.totalProducts ?? '-'}</div></Card>
        <Card><div className="text-sm text-gray-300">Bajo stock (&lt;5)</div><div className="text-3xl font-bold text-primary">{data?.lowStock ?? '-'}</div></Card>
      </div>
      <Card>
        <div className="font-medium mb-3">Órdenes por estado</div>
        <SimpleBar data={barData} />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div className="font-medium mb-3">Bajo stock (top 5)</div>
          <div className="grid gap-2">
            {lowList.length === 0 && <div className="text-sm text-gray-300">Sin alertas de stock</div>}
            {lowList.map(p => (
              <div key={p.id} className="flex justify-between text-sm">
                <div>{p.name}</div>
                <div className="text-primary font-semibold">{p.stock}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div className="font-medium mb-3">Acciones rápidas</div>
          <div className="grid grid-cols-2 gap-2">
            <Link to="/orders/new" className="bg-primary text-center py-2 rounded">Nueva orden</Link>
            <Link to="/products" className="bg-dark text-center py-2 rounded">Ver productos</Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
