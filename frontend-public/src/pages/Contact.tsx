export default function Contact() {
  const PHONE_DISPLAY = '+502 5324-2514';
  const PHONE_TEL = '+50253242514';
  const EMAIL = 'tallerxinaxoj@gmail.com';
  return (
    <div id="contacto" className="grid gap-6">
      <div className="text-2xl font-semibold">Contacto</div>
      <div className="card p-6 rounded-xl grid md:grid-cols-3 gap-6">
        <div className="md:col-span-3">
          <a
            className="btn-primary"
            href={`https://wa.me/50236303462?text=${encodeURIComponent('Hola, deseo agendar una cita.')}`}
            target="_blank"
            rel="noreferrer"
          >
            Solicitar Cita por WhatsApp
          </a>
        </div>
        <div>
          <div className="font-semibold mb-1">Taller Xinaxoj</div>
          <div className="text-gray-300 leading-relaxed">Especialistas en reparación y mantenimiento de motocicletas con más de 15 años de experiencia.</div>
        </div>
        <div>
          <div className="font-semibold mb-1">Contacto</div>
          <div className="text-gray-300">Teléfono: <a className="text-primary" href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a></div>
          <div className="text-gray-300">Correo: <a className="text-primary" href={`mailto:${EMAIL}`}>{EMAIL}</a></div>
          <div className="text-gray-300">Dirección: Aldea Xinaxoj, Huehuetenango, Guatemala</div>
        </div>
        <div>
          <div className="font-semibold mb-1">Horarios</div>
          <div className="text-gray-300">Lunes - Viernes: 8:00 AM - 6:00 PM</div>
          <div className="text-gray-300">Sábados: 8:00 AM - 4:00 PM</div>
          <div className="text-gray-300">Domingos: Cerrado</div>
        </div>
      </div>
    </div>
  );
}
