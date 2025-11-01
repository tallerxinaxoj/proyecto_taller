const ADMIN_URL = import.meta.env.VITE_ADMIN_URL || 'http://localhost:5173';
const SHOW_ADMIN = String(import.meta.env.VITE_SHOW_ADMIN_LINK || 'false') === 'true';
const IMG_HERO = (import.meta.env.VITE_IMG_HERO as string) || '';
const LOGO_URL = (import.meta.env.VITE_LOGO_URL as string) || '';

export default function Home() {
  return (
    <div className="grid gap-12">
      {/* Hero */}
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl font-bold mb-3 leading-tight">Taller Especializado en Motocicletas</h1>
          <p className="text-gray-300 mb-6">En Xinaxoj brindamos servicios completos de mantenimiento, reparación y diagnóstico para todo tipo de motocicletas. Nuestro equipo especializado garantiza el mejor cuidado para tu vehículo.</p>
          <div className="flex flex-wrap gap-3">
            <a href="/contacto" className="btn-primary">Solicitar Cita</a>
            <a href="/ubicacion" className="btn-dark">Cómo llegar</a>
            {SHOW_ADMIN && (
              <a href={ADMIN_URL} className="btn-dark">Acceso Personal</a>
            )}
          </div>
        </div>
        <div className="relative">
          <div className="card overflow-hidden h-64 md:h-80 ring-1 ring-white/10 hover:ring-primary/30 transition flex items-center justify-center">
            <img
              src={LOGO_URL || IMG_HERO || 'https://images.unsplash.com/photo-1520880867055-1e30d1cb001c?q=80&w=1600&auto=format&fit=crop'}
              alt="logo"
              className={`${LOGO_URL ? 'object-contain p-6 bg-white/90 rounded-md' : 'object-cover'} w-full h-full`}
            />
          </div>
          <div className="absolute -z-10 -inset-4 rounded-2xl blur-2xl bg-primary/20"></div>
        </div>
      </section>

      {/* Servicios */}
      <section className="grid gap-4">
        <div className="text-center">
          <div className="text-xl font-semibold">Nuestros Servicios</div>
          <div className="text-gray-300">Ofrecemos una gama completa de servicios especializados para mantener tu motocicleta en perfectas condiciones.</div>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {t:'Mantenimiento Preventivo', d:'Cambios de aceite, filtros, bujías y revisiones generales para mantener tu moto en óptimas condiciones.'},
            {t:'Reparaciones Mecánicas', d:'Diagnóstico y reparación de motores, transmisión, frenos y sistemas eléctricos.'},
            {t:'Diagnóstico Computarizado', d:'Análisis con equipos especializados para detectar fallas en sistemas modernos.'},
            {t:'Restauración', d:'Servicios completos de restauración para motocicletas clásicas y vintage.'},
            {t:'Personalización', d:'Modificaciones y mejoras estéticas para personalizar tu motocicleta.'},
            {t:'Venta de Repuestos', d:'Amplio catálogo de repuestos originales y compatibles para todas las marcas.'},
          ].map((s,i)=> (
            <div key={i} className="card p-5 rounded-xl hover:translate-y-[-2px] transition-transform">
              <div className="font-semibold mb-1">{s.t}</div>
              <div className="text-sm text-gray-300 leading-relaxed">{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Sección de CTA removida por redundancia */}

      {/* Se eliminó la sección de contacto rápido para centralizarlo en la página de Contacto */}
    </div>
  );
}
