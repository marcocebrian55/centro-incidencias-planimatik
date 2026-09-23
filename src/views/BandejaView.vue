<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import KpiRow from '../components/KpiRow.vue'
import IncidentBoard from '../components/IncidentBoard.vue'
import MapaIncidencias from '../components/MapaIncidencias.vue'
import { useIncidentsStore } from '../stores/incidents'

const store = useIncidentsStore()
const incidents = computed(() => store.items)
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 class="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Bandeja de operaciones
        </h1>
        <p class="mt-1 text-sm text-muted">
          Incidencias triadas, ubicadas en Gran Canaria y priorizadas por gravedad.
        </p>
      </div>
      <RouterLink
        to="/"
        class="rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink-700"
      >
        + Nueva incidencia
      </RouterLink>
    </div>

    <KpiRow :incidents="incidents" />

    <div v-if="incidents.length" class="space-y-2">
      <h2 class="font-display text-sm font-semibold uppercase tracking-wide text-muted">
        Mapa de incidencias
      </h2>
      <MapaIncidencias :incidents="incidents" />
    </div>

    <IncidentBoard :incidents="incidents" @remove="store.remove" />
  </div>
</template>
