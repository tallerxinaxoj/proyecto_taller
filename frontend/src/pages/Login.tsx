import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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
    <form onSubmit={onSubmit} className="max-w-sm mx-auto bg-grayish p-6 rounded">
      <h1 className="text-xl mb-4">Ingresar</h1>
      <input className="w-full mb-2 p-2 rounded bg-dark" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="w-full mb-2 p-2 rounded bg-dark" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      {error && <div className="text-red-400 mb-2">{error}</div>}
      <button className="bg-primary w-full py-2 rounded">Entrar</button>
    </form>
  );
}

