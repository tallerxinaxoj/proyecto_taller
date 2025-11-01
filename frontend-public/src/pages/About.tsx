const IMG_ABOUT = (import.meta.env.VITE_IMG_ABOUT as string) || '/mot.jpg';
const IMG_HISTORY = (import.meta.env.VITE_IMG_HISTORY as string) || '/his.jpg';

export default function About() {
  return (
    <div className="grid gap-12">
      {/* Sobre nosotros */}
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-semibold mb-3">Más de 15 años cuidando tu motocicleta</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Fundado en 2008 Taller Xinaxoj nació de la pasión por las motocicletas y el compromiso de brindar el mejor servicio técnico
            especializado en Huehuetenango.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Lo que comenzó como un pequeño taller familiar, hoy se ha convertido en una de las referencias más confiables para el
            mantenimiento y reparación de motocicletas en el área.
          </p>
        </div>
        <div className="card overflow-hidden aspect-[16/9]">
          <picture>
            <source srcSet={(IMG_ABOUT && IMG_ABOUT.replace(/(\.[a-zA-Z0-9]+)$/,'@2x$1')) || '/mot@2x.jpg'} media="(min-resolution: 2dppx)" />
            <img src={IMG_ABOUT || '/mot.jpg'} alt="sobre nosotros" className="w-full h-full object-cover object-center" loading="lazy"/>
          </picture>
        </div>
      </section>

      {/* Nuestros valores */}
      <section className="grid gap-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold">Nuestros Valores</h3>
          <p className="text-gray-300">Los principios que guían nuestro trabajo diario.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {icon:'🎯', title:'Experiencia', text:'Más de 15 años perfeccionando nuestras técnicas y conocimientos en mecánica de motocicletas.'},
            {icon:'🛡️', title:'Confiabilidad', text:'Cada trabajo cuenta con garantía y el respaldo de nuestra reputación.'},
            {icon:'❤️', title:'Pasión', text:'Amamos las motocicletas tanto como tú; trabajamos cada reparación con dedicación.'},
          ].map((v,i)=> (
            <div key={i} className="card p-6 rounded-2xl text-center">
              <div className="text-3xl mb-2">{v.icon}</div>
              <div className="font-semibold mb-1">{v.title}</div>
              <div className="text-gray-300 text-sm leading-relaxed">{v.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Nuestro equipo */}
      <section className="grid gap-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold">Nuestro Equipo</h3>
          <p className="text-gray-300">Conoce a los especialistas que cuidan tu motocicleta.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {name:'Oliver López', role:'Fundador y Mecánico Principal', bio:'Con más de 15 años de experiencia, Oliver es un apasionado de las motocicletas que ha dedicado su vida a este oficio.', esp:'Motores y diagnóstico', initials:'OL'},
            {name:'Oscar Lopez', role:'Mecánico', bio:'Experto en cajas de cambio, embragues y sistemas de transmisión; además, especialista en frenos.', esp:'Transmisión y frenos', initials:'OL'},
          ].map((p,i)=> (
            <div key={i} className="card p-6 rounded-2xl text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-3 bg-gradient-to-b from-gray-900 to-gray-700 flex items-center justify-center font-semibold">{p.initials}</div>
              <div className="font-semibold">{p.name}</div>
              <div className="text-xs bg-white/10 rounded-full inline-block px-3 py-1 my-2 text-gray-200">{p.role}</div>
              <p className="text-gray-300 leading-relaxed text-sm">{p.bio}</p>
              <div className="mt-2 font-semibold">Especialidad: {p.esp}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Historia */}
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div className="card overflow-hidden rounded-2xl aspect-[16/9]">
          <img src={IMG_HISTORY || 'https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=1600&auto=format&fit=crop'} alt="historia" className="w-full h-full object-cover object-center" loading="lazy"/>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Nuestra Historia</h3>
          <ul className="grid gap-3">
            <li>
              <div className="font-semibold">2008 - Los Inicios</div>
              <div className="text-gray-300 text-sm">Apertura del primer taller en un pequeño local con el sueño de ofrecer servicios de calidad.</div>
            </li>
            <li>
              <div className="font-semibold">2015 - Expansión</div>
              <div className="text-gray-300 text-sm">El taller crece y amplía la gama de servicios ofrecidos.</div>
            </li>
            <li>
              <div className="font-semibold">2020 - Modernización</div>
              <div className="text-gray-300 text-sm">Implementación de diagnóstico computarizado y actualización de herramientas.</div>
            </li>
            <li>
              <div className="font-semibold">2025 - Presente</div>
              <div className="text-gray-300 text-sm">Referencia en el mercado local con un equipo consolidado y clientes satisfechos.</div>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
