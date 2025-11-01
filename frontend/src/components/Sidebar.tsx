import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  PlusCircleIcon,
  UsersIcon,
  UserGroupIcon,
  CubeIcon,
  WrenchScrewdriverIcon,
  ClockIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'

function NavItem({ to, icon: Icon, label, active, collapsed }: { to: string; icon: any; label: string; active: boolean; collapsed?: boolean }) {
  return (
    <Link
      to={to}
      title={label}
      className={`flex ${collapsed ? 'justify-center' : 'items-center gap-3'} px-4 py-2 rounded-md transition-colors ${active ? 'bg-primary text-white' : 'hover:bg-gray-700 text-gray-200'}`}
    >
      <Icon className="w-5 h-5" />
      {!collapsed && <span className="text-sm font-medium">{label}</span>}
    </Link>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isActive = (prefix: string) => pathname === prefix || pathname.startsWith(prefix);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    setCollapsed(saved === '1');
  }, []);
  const toggleCollapsed = () => {
    const v = !collapsed;
    setCollapsed(v);
    localStorage.setItem('sidebar-collapsed', v ? '1' : '0');
  };

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-grayish border-r border-gray-700 min-h-screen flex flex-col transition-all duration-200`}>
      <div className={`p-4 flex ${collapsed ? 'justify-center' : 'items-center gap-3'} border-b border-gray-700`}>
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold">TM</div>
        {!collapsed && (
          <div>
            <div className="font-semibold">Taller Motos</div>
            <div className="text-xs text-gray-300">{user ? user.role : 'Invitado'}</div>
          </div>
        )}
      </div>

      {user && (
        <div className={`px-4 py-3 border-b border-gray-700 ${collapsed ? 'flex justify-center' : 'flex items-center gap-3'}`}>
          <div className="w-9 h-9 rounded-full bg-dark flex items-center justify-center text-sm font-semibold">
            {user.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          {!collapsed && (
            <div className="text-sm">
              <div className="font-medium">{user.name}</div>
              <div className="text-gray-300">{user.email}</div>
            </div>
          )}
        </div>
      )}

      <div className="p-3">
        <button title={collapsed ? 'Expandir' : 'Colapsar'} onClick={toggleCollapsed} className="w-full bg-dark px-3 py-2 rounded text-sm">{collapsed ? '»' : '«'} Menú</button>
      </div>

      <nav className="px-3 pb-3 grid gap-2 flex-1">
        <NavItem to="/" icon={HomeIcon} label="Tablero" active={pathname === '/'} collapsed={collapsed} />
        <NavItem to="/orders" icon={ClipboardDocumentListIcon} label="Órdenes" active={isActive('/orders') && pathname !== '/orders/new'} collapsed={collapsed} />
        <NavItem to="/orders/new" icon={PlusCircleIcon} label="Nueva Orden" active={pathname === '/orders/new'} collapsed={collapsed} />

        {user?.role === 'ADMIN' && (
          <>
            <NavItem to="/clients" icon={UsersIcon} label="Clientes" active={isActive('/clients')} collapsed={collapsed} />
            <NavItem to="/users" icon={UserGroupIcon} label="Usuarios" active={isActive('/users')} collapsed={collapsed} />
            <NavItem to="/reports" icon={ClipboardDocumentListIcon} label="Reportes" active={isActive('/reports')} collapsed={collapsed} />
          </>
        )}

        {/* Ambos roles pueden ver stock (crear solo ADMIN en la vista) */}
        <NavItem to="/products" icon={CubeIcon} label="Productos" active={isActive('/products')} collapsed={collapsed} />
        <NavItem to="/tools" icon={WrenchScrewdriverIcon} label="Herramientas" active={isActive('/tools')} collapsed={collapsed} />

        {/* Historial enlaza a órdenes por ahora */}
        <NavItem to="/orders" icon={ClockIcon} label="Historial" active={false} collapsed={collapsed} />

        {user?.role === 'ADMIN' && (
          <NavItem to="/settings" icon={Cog6ToothIcon} label="Ajustes" active={isActive('/settings')} collapsed={collapsed} />
        )}
      </nav>

      {user && (
        <div className="p-3 border-t border-gray-700">
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-700 text-gray-200">
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span className="text-sm font-medium">Salir</span>
          </button>
        </div>
      )}
    </aside>
  );
}
