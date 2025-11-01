export default function Location() {
  // Coordenadas: 15°19'34.6"N 91°33'32.8"W
  const lat = 15.326277;
  const lng = -91.559111;
  const embedUrl = `https://www.google.com/maps?q=${lat},${lng}&z=16&hl=es&output=embed`;
  const viewUrl = `https://www.google.com/maps?q=${lat},${lng}`;
  return (
    <div className="grid gap-6">
      <div className="text-2xl font-semibold">Ubicación</div>
      <div className="card p-6 rounded-xl grid gap-4">
        <div className="glass rounded p-4 text-sm leading-relaxed">
          <div className="font-semibold mb-1">¿Cómo llegar?</div>
          <p>
            <strong>En vehículo:</strong> Desde el centro de Huehuetenango, busque la calle principal hacia el Hospital Nacional; luego, tome la salida a Puente Arroyo. Al salir de Huehuetenango por Puente Arroyo avance <strong>4.3 km</strong> para llegar a nuestro taller.
          </p>
        </div>
        <div className="rounded-lg overflow-hidden ring-1 ring-white/10">
          <iframe
            title="Mapa Taller Xinaxoj"
            src={embedUrl}
            className="w-full h-80"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
        <div>
          <a href={viewUrl} target="_blank" rel="noreferrer" className="btn-primary">Abrir en Google Maps</a>
        </div>
      </div>
    </div>
  );
}
