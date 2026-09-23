// Geocodificación ligera y determinista para el demo: busca nombres de lugares
// de Gran Canaria en el mensaje y devuelve unas coordenadas aproximadas.
// (En producción esto sería un geocoder real; aquí basta para pintar el mapa.)

export interface Zona {
  nombre: string
  lat: number
  lng: number
}

const ZONAS: { claves: string[]; zona: Zona }[] = [
  { claves: ['las palmas', 'lpgc', 'puerto'], zona: { nombre: 'Las Palmas de G.C.', lat: 28.1235, lng: -15.4363 } },
  { claves: ['telde'], zona: { nombre: 'Telde', lat: 28.0003, lng: -15.4166 } },
  { claves: ['vecindario', 'santa lucía', 'santa lucia'], zona: { nombre: 'Vecindario', lat: 27.8375, lng: -15.4408 } },
  { claves: ['arucas'], zona: { nombre: 'Arucas', lat: 28.1188, lng: -15.5236 } },
  { claves: ['gáldar', 'galdar'], zona: { nombre: 'Gáldar', lat: 28.1436, lng: -15.6544 } },
  { claves: ['maspalomas', 'san bartolomé', 'san bartolome', 'playa del inglés', 'playa del ingles'], zona: { nombre: 'Maspalomas', lat: 27.7606, lng: -15.586 } },
  { claves: ['agüimes', 'aguimes'], zona: { nombre: 'Agüimes', lat: 27.9062, lng: -15.4462 } },
  { claves: ['ingenio'], zona: { nombre: 'Ingenio', lat: 27.9231, lng: -15.4408 } },
  { claves: ['mogán', 'mogan', 'puerto rico'], zona: { nombre: 'Mogán', lat: 27.8815, lng: -15.7228 } },
  { claves: ['gc-1', 'autopista', 'gc1'], zona: { nombre: 'Corredor GC-1', lat: 28.02, lng: -15.42 } },
]

const CENTRO_GC: Zona = { nombre: 'Gran Canaria', lat: 28.05, lng: -15.47 }

/** Desplazamiento pequeño y determinista para que los pines no se solapen. */
function jitter(seed: string): { dLat: number; dLng: number } {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0
  return { dLat: ((h % 100) / 100 - 0.5) * 0.02, dLng: (((h >> 8) % 100) / 100 - 0.5) * 0.02 }
}

export function geocodeZona(mensaje: string, seed: string): { zona: string; lat: number; lng: number } {
  const t = mensaje.toLowerCase()
  const match = ZONAS.find((z) => z.claves.some((c) => t.includes(c)))
  const base = match?.zona ?? CENTRO_GC
  const { dLat, dLng } = jitter(seed)
  return { zona: base.nombre, lat: base.lat + dLat, lng: base.lng + dLng }
}
