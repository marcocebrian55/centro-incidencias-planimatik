<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { TIPO_LABEL, type Incident, type Severity } from '../types'

const props = defineProps<{ incidents: Incident[] }>()

const el = ref<HTMLDivElement | null>(null)
let map: L.Map | null = null
let layer: L.LayerGroup | null = null

const color: Record<Severity, string> = {
  baja: '#10b981',
  media: '#f59e0b',
  alta: '#f97316',
  critica: '#ef4444',
}

function render() {
  if (!map || !layer) return
  layer.clearLayers()
  const conCoords = props.incidents.filter((i) => i.lat != null && i.lng != null)

  for (const i of conCoords) {
    const marker = L.circleMarker([i.lat!, i.lng!], {
      radius: 9,
      color: '#ffffff',
      weight: 2,
      fillColor: color[i.gravedad],
      fillOpacity: 0.9,
    })
    const envio = i.envioId ? ` · ${i.envioId}` : ''
    marker.bindPopup(
      `<strong>${TIPO_LABEL[i.tipo]}</strong>${envio}<br><span style="color:#5b6b7f">${i.zona ?? ''}</span><br>${i.resumen}`,
    )
    layer.addLayer(marker)
  }

  if (conCoords.length) {
    const bounds = L.latLngBounds(conCoords.map((i) => [i.lat!, i.lng!] as [number, number]))
    map.fitBounds(bounds.pad(0.35), { maxZoom: 12 })
  }
}

onMounted(() => {
  if (!el.value) return
  map = L.map(el.value, { scrollWheelZoom: false }).setView([28.05, -15.5], 10)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap',
    maxZoom: 18,
  }).addTo(map)
  layer = L.layerGroup().addTo(map)
  render()
})

watch(() => props.incidents, render, { deep: true })

onBeforeUnmount(() => {
  map?.remove()
  map = null
  layer = null
})
</script>

<template>
  <!-- relative z-0 aísla los z-index altos de Leaflet bajo la cabecera sticky -->
  <div class="relative z-0 overflow-hidden rounded-2xl border border-line shadow-sm">
    <div
      ref="el"
      class="h-72 w-full sm:h-80"
      role="img"
      aria-label="Mapa de incidencias en Gran Canaria"
    />
    <p
      v-if="!incidents.some((i) => i.lat != null)"
      class="absolute inset-0 z-[400] grid place-items-center bg-white/70 text-sm text-muted"
    >
      Las incidencias con zona detectada aparecerán aquí en el mapa.
    </p>
  </div>
</template>
