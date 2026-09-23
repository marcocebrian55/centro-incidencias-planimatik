import type { IncidentType, Severity, TriageResult } from '../types'

const ACCION: Record<IncidentType, string> = {
  retraso: 'Avisar al cliente del nuevo ETA y registrar el retraso en la ruta.',
  averia: 'Enviar asistencia o grúa y valorar reasignar la carga a otro vehículo.',
  direccion_erronea: 'Confirmar la dirección con el cliente y actualizar la parada en la ruta.',
  cliente_ausente: 'Contactar al destinatario y reprogramar la entrega.',
  mercancia_danada: 'Documentar con fotos, abrir incidencia de daños y notificar al cliente.',
  otro: 'Revisar manualmente y asignar a un operador.',
}

const KEYWORDS: Record<Exclude<IncidentType, 'otro'>, string[]> = {
  averia: ['pinch', 'averi', 'rueda', 'motor', 'batería', 'bateria', 'grúa', 'grua', 'no arranca', 'fallo mecánico', 'fallo mecanico', 'humo'],
  retraso: ['tarde', 'retras', 'atasco', 'tráfico', 'trafico', 'demora', 'llego', 'llegar', 'cola', 'esperando'],
  direccion_erronea: ['direcc', 'no existe', 'no encuentro', 'gps', 'calle', 'código postal', 'codigo postal', 'no cuadra', 'mal la dirección'],
  cliente_ausente: ['no hay nadie', 'ausente', 'no contesta', 'no está', 'no esta', 'cerrado', 'no abre', 'nadie en casa', 'no responde'],
  mercancia_danada: ['dañad', 'daño', 'roto', 'rota', 'aplastad', 'mojad', 'estropead', 'golpe', 'rotura'],
}

const URGENTE = ['urgente', 'accidente', 'herido', 'peligro', 'grave', 'cortada', 'bloquea', 'incendio']

/** Extrae un ID de envío tipo "#4821", "envío 4821", "pedido 3390"… */
export function extractEnvioId(mensaje: string): string | null {
  const m = mensaje.match(/(?:#|env[íi]o\s*|pedido\s*|ref\.?\s*)(\d{3,6})/i)
  return m ? `#${m[1]}` : null
}

/**
 * Clasificador local de respaldo (sin IA ni red). Determinista: mismo texto,
 * mismo resultado. Se usa cuando el backend de IA no está disponible.
 */
export function localTriage(mensaje: string): TriageResult {
  const t = mensaje.toLowerCase()

  let tipo: IncidentType = 'otro'
  let best = 0
  for (const [key, words] of Object.entries(KEYWORDS)) {
    const score = words.reduce((n, w) => (t.includes(w) ? n + 1 : n), 0)
    if (score > best) {
      best = score
      tipo = key as IncidentType
    }
  }

  let gravedad: Severity =
    tipo === 'averia' || tipo === 'mercancia_danada'
      ? 'alta'
      : tipo === 'otro'
        ? 'baja'
        : 'media'
  if (URGENTE.some((w) => t.includes(w))) gravedad = 'critica'

  const confianza = tipo === 'otro' ? 0.4 : Math.min(0.55 + best * 0.1, 0.85)

  return {
    tipo,
    gravedad,
    envioId: extractEnvioId(mensaje),
    resumen: resumir(mensaje),
    accionSugerida: ACCION[tipo],
    confianza: Number(confianza.toFixed(2)),
    fuente: 'local',
  }
}

function resumir(mensaje: string): string {
  const clean = mensaje.replace(/\s+/g, ' ').trim()
  return clean.length > 110 ? clean.slice(0, 110).trimEnd() + '…' : clean
}

/** Normaliza y valida una respuesta que dice venir de la IA. */
function normalizeFromApi(data: unknown, mensaje: string): TriageResult {
  const d = (data ?? {}) as Partial<TriageResult>
  const tiposValidos: IncidentType[] = [
    'retraso', 'averia', 'direccion_erronea', 'cliente_ausente', 'mercancia_danada', 'otro',
  ]
  const gravsValidas: Severity[] = ['baja', 'media', 'alta', 'critica']

  const tipo = tiposValidos.includes(d.tipo as IncidentType) ? (d.tipo as IncidentType) : 'otro'
  const gravedad = gravsValidas.includes(d.gravedad as Severity) ? (d.gravedad as Severity) : 'media'
  const conf = typeof d.confianza === 'number' ? Math.max(0, Math.min(1, d.confianza)) : 0.8

  return {
    tipo,
    gravedad,
    envioId: d.envioId ?? extractEnvioId(mensaje),
    resumen: d.resumen?.trim() || resumir(mensaje),
    accionSugerida: d.accionSugerida?.trim() || ACCION[tipo],
    confianza: Number(conf.toFixed(2)),
    fuente: 'ia',
  }
}

/**
 * Triaje de un mensaje. Intenta el backend de IA (/api/triage → Gemini);
 * si no está disponible (dev local sin serverless, sin key, o sin red),
 * cae al clasificador local. El demo nunca falla.
 */
export async function triageMessage(mensaje: string): Promise<TriageResult> {
  try {
    const res = await fetch('/api/triage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensaje }),
    })
    if (res.ok) {
      const data = await res.json()
      return normalizeFromApi(data, mensaje)
    }
  } catch {
    /* sin red o sin backend → fallback */
  }
  return localTriage(mensaje)
}
