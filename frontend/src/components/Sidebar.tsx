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

function NavItem({ to, icon: Icon, label, active }: { to: string; icon: any; label: string; active: boolean }) {
  return (
    <Link to={to} className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${active ? 'bg-primary text-white' : 'hover:bg-gray-700 text-gray-200'}`}>
      <Icon className="w-5 h-5" />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isActive = (prefix: string) => pathname === prefix || pathname.startsWith(prefix);

  return (
    <aside className="w-64 bg-grayish border-r border-gray-700 min-h-screen flex flex-col">
      <div className="p-4 flex items-center gap-3 border-b border-gray-700">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold">TM</div>
        <div>
          <div className="font-semibold">Taller Motos</div>
          <div className="text-xs text-gray-300">{user ? user.role : 'Invitado'}</div>
        </div>
      </div>

      {user && (
        <div className="px-4 py-3 border-b border-gray-700 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-dark flex items-center justify-center text-sm font-semibold">
            {user.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="text-sm">
            <div className="font-medium">{user.name}</div>
            <div className="text-gray-300">{user.email}</div>
          </div>
        </div>
      )}

      <nav className="p-3 grid gap-2 flex-1">
        <NavItem to="/" icon={HomeIcon} label="Tablero" active={isActive('/') && pathname === '/'} />
        <NavItem to="/orders" icon={ClipboardDocumentListIcon} label="Órdenes" active={isActive('/orders') && pathname !== '/orders/new'} />
        <NavItem to="/orders/new" icon={PlusCircleIcon} label="Nueva Orden" active={pathname === '/orders/new'} />

        {user?.role === 'ADMIN' && (
          <>
            <NavItem to="/clients" icon={UsersIcon} label="Clientes" active={isActive('/clients')} />
            <NavItem to="/users" icon={UserGroupIcon} label="Usuarios" active={isActive('/users')} />
          </>
        )}

        {/* Ambos roles pueden ver stock (crear solo ADMIN en la vista) */}
        <NavItem to="/products" icon={CubeIcon} label="Productos" active={isActive('/products')} />
        <NavItem to="/tools" icon={WrenchScrewdriverIcon} label="Herramientas" active={isActive('/tools')} />

        {/* Historial enlaza a órdenes por ahora */}
        <NavItem to="/orders" icon={ClockIcon} label="Historial" active={false} />

        <NavItem to="/settings" icon={Cog6ToothIcon} label="Ajustes" active={isActive('/settings')} />
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
