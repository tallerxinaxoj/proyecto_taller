import { Link, NavLink, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import About from './pages/About';
import Location from './pages/Location';
import Contact from './pages/Contact';

const ADMIN_URL = import.meta.env.VITE_ADMIN_URL || 'http://localhost:5173';
const SITE_NAME = import.meta.env.VITE_SITE_NAME || 'Taller Motos';
const SHOW_ADMIN = String(import.meta.env.VITE_SHOW_ADMIN_LINK || 'false') === 'true';
const LOGO_URL = (import.meta.env.VITE_LOGO_URL as string) || '';

function Navbar() {
  const [theme, setTheme] = useState<'dark'|'light'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    const prefersLight = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    return prefersLight ? 'light' : 'dark';
  });
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') root.classList.add('theme-light'); else root.classList.remove('theme-light');
    localStorage.setItem('theme', theme);
  }, [theme]);
  const link = (to: string, label: string) => (
    <NavLink to={to} className={({isActive}) => `pill ${isActive? 'pill-active':'pill-idle'}`}>{label}</NavLink>
  );
  return (
    <header className="sticky top-0 z-10 glass">
      <div className="container flex items-center justify-between h-14">
        <a href={ADMIN_URL} title="Ir al sistema" className="flex items-center gap-3">
          {LOGO_URL ? (
            <img src={LOGO_URL} alt="logo" className="w-9 h-9 rounded-xl object-contain bg-white" onError={(e)=>{ (e.currentTarget as HTMLImageElement).style.display='none'; }} />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-primary/90 flex items-center justify-center font-bold shadow">X</div>
          )}
          <span className="font-semibold hidden sm:block">{SITE_NAME}</span>
        </a>
        <nav className="flex items-center gap-2 text-sm">
          {link('/', 'Inicio')}
          {link('/quienes-somos', 'Quiénes somos')}
          {link('/ubicacion', 'Ubicación')}
          {link('/contacto', 'Contacto')}
          <button
            className="pill pill-idle ml-2"
            title="Cambiar tema"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >{theme === 'light' ? '☾ Oscuro' : '☀ Claro'}</button>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-10">
      <div className="container text-sm text-gray-300 py-6 flex justify-between border-t border-white/10">
        <div>© {new Date().getFullYear()} {SITE_NAME}</div>
        {SHOW_ADMIN && <a href={ADMIN_URL} className="text-primary">Sistema de administración</a>}
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container flex-1 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quienes-somos" element={<About />} />
          <Route path="/ubicacion" element={<Location />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
