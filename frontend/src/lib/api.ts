// Normaliza la URL base del API para evitar casos como ":4000" o valores sin protocolo
function normalizeApiUrl(raw?: string): string {
  let base = (raw || '').trim();
  if (!base) base = 'http://localhost:4000';
  // Si viene como ":4000" o "//localhost:4000", arma con el protocolo/host actual
  if (base.startsWith(':')) {
    const { protocol, hostname } = window.location;
    base = `${protocol}//${hostname}${base}`;
  }
  // Si no tiene protocolo http/https, asumir http
  if (!/^https?:\/\//i.test(base)) {
    base = `http://${base}`;
  }
  // Quita barra final
  return base.replace(/\/+$/, '');
}

export const API_URL = normalizeApiUrl(import.meta.env.VITE_API_URL);

export async function apiFetch<T>(path: string, opts: RequestInit = {}, token?: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Error ${res.status}`);
  }
  return res.json();
}
