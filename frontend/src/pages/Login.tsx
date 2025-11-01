import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { WrenchScrewdriverIcon } from '@heroicons/react/24/solid';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('admin@taller.local');
  const [password, setPassword] = useState('Admin123!');
  const [error, setError] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      nav('/');
    } catch (e: any) {
      setError(e.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-grayish p-6 rounded border border-black/30 card-shadow">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <WrenchScrewdriverIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold leading-tight">Iniciar sesión</h1>
            <p className="text-sm text-gray-300">Taller de Motos</p>
          </div>
        </div>
        <input className="w-full mb-2 p-2 rounded bg-dark" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full mb-2 p-2 rounded bg-dark" placeholder="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        {error && <div className="text-red-400 mb-2">{error.replace('sesi�n','sesión')}</div>}
        <button className="bg-primary w-full py-2 rounded">Entrar</button>
      </form>
    </div>
  );
}
