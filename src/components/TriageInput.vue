<script setup lang="ts">
import { ref } from 'vue'
import { EXAMPLES } from '../data/examples'

defineProps<{ loading: boolean }>()
const emit = defineEmits<{ analyze: [mensaje: string] }>()

const mensaje = ref('')

function loadExample(text: string) {
  mensaje.value = text
}

function submit() {
  const val = mensaje.value.trim()
  if (val) emit('analyze', val)
}
</script>

<template>
  <section
    class="flex flex-col rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6"
    aria-label="Nueva incidencia"
  >
    <div class="mb-3 flex items-center gap-2">
      <span class="grid h-7 w-7 place-items-center rounded-lg bg-ink text-sm text-white">✦</span>
      <h2 class="font-display text-lg font-semibold text-ink">Mensaje entrante</h2>
    </div>
    <p class="mb-3 text-sm text-muted">
      Pega el mensaje del conductor o cliente. La IA lo convierte en una incidencia estructurada.
    </p>

    <label for="mensaje" class="sr-only">Mensaje de la incidencia</label>
    <textarea
      id="mensaje"
      v-model="mensaje"
      rows="5"
      placeholder="Ej.: Se me ha pinchado en la GC-1, llevo el envío #4821 y llego 2 h tarde…"
      class="w-full resize-y rounded-xl border border-line bg-canvas p-3.5 text-sm leading-relaxed text-ink placeholder:text-muted/70 focus:border-teal focus:bg-white focus:outline-none"
      @keydown.ctrl.enter="submit"
    />

    <div class="mt-3">
      <p class="mb-2 text-xs font-medium text-muted">Prueba con un caso real:</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="ex in EXAMPLES"
          :key="ex.label"
          type="button"
          class="rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-ink-700 transition-colors hover:border-teal hover:text-teal-600 active:bg-canvas"
          @click="loadExample(ex.text)"
        >
          {{ ex.label }}
        </button>
      </div>
    </div>

    <button
      type="button"
      class="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="loading || !mensaje.trim()"
      @click="submit"
    >
      <svg
        v-if="loading"
        class="h-4 w-4 animate-spin"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
      {{ loading ? 'Analizando…' : 'Analizar con IA' }}
    </button>
  </section>
</template>
