<script setup lang="ts">
import { computed } from 'vue'
import type { Incident } from '../types'

const props = defineProps<{ incidents: Incident[] }>()

const total = computed(() => props.incidents.length)
const criticas = computed(
  () => props.incidents.filter((i) => i.gravedad === 'critica' || i.gravedad === 'alta').length,
)
const averias = computed(() => props.incidents.filter((i) => i.tipo === 'averia').length)
const retrasos = computed(() => props.incidents.filter((i) => i.tipo === 'retraso').length)

const kpis = computed(() => [
  { label: 'Incidencias', value: total.value, accent: 'text-ink' },
  { label: 'Alta / crítica', value: criticas.value, accent: 'text-red-600' },
  { label: 'Averías', value: averias.value, accent: 'text-orange-600' },
  { label: 'Retrasos', value: retrasos.value, accent: 'text-amber-600' },
])
</script>

<template>
  <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
    <div
      v-for="kpi in kpis"
      :key="kpi.label"
      class="rounded-xl border border-line bg-white px-4 py-3 shadow-sm"
    >
      <p class="font-display text-2xl font-semibold tabular-nums" :class="kpi.accent">
        {{ kpi.value }}
      </p>
      <p class="mt-0.5 text-xs font-medium text-muted">{{ kpi.label }}</p>
    </div>
  </div>
</template>
