import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import OrdersList from './pages/OrdersList';
import OrderForm from './pages/OrderForm';
import Clients from './pages/Clients';
import Products from './pages/Products';
import Tools from './pages/Tools';
import Sidebar from './components/Sidebar';
import Settings from './pages/Settings';
import Users from './pages/Users';
import Dashboard from './pages/Dashboard';
import OrderDetail from './pages/OrderDetail';
import Reports from './pages/Reports';

function Protected({ children, roles }: { children: JSX.Element; roles?: Array<'ADMIN'|'MECANICO'> }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const location = useLocation();
  const showSidebar = location.pathname !== '/login';
  return (
    <div className="min-h-screen flex">
      {showSidebar && <Sidebar />}
      <main className="flex-1 p-4 h-screen overflow-y-auto">
        <Routes>
          <Route path="/" element={<Protected roles={['ADMIN','MECANICO']}><Dashboard /></Protected>} />
          <Route path="/login" element={<Login />} />
          <Route path="/orders" element={<Protected><OrdersList /></Protected>} />
          <Route path="/orders/:id" element={<Protected><OrderDetail /></Protected>} />
          <Route path="/orders/new" element={<Protected roles={['ADMIN','MECANICO']}><OrderForm /></Protected>} />
          <Route path="/clients" element={<Protected roles={['ADMIN']}><Clients /></Protected>} />
          <Route path="/products" element={<Protected roles={['ADMIN','MECANICO']}><Products /></Protected>} />
          <Route path="/tools" element={<Protected roles={['ADMIN','MECANICO']}><Tools /></Protected>} />
          <Route path="/settings" element={<Protected roles={['ADMIN','MECANICO']}><Settings /></Protected>} />
          <Route path="/users" element={<Protected roles={['ADMIN']}><Users /></Protected>} />
          <Route path="/reports" element={<Protected roles={['ADMIN']}><Reports /></Protected>} />
        </Routes>
      </main>
    </div>
  );
}
