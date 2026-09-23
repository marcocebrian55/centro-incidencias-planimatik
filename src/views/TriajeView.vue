<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import TriageInput from '../components/TriageInput.vue'
import TriageResult from '../components/TriageResult.vue'
import { triageMessage } from '../services/triage'
import { useIncidentsStore } from '../stores/incidents'
import type { TriageResult as Result } from '../types'

const store = useIncidentsStore()

const loading = ref(false)
const current = ref<Result | null>(null)
const currentMensaje = ref('')
const justAdded = ref(false)

async function onAnalyze(mensaje: string) {
  loading.value = true
  current.value = null
  justAdded.value = false
  currentMensaje.value = mensaje
  try {
    current.value = await triageMessage(mensaje)
  } finally {
    loading.value = false
  }
}

function onAdd() {
  if (!current.value) return
  store.add(currentMensaje.value, current.value)
  current.value = null
  currentMensaje.value = ''
  justAdded.value = true
}
</script>

<template>
  <div>
    <div class="mb-6 max-w-2xl">
      <h1 class="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
        Triaje de incidencias con IA
      </h1>
      <p class="mt-2 text-sm leading-relaxed text-muted sm:text-base">
        El conductor escribe como habla. La IA lo convierte en una incidencia estructurada
        —tipo, gravedad, envío y acción— para que operaciones reaccione en segundos.
      </p>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <TriageInput :loading="loading" @analyze="onAnalyze" />
      <TriageResult :result="current" :loading="loading" @add="onAdd" />
    </div>

    <transition
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-200"
      leave-to-class="opacity-0"
    >
      <RouterLink
        v-if="justAdded"
        to="/bandeja"
        class="mt-4 flex items-center justify-between gap-3 rounded-xl border border-teal/30 bg-teal/5 px-4 py-3 text-sm font-medium text-teal-600 hover:bg-teal/10"
      >
        <span>Incidencia añadida a la bandeja.</span>
        <span class="font-semibold">Ver bandeja →</span>
      </RouterLink>
    </transition>
  </div>
</template>
