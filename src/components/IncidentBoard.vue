<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  GRAVEDAD_ORDER,
  TIPO_ICON,
  TIPO_LABEL,
  type Incident,
  type IncidentType,
  type Severity,
} from '../types'
import SeverityBadge from './SeverityBadge.vue'

const props = defineProps<{ incidents: Incident[] }>()
const emit = defineEmits<{ remove: [id: string] }>()

const filtroTipo = ref<IncidentType | 'todos'>('todos')
const filtroGravedad = ref<Severity | 'todas'>('todas')

const tipos: (IncidentType | 'todos')[] = [
  'todos', 'retraso', 'averia', 'direccion_erronea', 'cliente_ausente', 'mercancia_danada', 'otro',
]

const filtradas = computed(() =>
  props.incidents
    .filter((i) => filtroTipo.value === 'todos' || i.tipo === filtroTipo.value)
    .filter((i) => filtroGravedad.value === 'todas' || i.gravedad === filtroGravedad.value)
    .slice()
    .sort((a, b) => GRAVEDAD_ORDER[a.gravedad] - GRAVEDAD_ORDER[b.gravedad]),
)

function hora(iso: string): string {
  return new Date(iso).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <section aria-label="Bandeja de incidencias">
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
      <h2 class="font-display text-lg font-semibold text-ink">Bandeja de incidencias</h2>
      <div class="flex flex-wrap gap-2">
        <label class="sr-only" for="f-tipo">Filtrar por tipo</label>
        <select
          id="f-tipo"
          v-model="filtroTipo"
          class="rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink focus:border-teal focus:outline-none"
        >
          <option v-for="t in tipos" :key="t" :value="t">
            {{ t === 'todos' ? 'Todos los tipos' : TIPO_LABEL[t as IncidentType] }}
          </option>
        </select>
        <label class="sr-only" for="f-gravedad">Filtrar por gravedad</label>
        <select
          id="f-gravedad"
          v-model="filtroGravedad"
          class="rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink focus:border-teal focus:outline-none"
        >
          <option value="todas">Toda gravedad</option>
          <option value="critica">Crítica</option>
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>
      </div>
    </div>

    <!-- Vacío -->
    <div
      v-if="!incidents.length"
      class="rounded-2xl border border-dashed border-line bg-white/60 px-6 py-12 text-center"
    >
      <p class="text-sm text-muted">
        Aún no hay incidencias. Analiza un mensaje y añádelo para verlo aquí.
      </p>
    </div>

    <div
      v-else-if="!filtradas.length"
      class="rounded-2xl border border-dashed border-line bg-white/60 px-6 py-10 text-center"
    >
      <p class="text-sm text-muted">Ninguna incidencia coincide con el filtro.</p>
    </div>

    <ul v-else class="grid gap-3 sm:grid-cols-2">
      <li
        v-for="inc in filtradas"
        :key="inc.id"
        class="group flex flex-col gap-3 rounded-2xl border border-line bg-white p-4 shadow-sm"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-2.5">
            <span class="grid h-9 w-9 place-items-center rounded-lg bg-canvas text-lg" aria-hidden="true">
              {{ TIPO_ICON[inc.tipo] }}
            </span>
            <div>
              <p class="font-medium leading-tight text-ink">{{ TIPO_LABEL[inc.tipo] }}</p>
              <p class="font-mono text-[11px] text-muted">
                <span v-if="inc.envioId">{{ inc.envioId }} · </span>{{ hora(inc.createdAt) }}
              </p>
            </div>
          </div>
          <SeverityBadge :gravedad="inc.gravedad" />
        </div>

        <p class="line-clamp-2 text-sm text-ink-700">{{ inc.resumen }}</p>
        <p class="flex items-start gap-1.5 text-xs text-muted">
          <span class="text-gold" aria-hidden="true">➜</span>{{ inc.accionSugerida }}
        </p>

        <button
          type="button"
          class="self-end text-xs font-medium text-muted transition-colors hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          @click="emit('remove', inc.id)"
        >
          Resolver
        </button>
      </li>
    </ul>
  </section>
</template>
