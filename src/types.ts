export type IncidentType =
  | 'retraso'
  | 'averia'
  | 'direccion_erronea'
  | 'cliente_ausente'
  | 'mercancia_danada'
  | 'otro'

export type Severity = 'baja' | 'media' | 'alta' | 'critica'

/** Salida estructurada del triaje (venga de la IA o del clasificador local). */
export interface TriageResult {
  tipo: IncidentType
  gravedad: Severity
  envioId: string | null
  resumen: string
  accionSugerida: string
  /** Confianza 0..1 */
  confianza: number
  /** De dónde salió la clasificación. */
  fuente: 'ia' | 'local'
}

/** Una incidencia ya triada y guardada en la bandeja. */
export interface Incident extends TriageResult {
  id: string
  mensaje: string
  createdAt: string
  /** Zona detectada en el mensaje (para el mapa). */
  zona?: string
  lat?: number
  lng?: number
}

export const TIPO_LABEL: Record<IncidentType, string> = {
  retraso: 'Retraso',
  averia: 'Avería',
  direccion_erronea: 'Dirección errónea',
  cliente_ausente: 'Cliente ausente',
  mercancia_danada: 'Mercancía dañada',
  otro: 'Otro',
}

export const TIPO_ICON: Record<IncidentType, string> = {
  retraso: '⏱',
  averia: '🔧',
  direccion_erronea: '📍',
  cliente_ausente: '🚪',
  mercancia_danada: '📦',
  otro: '•',
}

export const GRAVEDAD_LABEL: Record<Severity, string> = {
  baja: 'Baja',
  media: 'Media',
  alta: 'Alta',
  critica: 'Crítica',
}

export const GRAVEDAD_ORDER: Record<Severity, number> = {
  critica: 0,
  alta: 1,
  media: 2,
  baja: 3,
}
