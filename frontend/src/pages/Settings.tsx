import { API_URL } from '../lib/api';

export default function Settings() {
  return (
    <div className="grid gap-6 max-w-3xl">
      <h1 className="text-2xl font-semibold">Ajustes</h1>

      <section className="bg-grayish p-4 rounded">
        <h2 className="font-medium mb-2">Aplicación</h2>
        <div className="text-sm text-gray-300">API actual: {API_URL}</div>
      </section>

      <section className="bg-grayish p-4 rounded">
        <h2 className="font-medium mb-2">Notificaciones WhatsApp</h2>
        <p className="text-sm text-gray-300">
          El proveedor se configura en el backend (.env). Para usar Twilio, ajusta WHATSAPP_PROVIDER=twilio y credenciales.
        </p>
      </section>
    </div>
  );
}

