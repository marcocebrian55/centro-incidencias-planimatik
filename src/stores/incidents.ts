import { defineStore, type PiniaPluginContext } from 'pinia'
import type { Incident, TriageResult } from '../types'
import { geocodeZona } from '../data/zonas'

const STORAGE_KEY = 'cargobot.incidencias'

function load(): Incident[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Incident[]) : []
  } catch {
    return []
  }
}

function nuevoId(): string {
  return crypto.randomUUID?.() ?? String(Date.now() + Math.random())
}

export const useIncidentsStore = defineStore('incidents', {
  state: () => ({
    items: load() as Incident[],
  }),

  getters: {
    total: (s) => s.items.length,
    criticas: (s) => s.items.filter((i) => i.gravedad === 'critica' || i.gravedad === 'alta').length,
    averias: (s) => s.items.filter((i) => i.tipo === 'averia').length,
    retrasos: (s) => s.items.filter((i) => i.tipo === 'retraso').length,
    conCoordenadas: (s) => s.items.filter((i) => i.lat != null && i.lng != null),
  },

  actions: {
    add(mensaje: string, result: TriageResult): Incident {
      const id = nuevoId()
      const { zona, lat, lng } = geocodeZona(mensaje, id)
      const incidencia: Incident = {
        ...result,
        id,
        mensaje,
        createdAt: new Date().toISOString(),
        zona,
        lat,
        lng,
      }
      this.items = [incidencia, ...this.items]
      return incidencia
    },
    remove(id: string) {
      this.items = this.items.filter((i) => i.id !== id)
    },
    clear() {
      this.items = []
    },
  },
})

/** Plugin de persistencia: guarda el estado en localStorage tras cada cambio. */
export function persistIncidents({ store }: PiniaPluginContext) {
  if (store.$id !== 'incidents') return
  store.$subscribe((_mutation, state) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify((state as { items: Incident[] }).items))
    } catch {
      /* almacenamiento no disponible */
    }
  })
}
